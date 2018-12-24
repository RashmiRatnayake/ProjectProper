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




router.post('/register',function (req,res) { 
  const userdata = {
    userId:uuid,
    status:1,
    email:req.body.form_email,
    createdDate: new Date(),
    lastModifiedDate:new Date(),
    userType:req.body.opt,
    password:req.body.password
  };
  const userattributesdata={
    attributesId:uuid,
    createdDate:userdata.createdDate,
    modifiedDate:new Date(),
    businessName:req.body.CompanyName,
    contactNo:req.body.tp,
    description:req.body.form_about_yourself
  };
 // console.log(userdata.userId);
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(userdata.password, salt);
  userdata.password=hash;


  connection.query("INSERT INTO User SET ?", userdata,function (err,result) {
    
    if(result){
      let sql = "INSERT INTO UserAttributes (User_userid, attributesId, businessName, contactNo, description,User_userId, createdDate, modifiedDate) values(?)"
      let vals = [userdata.userId, userattributesdata.attributesId,userattributesdata.businessName,userattributesdata.contactNo,userattributesdata.description,result.insertId,userattributesdata.createdDate,userattributesdata.modifiedDate]

      connection.query(sql,[vals], function (err,result){
        if(err){
          res.json({state:false,msg:"data not inserted"})
        }
        else{
          res.json({state:true,msg:"data inserted"});
        }
      });
    }   
  });
});



router.post('/login',function (req,res) {
  
  var email = req.body.inputEmail;
  var password = req.body.inputPassword;
  connection.query("select u.*,a.businessName from user u join UserAttributes a on u.userId = a.User_userId where email= ?",[email],function (err,results, fields) {

    if(results){
      if (results[0]==undefined){
        console.log("Not a registered user");
      }
      else{
        var result=bcrypt.compareSync(password, results[0].password);
        console.log(result);

        if(result==true){
          console.log("type is :" ,typeof results[0]);

          var results={
            userId : results[0].userId,
            email: results[0].email,
            userType:results[0].userType,
            businessName: results[0].businessName

          };

          token=jwt.sign(results, process.env.SECRET_KEY, {
            expiresIn: 5000
          });
          
          res.send({logged:true, token:token});

        }
        else{
          console.log("Password incorrect");
        }
      }

    }
    
  });
});


router.post("/save", verifyToken, (req,res)=>{
  var token = headerUtil.extractTokenFromHeader(req)
  if(token!=null){
    var userId = util.getUserIdFromToken(token)
  }
});


router.get('/profile',verifyToken, (req,res)=>{

  var token = headerUtil.extractTokenFromHeader(req);
  if(token!=null){
    var userId = util.getUserIdFromToken(token);
  }

  connection.query("select u.*,a.* from user u join UserAttributes a on u.userId = a.User_userId where userId= ?",[userId],function (err,results, fields) {
      
    if(results){
      var user={
        userId : results[0].userId,
        email: results[0].email,
        userType:results[0].userType,
        businessName: results[0].businessName,
        tagline: results[0].tagline

      };
    
      res.status(200).send(user);
      res.end();
    }

  });

});


module.exports = router;
