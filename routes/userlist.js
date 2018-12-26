const express=require('express');
var app = express();
var mysql=require('mysql');
const bcrypt = require('bcryptjs');
var connection = require('../config/connection');
var router = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;
var verifyToken = require('../config/verifyToken')
var headerUtil = require('../util/headerUtil')
var util = require('../util/util')


router.use(cors());

process.env.SECRET_KEY="secret_key";

var userType;

router.get('/userlist',verifyToken, (req,res)=>{

  var token = headerUtil.extractTokenFromHeader(req)
  if(token!=null){
    //var userId = util.getUserIdFromToken(token);
    userType=util.getUserTypeFromToken(token);
  }
  if (userType=="Supplier"){
    var dealer="Dealer";
    connection.query("SELECT userId, businessName FROM user u JOIN userattributes a ON u.userId = a.User_userId AND userType = ? WHERE u.status>0",dealer,function (err,results, fields) {
        if(results){
        //console.log(results);
        res.json({userlist:results});

        }

    });
  }
  else{
    var supplier="Supplier";
    connection.query("SELECT userId, businessName FROM user u JOIN userattributes a ON u.userId = a.User_userId AND userType = ? WHERE u.status>0",supplier,function (err,results, fields) {
        if(results){
        //console.log(results);
        res.json({userlist:results});

        }

    });

  }

});





module.exports = router;