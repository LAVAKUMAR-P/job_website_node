const jwt=require('jsonwebtoken')
//authondication
const authenticate=(req, res, next)=> {
    try {
    // Check if the token is present
    // if present -> check if it is valid
    if(req.headers.authorization){
        jwt.verify(req.headers.authorization,process.env.JWT_SECRET,function(error,decoded){
            if(error){
                res.status(401).json({
                    message: "Unauthorized"
                })
            }else{
                
                req.userid = decoded.id;
            next()
            }
            
        });
      
    }else{
        res.status(401).json({
            message: "No Token Present"
        })
    }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
    
  }

  module.exports=authenticate;