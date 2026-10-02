import asyncHandler from "../lib/asyncHandler.js";
import { errorResponse, successResponse } from "../lib/response.js";
import Food from "../model/food.model.js";





//create food
export const createFodd=asyncHandler(async(req,resp)=>{
  const {
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      resturant,
      rating,
    } = req.body;

    if(!title ||!description ||!imageUrl ||!rating){
      return errorResponse(resp,'all fields are required',400)
    }

    const newfood=await Food.create({
      title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      resturant,
      rating,
    })

    if(!newfood){
      return errorResponse(resp,'cannot create food',400)
    }
    await newfood.save()
    return successResponse(resp,{newfood:newfood},'food created success',200)
})

//get all food
export const getAllfood=asyncHandler(async(req,resp)=>{
  const foods=await Food.find()
  if(!foods){
    return errorResponse(resp,'can not found foods',401)
  }
  return successResponse(resp,{foods:foods},'all foods found',200)
  
})

// single food

export const singlefood=asyncHandler(async(req,resp)=>{
  const singlefood=await Food.findById(req.params.id)
  if(!singlefood){
    return errorResponse(resp,'can  not found food',400)
  }
  return successResponse(resp,{food:singlefood},'food found',200)
})

//findfood by restruent
export const foodByresturen=asyncHandler(async(req,resp)=>{
  const food=await Food.find({resturant:req.params.id})
  console.log(food)
  if(!food){
    return errorResponse(resp,'food not found by resturant' ,400)
  }console.log(food)
  return successResponse(resp,{food},'food found by resturant',200)
  
})

//update food
export const updateFood=asyncHandler(async(req,resp)=>{
  const {
    title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      resturant,
      rating,
  }=req.body

  const updatefood=await Food.findByIdAndUpdate({_id:req.params.id},{
    title,
      description,
      price,
      imageUrl,
      foodTags,
      category,
      code,
      isAvailable,
      resturant,
      rating,
  },{new:true})
  if(!updateFood){
    return errorResponse(resp,'cannot update food',400)
  }

  return successResponse(resp,{updatedfood:updatefood},'food update success',200)
})

//delete food
export const dltfood=asyncHandler(async(req,resp)=>{
  const dltFood=await Food.findByIdAndDelete({_id:req.params.id})
  if(!dltFood){
    return errorResponse(resp,'can not dlt food',400)
  }
  return successResponse(resp,{},'food dlt success',200)
})


