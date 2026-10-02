import asyncHandler from "../lib/asyncHandler.js";
import { errorResponse, successResponse } from "../lib/response.js";
import Order from "../model/order.model.js";


export const placeOrder=asyncHandler(async(req,resp)=>{
  const {cart}=req.body
  if(!cart){
    return errorResponse(resp,'required food cart ',400)
  }
  let total=0
  cart.map((i)=>{
    total +=i.price
  })
  const newOrder=new Order({
    food:cart,
    payment:total,
    buyer:req.user.id
  })
  await newOrder.save()
  return successResponse(resp,{newOrder},'orlder placed',200)
})

//change order status
export const orderStatus=asyncHandler(async(req,resp)=>{
  const {status}=req.body
  const updateOrder=await Order.findByIdAndUpdate(req.user.id,{status},{new:true})
  return successResponse(resp,{updateOrder},'order updated success',200)
})