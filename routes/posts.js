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


router.get('/my-posts',verifyToken, (req,res)=>{
    
  var token = headerUtil.extractTokenFromHeader(req)
  if(token!=null){
    var userId = util.getUserIdFromToken(token)
  }
  connection.query("select u.*,p.* from user u join post p on u.userId = p.postedBy where userId= ? AND p.status>0 AND u.status>0 ORDER BY postDate DESC",[userId],function (err,results, fields) {
    if(results){
      //console.log(results);
      res.json({post:results});
    }
    
  });
});


router.post('/newpost', function (req,res) {
  
  const newpostdata = {
            postId:uuid,
            postedBy:req.body.postedBy,
            status:1,
            postContent:req.body.postContent,
            title:req.body.title,
            postDate:new Date(),
  };
  //console.log(newpostdata);
            
  let sql = "INSERT INTO post(postId,postedBy,status,postContent,title,postDate) values(?)"
  let vals = [newpostdata.postId,newpostdata.postedBy,newpostdata.status,newpostdata.postContent,newpostdata.title,newpostdata.postDate]
      
  connection.query(sql,[vals], function (err,result){
    if(err){
      console.log(err)
      res.json({state:false,msg:"post not inserted"})
    }
    else{
      res.json({state:true,msg:"post inserted"});
    }
              
  });
      
});
         
router.post('/deletepost',function (req,res) {
              
  const postId=req.body.postId;
            
  //console.log("postid:",postId)
  connection.query("UPDATE post SET status=0 where postId= ?",[postId],function (err,results, fields) {
    if(err){
      console.log(err)
      res.json({state:false,msg:"post not deleted"})
    }
    else{
      res.json({state:true,msg:"post deleted"});
    }
  });
});
         

module.exports = router;