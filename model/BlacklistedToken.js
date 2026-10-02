import mongoose from "mongoose";

const blacklisttoken=new mongoose.Schema({
  token:{
    type:String,
    required:true,
    unique:true
  }
},{timestamps:true})

blacklisttoken.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 3 }
)
const BlackLIst=mongoose.model('BlackList',blacklisttoken)

export  default BlackLIst