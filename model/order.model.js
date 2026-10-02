import mongoose from "mongoose";

const OrderSchema=new mongoose.Schema({
  foods:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Food",
  }],
  payment:{
    amount:Number,
    method:{type:String,enum:["COD", "RAZORPAY"]},
    status:{type:String,enum:["PENDING", "COMPLETED", "FAILED"],default:'PENDING'},
    transactionId:{type:String}
  },
  buyer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  resturant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Resturant",
    required:true
  },
  status:{
    type:String,
    enum:["PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED", "CANCELLED"],
    default:"PREPARING"
  },
  deliveryAddress:{
    type:String
  }
},{timestamps:true})

const Order=mongoose.model("Order",OrderSchema)

export default Order