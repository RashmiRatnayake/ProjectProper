//get userid from token
var jwt = require('jsonwebtoken');
process.env.SECRET_KEY="secret_key";

module.exports = {

    //get userid from token
    getUserIdFromToken:function (token){
        var employeeId;
        jwt.verify(token,process.env.SECRET_KEY,(err,data)=>{
            if (err){

            }else{
              console.log("token verified");
              employeeId = data.userId;
            }
          })

         return employeeId;
    }
}
