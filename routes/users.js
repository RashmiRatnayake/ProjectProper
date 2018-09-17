const express=require('express');
var app = express();
var mysql=require('mysql');
const bcrypt = require('bcryptjs');
var connection = require('../config/connection');
var router = express.Router();


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
                  res.json({state:true,msg:"data inserted"})
                }
              });
            }
          });
});

router.post('/login',function (req,res) {
  console.log("hello");
  var email = req.body.inputEmail;
  var password = req.body.inputPassword;
  connection.query("select * from user where email= ?",[email],function (err,results, fields) {

    //if(err) console.log("Not a registered user");console.log(results);

    if(results){
      if (results[0]==undefined){
        console.log("Not a registered user");
      }
      else{
        console.log(results[0]);
        var result=bcrypt.compareSync(password, results[0].password);
        console.log(result);
        if(result==true){
          console.log("logged in");
        }
        else{
          console.log("Password incorrect");
        }
      }
      //email password correct
      //create jwt token
      //sent to cient
    }


  });
});

module.exports = router;
