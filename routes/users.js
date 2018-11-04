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


router.post('/register',function (req,res) {
  console.log("lets take userdata");
  const userdata = {

      //status:req.body.status,
      status:1,
      email:req.body.form_email,
      createdDate: new Date(),
      lastModifiedDate:new Date(),
      userType:req.body.opt,
      password:req.body.password


  };
const userattributesdata={
    createdDate:userdata.createdDate,
    modifiedDate:new Date(),
    businessName:req.body.CompanyName,
    contactNo:req.body.tp,
    description:req.body.form_about_yourself
  };


  console.log(req.body);
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(userdata.password, salt);
  userdata.password=hash;
  console.log(hash);

      connection.query("INSERT INTO User SET ?", userdata,function (err,result) {
        console.log(result);
        if(result){
          let sql = "INSERT INTO UserAttributes (businessName, contactNo, description,User_userId, createdDate, modifiedDate) values(?)"
          let vals = [userattributesdata.businessName,userattributesdata.contactNo,userattributesdata.description,result.insertId,userattributesdata.createdDate,userattributesdata.modifiedDate]

          connection.query(sql,[vals], function (err,result){
                if(err){
                  //console.log(err);
                  res.json({state:false,msg:"data not inserted"})
                }
                else{
                  res.json({state:true,msg:"data inserted"});

                }
              });
            }
            //connection.release();
          });
});

router.post('/login',function (req,res) {
  console.log("hello");
  var email = req.body.inputEmail;
  var password = req.body.inputPassword;
  connection.query("select u.*,a.businessName from user u join UserAttributes a on u.userId = a.User_userId where email= ?",[email],function (err,results, fields) {

    //if(err) console.log("Not a registered user");console.log(results);

    if(results){
      if (results[0]==undefined){
        console.log("Not a registered user");
      }
      else{
        //console.log(results[0]);
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

          //email password correct
          //create jwt token
          //send to client

          token=jwt.sign(results, process.env.SECRET_KEY, {
            expiresIn: 5000
          });
          console.log("logged in");



          console.log(token);

          res.send({logged:true, token:token});

        }
        else{
          console.log("Password incorrect");
        }
      }

    }
    //connection.release();

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
    //console.log(token);
    if(token!=null){
      var userId = util.getUserIdFromToken(token);
    }

      connection.query("select u.*,a.* from user u join UserAttributes a on u.userId = a.User_userId where userId= ?",[userId],function (err,results, fields) {
      //  console.log("baaa");

        if(results){
          //console.log("type is :" ,typeof results[0]);
          //console.log(results[0]);

          var user={
            userId : results[0].userId,
            email: results[0].email,
            userType:results[0].userType,
            businessName: results[0].businessName,
            tagline: results[0].tagline

          };
        //if(err) console.log("Not a registered user");console.log(results);
        console.log(user);
          //res.json({user:res.user});
          //console.trace(err);
          //connection.end();
          //console.log("bbb");
            res.status(200).send(user);
            res.end();
      }



  });



    //console.log(userId);


});



/*
router.use(function(req, res, next) {
 var token = req.body.token || req.headers['token'];
 var appData = {};
 if (token) {
 jwt.verify(token, process.env.SECRET_KEY, function(err) {
 if (err) {
 appData["error"] = 1;
 appData["data"] = "Token is invalid";
 res.status(500).json(appData);
 } else {
 next();
 }
 });
 } else {
 appData["error"] = 1;
 appData["data"] = "Please send a token";
 res.status(403).json(appData);
 }
});

router.get('/getUsers', function(req, res) {
var token = req.body.token || req.headers['token'];
var appData = {};
database.connection.getConnection(function(err, connection) {
 if (err) {
 appData["error"] = 1;
 appData["data"] = "Internal Server Error";
 res.status(500).json(appData);
 } else {
 connection.query('SELECT *FROM users', function(err, rows, fields) {
 if (!err) {
 appData["error"] = 0;
 appData["data"] = rows;
 res.status(200).json(appData);
 } else {
 appData["data"] = "No data found";
 res.status(204).json(appData);
 }
 });
 //connection.release();
 }
 });
});
*/


module.exports = router;
