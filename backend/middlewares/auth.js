const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


const isAuthenticateUser = async(req,res,next) =>  {

	try{

    const {token} = req.cookies;

    if(!token){
    	return res.status(401).json({message: "Please login to access this products"});
    }

    const decodedData = await jwt.verify(token,process.env.SECRET_KEY);

    req.user = await User.findById(decodedData.id);


    next();
   

	}catch(err){
		res.status(500).json({message: "internal server error"});

	}
}


const authorizeRoles = (...roles) => {
 

  return (req,res,next) => {

   if(!roles.includes(req.user.role)){
  
     return res.status(403).json({message: `Role: ${req.user.role} is not allowed to access this resource`})

   }

  next();
  }


}


module.exports = {isAuthenticateUser,authorizeRoles};