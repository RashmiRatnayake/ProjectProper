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


router.get('/profile',verifyToken, (req,res)=>{
  
    var token = headerUtil.extractTokenFromHeader(req)
    if(token!=null){
      var userId = util.getUserIdFromToken(token)
    }
    connection.query("select u.*,a.* from user u join UserAttributes a on u.userId = a.User_userId where userId= ? ",[userId],function (err,results, fields) {
      if(results){
        res.json({user:results[0]});
  
    }
  
  });
  });


  router.post('/editInfo',function (req,res) {
    console.log(req.body)
          //var trnId=req.body.trnId;
          const editinfo = {
            userId:req.body.userId,
            businessName:req.body.businessName,
            status:1,
            businessAddress:req.body.businessAddress,
            tagline: req.body.tagline,
            //modifiedDate:new Date(),
            contactName:req.body.contactName,
            contactNo:req.body.contactNo,
            contactEmail:req.body.contactEmail,
            description:req.body.description,
            bank:req.body.bank,
            accountName:req.body.accountName,
            accountNo:req.body.accountNo
            
      
            
        };
        //const modifiedDate=new Date();
       // console.log(trnId)
        //let sql = "UPDATE transactionrecord SET supplier = ?,dealer = ?,status=?,amountPending=?, totalAmount=?, amountSettled=?,trnStatus=?, trnDate=?, modifiedDate=?,dueDate=?,trnDescription=?,remarks=?) values(?) WHERE trnId=?";
        let sql = "UPDATE userAttributes SET businessName='"
        +editinfo.businessName+"', businessAddress='"
        +editinfo.businessAddress+"', bank='"
        +editinfo.bank+"', accountName='"
        +editinfo.accountName+"', accountNo='"
        +editinfo.accountNo+"',tagline='"
        +editinfo.tagline+"',contactName='"
        +editinfo.contactName+"',contactEmail='"
        +editinfo.contactEmail+"',contactNo="
        +editinfo.contactNo+", description='"
        +editinfo.description+"', modifiedDate=Now()  WHERE User_userid='"
        +editinfo.userId+"'";      
      
       // +"`, modifiedDate=`"+updatetransactiondata.modifiedDate+"',duedate='"+updatetransactiondata.dueDate+"',trnDescription='"+updatetransactiondata.trnDescription+"',remarks='"+updatetransactiondata.remarks+"'
        connection.query(sql, function (err,result){
              if(err){
                console.log(err)
                res.json({state:false,msg:"data not updated"})
              }
              else{
                res.json({state:true,msg:"data updated"});
                console.log("information updated")
  
         
          }
          
        });
        
            
   
          });
  


module.exports = router;

