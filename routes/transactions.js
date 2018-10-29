const express=require('express');
var app = express();
var mysql=require('mysql');

var connection = require('../config/connection');
var router = express.Router();

var transactions= function transactions(){

  connection.query("select * from transactionRecord  where email= ?",[email],function (err,results, fields) {

    //if(err) console.log("Not a registered user");console.log(results);

    if(results){
      if (results[0]==undefined){
        console.log("Not a registered user");
      }
      else{
        console.log(results[0]);
        var result=bcrypt.compareSync(password, results[0].password);
        console.log(result);


}}});
}










module.exports=transactions;
