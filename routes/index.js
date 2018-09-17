var express=require('express');
var router = express.Router();
var connection=require('../config/connection');


router.get("", (req,res)=>{
  //connection.connectDatabase();
  connection.query('SELECT * FROM User',function(err,rows){
    if (err) throw err;
    console.log(rows);
    res.render('../public/index',{users:rows});
  });
});

router.post('/addUser',function(req,res){
  const userdata={

    status:1,
    CompanyName:req.body.CompanyName,
    form_email:req.body.form_email,
    password:req.body.password,
    confirm_password:req.body.confirm_password,
    tp:req.body.tp,
    form_about_yourself:req.body.form_about_yourself,
    opt:req.body.opt

  }

  console.log(userdata);
  res.send("data inserted");
});

module.exports=router;
