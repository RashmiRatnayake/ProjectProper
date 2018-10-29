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




router.get('/profile',verifyToken, (req,res)=>{

    var token = headerUtil.extractTokenFromHeader(req)
    if(token!=null){
      var userId = util.getUserIdFromToken(token)
    }
    connection.query("select u.*,a.* from user u join UserAttributes a on u.userId = a.User_userId where userId= ?",[userId],function (err,results, fields) {
      if(results){
        console.log("type is :" ,typeof results[0]);

        var user={
          userId : results[0].userId,
          email: results[0].email,
          userType:results[0].userType,
          businessName: results[0].businessName

        };
      //if(err) console.log("Not a registered user");console.log(results);

        res.json({user:user});

    }

});
});
