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
      //console.log(results);
      res.json({transaction:results});

  }

});
});

router.post('/addnew',function (req,res) {
  
  const newtransactiondata = {

      otherParty:req.body.otherParty,
      status:1,
      amountSettled:req.body.amountSettled,
      trnDate: new Date(),
      modifiedDate:new Date(),
      dueDate:req.body.dueDate,
      trnStatus:req.body.trnStatus,
      amountPending:req.body.amountPending,
      remarks:req.body.remarks,

     // userType:req.body.opt,
      
      trnDescription:req.body.trnDescription,
      totalAmount:req.body.totalAmount,
      supplier:req.body.supplier


  };
  console.log(newtransactiondata);
      connection.query("SELECT userId from user where businessName=?",newtransactiondata.supplier,function(err,supplierId){
        // connection.query("INSERT INTO transactionrecord SET ?", newtransactiondata,function (err,result) {
    
       // if(result){
        let sql = "INSERT INTO transactionrecord (supplier,dealer,status,amountPending, totalAmount, amountSettled,trnStatus, trnDate, modifiedDate,dueDate,trnDescription,remarks) values(?)"
        let vals = [supplierId,newtransactiondata.dealer,newtransactiondata.status,newtransactiondata.amountPending,newtransactiondata.totalAmount,newtransactiondata.amountSettled,newtransactiondata.trnStatus,newtransactiondata.trnDate,newtransactiondata.modifiedDate,newtransactiondata.dueDate,newtransactiondata.trnDescription,newtransactiondata.remarks]

        connection.query(sql,[vals], function (err,result){
              if(err){
                //console.log(err);
                res.json({state:false,msg:"data not inserted"})
              }
              else{
                res.json({state:true,msg:"data inserted"});

           //   }
          //  });
          }
          //connection.release();
        });
      
      });
   
});




module.exports = router;


