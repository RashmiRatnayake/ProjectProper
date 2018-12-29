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

router.get('/my-notifications-in3days',verifyToken, (req,res)=>{
        
  var token = headerUtil.extractTokenFromHeader(req)
  if(token!=null){
    var userId = util.getUserIdFromToken(token)
          
    var day=new Date();
    connection.query("select * from notification where (supplier=? OR dealer= ?) AND due='in 3 days' AND DATE(dateToday)=DATE(?) AND status>0",[userId,userId,day],function (err,results, fields) {
      if(results){
        //console.log("due in 3 days")
        //console.log(results);
    
        res.json({notificationIn3Days:results});
        
      }
        
    });
  }
});

router.get('/my-notifications-today',verifyToken, (req,res)=>{
            
  var token = headerUtil.extractTokenFromHeader(req)
  //console.log("token is",token)
  if(token!=null){
    var userId = util.getUserIdFromToken(token)
    //console.log("userID is",userId)
              
    var day=new Date();
    
    connection.query("select * from notification where (supplier=? OR dealer= ?) AND due='today' AND DATE(dateToday)=DATE(?) AND status>0",[userId,userId,day],function (err,resul, fields) {
      if(resul){
        //console.log("due today")
        //console.log(resul);
        
        res.json({notificationToday:resul});
            
      }
            
    });
  }
});


router.get('/my-notifications-late',verifyToken, (req,res)=>{
                
  var token = headerUtil.extractTokenFromHeader(req)
  //console.log("token is",token)
  if(token!=null){
    var userId = util.getUserIdFromToken(token)
    //console.log("userID is",userId)
                  
    var day=new Date();
    //console.log(day);
    connection.query("select * from notification where (supplier=? OR dealer= ?) AND due='late' AND DATE(dateToday)=DATE(?) AND status>0",[userId,userId,day],function (err,result, fields) {
      if(result){
        //console.log("late")
        console.log(result);
            
        res.json({notificationLate:result});
                
      }
                
    });
  }
});


module.exports = router;