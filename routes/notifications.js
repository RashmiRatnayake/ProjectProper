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


router.get('/my-notifications-today',verifyToken, (req,res)=>{
    
      var token = headerUtil.extractTokenFromHeader(req)
      if(token!=null){
        var userId = util.getUserIdFromToken(token)
      }
      var day=new Date();
      connection.query("select * from notification where (supplier=? OR dealer= ?) AND due='today' AND DATE(dateToday)=DATE(?)",[userId,userId,day],function (err,results, fields) {
        if(results){
            //console.log(results);

          res.json({notificationToday:results});
    
        }
    
    });
    });





module.exports = router;