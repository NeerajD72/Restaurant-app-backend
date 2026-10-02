import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
    minLength:3,
    maxLength:20,
    trim:true
  },
  phone:{
    type:String,
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  password:{
    type:String,
    required:true,
    minlength:6,
    select:false
  },
  isEmailVerified:{
    type:Boolean,
    default:false
  },
  resetPasswordToken :{
      type:String,
      select:false
  },
  resetPasswordExpires:{
      type:Date,
      select:false
  },
  userType:{
    type:String,
    default:'client',
    enum:['client', 'admin','vendor','driver']
  },
  address:{
    type:Array
  },
  Profile:{
    type:String,
    default:'https://cdn.create.vista.com/api/media/small/39258143/stock-vector-businessman-avatar-profile-picture'
  }


},{timestamps:true})

const User=mongoose.model('User',UserSchema)

export default User