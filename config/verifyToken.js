var jwt = require('jsonwebtoken');
function verifyToken(req,res,next){
    //console.log("in verifytoken function")
    if (typeof(req.headers['authorization'] != 'undefined') && req.headers['authorization'] != 'undefined'){
      console.log(req.headers);
      var headerToken = req.headers['authorization'].split(' ')[1];
      console.log(headerToken);
      if (headerToken != 'undefined'){
        //console.log("headertoken is not undefined");
      //  console.log(headerToken);
        req.token=headerToken;
        jwt.verify(req.token,process.env.SECRET_KEY,(err,data)=>{
          if (err){
            //res.json({msg:"Access denied"})
          }else{
            //res.json({msg:"Data saved",data:data});
            console.log("verifytokenmethod successful");
            next();
          }
        })

      }else{

        //res.json({msg:"unauthorized request"})
      }
    }else{
      //res.json({msg:"unauthorized request"})
    }
  }

  module.exports = verifyToken;
