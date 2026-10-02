import User from '../model/user.model.js'
import logger from '../config/logger.js'
import { errorResponse,successResponse } from '../lib/response.js'
import asyncHandler from '../lib/asyncHandler.js'




//find all user
export const AllUser=asyncHandler(async(req,resp)=>{
  const users=await User.find()
  if(!users ||users.length === 0){
    return errorResponse(resp,'users not found',400)
  }
  return successResponse(resp,{
    users:{
      users
    }
  },'users found',200)
})

//user by id
export const singleuser=asyncHandler(async(req,resp)=>{
  const user=await User.findById(req.user.id)
  if(!user){
    return errorResponse(resp,'user not found',400)
  }
  return successResponse(resp,{
    user:user, 
  }, 'user found',  200)
})


//update User

export const Updateuser=asyncHandler(async(req,resp)=>{
  const {phone,address,name}=req.body
  if(!phone ||!address ||!name){
    return errorResponse(resp,'phone address and name is required')
  }
  const updateuser=await User.findByIdAndUpdate(req.user.id,{
    phone,
    address,
    name,
  },
    {new:true}
  )
  if(!updateuser){
    return errorResponse(resp,'cannot update user',400)
  }
  return successResponse(resp,{updateuser},'user updated success',200)
})


//delele  user 

export const deleteUser=asyncHandler(async(req,resp)=>{
  const deltuser=await User.findByIdAndDelete(req.user.id)
  if(!deltuser){
    return errorResponse(resp,'cannot delelte user',400)
  }
  return successResponse(resp,{},'user delete success',200)
})