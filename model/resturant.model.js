import mongoose from "mongoose";

const RestruntSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    unique:true
  },
  title:{
    type:String,
    required:true
  },
  imageurl:{
    type:String,
    
  },
  isApproved: {
  type: Boolean,
  default: false
  },
  opening_time:{
    type:String
  },
  pickup:{
    type:Boolean,
    default:false
  },
  delivery:{
    type:Boolean,
    default:false
  },
  isOpen:{
    type:Boolean,
    default:true
  },
  logourl:{
    type:String
  },
  rating:{
    type:Number,
    default:0,
    min:1,
    max:5
  },
  ratingCount:{
    type:String
  },
  code:{
    type:String
  },
  coords:{
    id:{type:String},
    latitude:{type:Number},
    latitudeDelta:{type:Number},
    longitude:{type:Number},
    longitudeDelta:{type:String},
    address:{type:String},
    title:{type:String},
  }
},{timestamps:true})

const Resturant=mongoose.model("Resturant",RestruntSchema)

export default Resturant