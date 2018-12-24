//get userid from token
var jwt = require('jsonwebtoken');
process.env.SECRET_KEY="secret_key";

module.exports = {

    //get userid from token
    getUserIdFromToken:function (token){
        var userid;
        jwt.verify(token,process.env.SECRET_KEY,(err,data)=>{
            if (err){

            }else{
              //console.log("token verified");
              userid = data.userId;
            }
          })

         return userid;
    },

     //get usertype from token
     getUserTypeFromToken:function (token){
        var usertype;
        jwt.verify(token,process.env.SECRET_KEY,(err,data)=>{
            if (err){

            }else{
              //console.log("token verified");
              usertype= data.userType;
            }
          })

         return usertype;
    }
}
