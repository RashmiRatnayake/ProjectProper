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


router.get('/my-posts',verifyToken, (req,res)=>{
    
      var token = headerUtil.extractTokenFromHeader(req)
      if(token!=null){
        var userId = util.getUserIdFromToken(token)
      }
      connection.query("select u.*,p.* from user u join post p on u.userId = p.postedBy where userId= ? AND p.status>0 AND u.status>0",[userId],function (err,results, fields) {
        if(results){
            //console.log(results);
          res.json({post:results});
    
      }
    
    });
    });





module.exports = router;