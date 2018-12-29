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
var uuid = require('../routes/uuid');


router.use(cors());

process.env.SECRET_KEY="secret_key";

var userType;

router.get('/userlist',verifyToken, (req,res)=>{

  var token = headerUtil.extractTokenFromHeader(req)
  if(token!=null){
    var userId = util.getUserIdFromToken(token);
    userType=util.getUserTypeFromToken(token);
  }
  if (userType=="Supplier"){
    var dealer="Dealer";
    connection.query("SELECT * FROM user u JOIN userattributes a ON u.userId = a.User_userId AND userType = ? AND userId NOT IN(SELECT distinct subscribeto from subscription WHERE subscriber = ? AND status>0)",[dealer,userId],function (err,results, fields) {
        if(results){
        //console.log(results);
        res.json({userlist:results});

        }

    });
  }
  else{
    var supplier="Supplier";
    connection.query("SELECT * FROM user u JOIN userattributes a ON u.userId = a.User_userId AND userType = ? AND userId NOT IN(SELECT distinct subscribeto from subscription WHERE subscriber = ? AND status>0 )",[supplier,userId],function (err,results, fields) {
        if(results){
        //console.log(results);
        res.json({userlist:results});

        }

    });

  }

});


router.post('/subscribe',function (req,res) {
    console.log(req.body)
            const susbcriptionData={ subscriptionId:uuid,
          subscribeto:req.body.subscribeto,
           status:1,
        subscriber:req.body.subscriber};
        console.log(susbcriptionData);
      
        let sql = "INSERT INTO subscription (subscriptionId,subscriber,subscribeto,status) values(?)"
        let vals = [susbcriptionData.subscriptionId,susbcriptionData.subscriber,susbcriptionData.subscribeto,susbcriptionData.status]
  
        connection.query(sql,[vals,], function (err,result){
              if(err){
                res.json({state:false,msg:"data not inserted"})
              }
              else{
                res.json({state:true,msg:"data inserted"});
  
         
          }
          
        });
        
            
   
});




module.exports = router;