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


router.get('/my-circle',verifyToken, (req,res)=>{

  var token = headerUtil.extractTokenFromHeader(req)
  if(token!=null){
    var userId = util.getUserIdFromToken(token)
  }
  connection.query("SELECT * FROM subscription S JOIN userattributes U ON S.subscribeto = U.User_userId AND S.subscriber = ? WHERE S.status>0",userId,function (err,results, fields) {
    if(results){
      //console.log(results);    
      res.json({circle:results});
      
     }

  });
});

router.post('/remove',function (req,res) {
  
  const subscriptionId=req.body.subscriptionId;      
  connection.query("UPDATE subscription SET status=0 where subscriptionId= ?",[subscriptionId],function (err,results, fields) {
     
  });           
});

module.exports = router;