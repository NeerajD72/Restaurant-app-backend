import asyncHandler from "../lib/asyncHandler.js";
import { errorResponse, successResponse } from "../lib/response.js";
import Resturant from '../model/resturant.model.js'




export const CreateRestruent=asyncHandler(async(req,resp)=>{
  const  {title,
      imageUrl,
      foods,
      opening_time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    }=req.body
    if(!title || !coords){
      return errorResponse(resp,'prese provide title,address and missing fields',400)
    }

  const isExisitRestrunt=await Resturant.findOne({user:req.user.id})
  if(isExisitRestrunt){
    return errorResponse(resp,'you have already a resturant',400)
  }
  const newResturant=await Resturant.create({
      title,
      imageUrl,
      foods,
      opening_time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
      user:req.user.id
  })
  if(!newResturant){
    return errorResponse(resp,'cannot reate resturant',400)
  }
  return successResponse(resp,{about_resturant:newResturant},'resturent created success',200)
})

export const getAllResturrent=asyncHandler(async(req,resp)=>{
  const resturents=await Resturant.find({})

  if(!resturents){
    return errorResponse(resp,'resturants not found1')
  }
  return successResponse(resp,{resturents:resturents},'all resturents',200)
})

export const singleResturent=asyncHandler(async(req,resp)=>{
  const resturant=await Resturant.findById(req.params.id)
  console.log(resturant)
  if(!resturant){
    return errorResponse(resp,'can not found restureant',400)
  }
  return successResponse(resp,{resturant:resturant},'found resturant',200)
})

export const deleteresturant=asyncHandler(async(req,resp)=>{
  const deleteResturent=await Resturant.findByIdAndDelete({_id:req.params.id,user:req.user.id})
  if(!deleteResturent){
    return errorResponse(resp,'can not delete the resturent',400)
  }
  return successResponse(resp,{},'Resturent Delelted success',200)
})


export const updateResturant=asyncHandler(async(req,resp)=>{
  const  {title,
      imageUrl,
      foods,
      opening_time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
    }=req.body
    if(!title){
      return errorResponse(resp,'all fields are required',400)
    }

    const update=await Resturant.findByIdAndUpdate(req.params.id,{
      title,
      imageUrl,
      foods,
      opening_time,
      pickup,
      delivery,
      isOpen,
      logoUrl,
      rating,
      ratingCount,
      code,
      coords,
      user:req.user.id
    },{new:true})
    if(!update){
      return errorResponse(resp,'can not update resturent',400)
    }
    return successResponse(resp,{update},'update success',200)
})