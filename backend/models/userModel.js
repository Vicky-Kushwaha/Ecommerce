const {Schema,model} = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new Schema({

  name:{
  	type: String,
  	required: [true,"Please enter your name"],
  	maxLength:[30,"Name cannot exceed 30 characters"],
  	minLength:[3,"Name should have more than 3 characters"],
  },
  email:{
  	type: String,
  	required:[true,"Please enter your email"],
  	unique: true,
  	validate: [validator.isEmail,"Please enter valid Email"]
  },
  password:{
  	type: String,
  	required: [true,"Please enter your password"],
  	minLength: [8,"Passowrd should be greater than 8 characters"],

  },
  avatar:{
  	public_id: {
  		type: String,
  		required:true
  	},
  	url:{
  		type: String,
  		required: true
  	}
  },
  role:{
  	type: String,
  default: "user"
  },
  createdAt:{
    type: Date,
  default: Date.now
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date

});


userSchema.pre("save",async function(next){

   if(!this.isModified("password")){
   	return next();
   }

   try{

   this.password = await bcrypt.hash(this.password,10);

   }catch(err){
   	next(err)
   }


});


userSchema.methods.generateToken = function(){

try{

 return jwt.sign({id:this._id },process.env.SECRET_KEY,{
 	expiresIn: "30d"
 });

   }catch(err){
   	console.log(err);
   }

}


//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){

  // generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;

}



const user = model("user",userSchema);

module.exports = user;