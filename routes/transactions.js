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
    var userType= util.getUserTypeFromToken(token)
  }
  if(userType="Dealer"){
    connection.query("select * from transactionrecord t JOIN userattributes a on t.supplier=a.User_userid  where t.dealer= ? OR t.supplier= ? AND t.status>0 ORDER BY CASE trnStatus WHEN 'Unpaid' THEN 1 WHEN 'partially paid' THEN 2 ELSE 3 END ",[userId,userId],function (err,results, fields) {
      if(results){
        //console.log(results);
        res.json({transaction:results});

      }

    });
  }
  else if(userType="Supplier"){
    connection.query("select * from transactionrecord t JOIN userattributes a on t.dealer=a.User_userid  where t.dealer= ? OR t.supplier= ? AND t.status>0 ORDER BY CASE trnStatus WHEN 'Unpaid' THEN 1 WHEN 'partially paid' THEN 2 ELSE 3 END ",[userId,userId],function (err,results, fields) {
      if(results){
        //console.log(results);
        res.json({transaction:results});
  
      }
  
    });
  }
});

router.get('/mypendingtransactions',verifyToken, (req,res)=>{
  
    var token = headerUtil.extractTokenFromHeader(req)
    if(token!=null){
      var userId = util.getUserIdFromToken(token)
      var userType=util.getUserTypeFromToken(token)
    }
    if (userType="Dealer"){
      connection.query("select * from transactionrecord t JOIN userattributes a on t.supplier=a.User_userid where  (t.dealer= ? OR t.supplier= ?) AND (t.trnStatus='Unpaid' or t.trnStatus='partially paid') AND t.status>0 ORDER BY CASE t.trnStatus WHEN 'Unpaid' THEN 1 ELSE 2 END",[userId,userId],function (err,results, fields) {
        if(results){
          console.log(results);
          res.json({pendingtransaction:results});
  
        }
  
      });
    }
    else if (userType="Supplier"){
      connection.query("select * from transactionrecord t JOIN userattributes a on t.dealer=a.User_userid  where (t.dealer= ? OR t.supplier= ?) AND (t.trnStatus='Unpaid' or t.trnStatus='partially paid') AND t.status>0 ORDER BY CASE t.trnStatus WHEN 'Unpaid' THEN 1 ELSE 2 END ",[userId,userId],function (err,results, fields) {
       if(results){
          //console.log(results);
          res.json({pendingtransaction:results});

        } 

      });
    }
  });

  router.get('/viewHistory',verifyToken, (req,res)=>{
    console.log(req.query.trnId)
    
    
      var token = headerUtil.extractTokenFromHeader(req)
      if(token!=null){
        var userId = util.getUserIdFromToken(token)
      }
      console.log(userId)

      var trnId=req.query.trnId;
      console.log(trnId);
      connection.query("select * from updateHistory where trnId= ? ORDER BY modifiedDate DESC ",[trnId],function (err,results, fields) {
        if(results){
          //console.log(results);
          res.json({history:results});
    
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
   

      
router.post('/update',function (req,res) {
  console.log(req.body)
        
        const updatetransactiondata = {
          trnId:req.body.trnId,
          dealer:req.body.dealer,
          status:1,
          amountSettled:req.body.amountSettled,
          trnDate: req.body.trnDate,
          dueDate:req.body.duedate,
          trnStatus:req.body.trnStatus,
          amountPending:req.body.amountPending,
          remarks:req.body.remarks,
          trnDescription:req.body.trnDescription,
          totalAmount:req.body.totalAmount,
          supplier:req.body.supplier
    
          
      };
      const modifiedDate=new Date();
 
      let sql = "UPDATE transactionrecord SET status="
      +updatetransactiondata.status+",amountPending="
      +updatetransactiondata.amountPending+", totalAmount="
      +updatetransactiondata.totalAmount+", amountSettled="
      +updatetransactiondata.amountSettled+",trnStatus='"
      +updatetransactiondata.trnStatus+"', modifiedDate=Now()  WHERE trnId='"
      +updatetransactiondata.trnId+"'";      
    
    
      connection.query(sql, function (err,result){
            if(err){
              console.log(err)
              res.json({state:false,msg:"data not updated"})
            }
            else{
              res.json({state:true,msg:"data updated"});
              console.log("transaction updated")

       
        }
        
      });
      
});

router.post('/delete',function (req,res) {
          
  const trnId=req.body.trnId;
  connection.query("UPDATE transactionrecord SET status=0 where trnId= ?",[trnId],function (err,results, fields) {
          
  });
});
     


module.exports = router;
