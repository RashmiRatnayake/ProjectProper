var express=require('express');
var router = express.Router();
var connection=require('../config/connection');


router.get('/',function (req,res,next){
    res.render('../public/index');
  });



module.exports=router;
