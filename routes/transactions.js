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


router.get('/my-transactions',verifyToken, (req,res)=>{

  var token = headerUtil.extractTokenFromHeader(req)
  if(token!=null){
    var userId = util.getUserIdFromToken(token)
  }
  connection.query("select * from transactionrecord where dealer= ? OR supplier= ?",[userId,userId],function (err,results, fields) {
    if(results){
      console.log(results);
      res.json({transaction:results});

  }

});
});





module.exports = router;

/* var transactions= function transactions(){

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



module.exports=transactions; */
