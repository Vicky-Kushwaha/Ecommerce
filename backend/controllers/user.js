const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const registerUser = async(req,res) => {

  try{

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

  	const {name,role,email,password} = req.body;

  	const user = await User.create({
  		name,
      role,
  		email,
  		password,
  		avatar: {
  			public_id: myCloud.public_id,
  			url: myCloud.secure_url,
  		},
  	});

   sendToken(user,200,res);


  }catch(err){
  	res.status(500).json({message: err.message});
  }

}



//Login User
const loginUser = async(req,res) => {

  try{

  	const {email,password} = req.body;

  	const userExist = await User.findOne({email});
  	
  	const userData = await bcrypt.compare(password,userExist.password);

  	if(userData){

  			sendToken(userExist,200,res);

  	}else{
  		res.status(401).json({ message: "Invalid email or password" });
  	}


  }catch(err){
  	res.status(500).json({message: "Invalid credentials"});
  }

}


//Logout user
const logout = async(req,res) => {

  try{

 res.cookie("token",null,{
    expires: new Date(0),
    httpOnly: true
   });

  res.status(200).json({
    success: true,
    message: "Logged out"
  })


  }catch(err){
    res.status(500).json({message: err.message});
  }

}


// Forget Password 
const forgetPassword = async(req,res) => {

  try{

  const user = await User.findOne({email: req.body.email});
  
  if(!user){
    return res.status(404).json({message: "User not found"});
  }  

  // get resetpassword token
  const resetToken = user.getResetPasswordToken();

  await user.save({validateBeforeSave: false});

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const message = `Your password reset url is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it`;

  try{

    await sendEmail({
      email: user.email,
      subject: "Ecommerce password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`
    });

  }catch(err){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false});

    res.status(500).json({message: err.message});

  }

  }catch(err){
    res.status(500).json({message: err.message});
  }

}


//Reset Password
const resetPassword = async(req,res) => {
  
  try{

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken
    });

    if(!user){
     return res.status(400).json({message: "Reset password token is invalid or has been expired"});
    }


    if(req.body.password !== req.body.confirmPassword){
       return res.status(400).json({message: "Password does not matched"});
    }


    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);


  }catch(err){
    res.status(500).json({message: err.message});
  }

}


//get user detail
const getUserDetails = async(req,res) => {

 try{

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  })


 }catch(err){
   res.status(500).json({message: err.message});
 }

}


//update user password
const updatePassword = async(req,res) => {

  try{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await bcrypt.compare(req.body.oldPassword,user.password);
    
    if(!isPasswordMatched){
      return res.status(400).json({message: "Old password is incorrect"});
    } 

    if(req.body.newPassword !== req.body.confirmPassword){
      return res.status(400).json({message: "password does not match"});
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);


  }catch(err){
    res.status(500).json({message: {message: err.message}});
  }

}


//update user profile
const updateProfile = async(req,res) => {

  try{

    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    }

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder: "avatars",
      width: 150,
      crop: "scale",
    });


    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

   
   const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
     new: true,
     runValidators: true,
     useFindAndModify: false
   });

   res.status(200).json({
    success: true,
    message: "Profile updated successfully"
   }); 


  }catch(err){
    res.status(500).json({message: err.message});
  }

}


//update user role (admin)
const updateUserRole = async(req,res) => {

  try{

    const userData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,userData,{
      new: true,
      runValidators: true,
      useFindAndModify: false
    });
  
   res.status(200).json({
    success: true,
    message: "Role updated successfully"
   }); 

  }catch(err){
    res.status(500).json({message: err.message});
  }

}


//get all users
const getAllUser = async(req,res) => {

  try{

    const users = await User.find();

    res.status(200).json({
      success: true,
      users
    })


  }catch(err){
    res.status(500).json({message: err.message});
  }

}


//Get single user (admin)
const getSingleUser = async(req,res) => {

  try{

    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(404).json({message: `User does not exist with id: ${req.params.id}`});
    }


    res.status(200).json({
      success: true,
      user,
    }); 


  }catch(err){
    res.status(500).json({message: err.message});
  }

}


//Delete user (admin)
const deleteUser = async(req,res) => {

  try{
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
  
    const imageId = user.avatar.public_id;
  
    await cloudinary.v2.uploader.destroy(imageId);
  
    await User.findByIdAndDelete(req.params.id);
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });


  }catch(err){
    res.status(500).json({message: err.message});
  }

}



module.exports = {registerUser,loginUser,logout,forgetPassword,resetPassword,getUserDetails,updatePassword,updateProfile,getAllUser,getSingleUser,updateUserRole,deleteUser};