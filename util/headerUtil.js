
module.exports = {

    extractTokenFromHeader:function(req){
        var userToken;
        if (typeof(req.headers['authorization'] != 'undefined') && req.headers['authorization'] != 'undefined'){
          var headerToken = req.headers['authorization'].split(' ')[1];
          
          if (headerToken != 'undefined'){
            userToken=headerToken;
            return headerToken;

          }else{
            return null
          }

        }else{
          return null
        }

    }
}
