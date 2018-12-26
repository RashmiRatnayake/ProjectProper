const express=require('express');
var app = express();
var mysql=require('mysql');
const bcrypt = require('bcryptjs');
var connection = require('../config/connection');
var uuid = require('../routes/uuid');
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
  connection.query("select * from transactionrecord where dealer= ? OR supplier= ? ORDER BY CASE trnStatus WHEN 'Unpaid' THEN 1 WHEN 'partially paid' THEN 2 ELSE 3 END ",[userId,userId],function (err,results, fields) {
    if(results){
      //console.log(results);
      res.json({transaction:results});

  }

});
});

router.get('/mypendingtransactions',verifyToken, (req,res)=>{
  
    var token = headerUtil.extractTokenFromHeader(req)
    if(token!=null){
      var userId = util.getUserIdFromToken(token)
    }
    connection.query("select * from transactionrecord where (dealer= ? OR supplier= ?) AND (trnStatus='Unpaid' or trnStatus='partially paid') ORDER BY CASE trnStatus WHEN 'Unpaid' THEN 1 ELSE 2 END",[userId,userId],function (err,results, fields) {
      if(results){
        //console.log(results);
        res.json({pendingtransaction:results});
  
    }
  
  });
  });

router.post('/addnew',function (req,res) {


  
  const newtransactiondata = {
      trnId:uuid,
      otherParty:req.body.otherParty,
      status:1,
      amountSettled:req.body.amountSettled,
      trnDate: new Date(),
      modifiedDate:new Date(),
      dueDate:req.body.dueDate,
      trnStatus:req.body.trnStatus,
      amountPending:req.body.amountPending,
      remarks:req.body.remarks,
      trnDescription:req.body.trnDescription,
      totalAmount:req.body.totalAmount,
      supplier:req.body.supplier


  };
  //console.log(newtransactiondata);
      
  connection.query("select User_userid from userAttributes where businessName= ?",[newtransactiondata.otherParty],function (err,results, fields) {
    if(results){
      var dealer;
      dealer=results[0].User_userid;
      //console.log(results);

      let sql = "INSERT INTO transactionrecord (trnId,supplier,dealer,status,amountPending, totalAmount, amountSettled,trnStatus, trnDate, modifiedDate,dueDate,trnDescription,remarks) values(?)"
      let vals = [newtransactiondata.trnId,newtransactiondata.supplier,dealer,newtransactiondata.status,newtransactiondata.amountPending,newtransactiondata.totalAmount,newtransactiondata.amountSettled,newtransactiondata.trnStatus,newtransactiondata.trnDate,newtransactiondata.modifiedDate,newtransactiondata.dueDate,newtransactiondata.trnDescription,newtransactiondata.remarks]

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
   





module.exports = router;


