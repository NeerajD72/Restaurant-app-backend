import asyncHandler from "../lib/asyncHandler.js";
import { errorResponse, successResponse } from "../lib/response.js";
import Category from "../model/category.model.js";



//add category

export const addCategory=asyncHandler(async(req,resp)=>{
  const {title,imageUrl}=req.body
   if(!title||!imageUrl){
    return errorResponse(resp,'title and image url is requiredd to create category',400)
   }
  const addCategory=await Category.create({
    title:title,
    imageUrl:imageUrl,
  })
  
  if(!addCategory){
    return errorResponse(resp,'can not add category',400)
  }
  await addCategory.save()
  return successResponse(resp,{},'category added success',200)
})

//get all category
export const allCategory=asyncHandler(async(req,resp)=>{
  const categoryies=await Category.find()
  if(!categoryies){
    return errorResponse(resp,'can not found categories')
  }
  return successResponse(resp,{Category:categoryies},'found categories',200)
})

//single cate
export const singleCategory=asyncHandler(async(req,resp)=>{
  const {id}=req.params
  if(!id){
    return errorResponse(resp,'id is required',400)
  }
  const category=await Category.findById(id)
  if(!category){
    return errorResponse(resp,'can not found category',400)
  }
  return successResponse(resp,{category:category},'category found',200)
})

//update category

export const updateCategory=asyncHandler(async(req,resp)=>{
  const {title,imageUrl}=req.body
  if(!title || !imageUrl){
    return errorResponse(resp,'required filelds title and imageurl')
  }
  const isCategory=await Category.findByIdAndUpdate(req.params.id,{
    title:title,
    imageUrl:imageUrl
  },{new:true})
  if(!isCategory){
    return errorResponse(resp,'category updated false',400)
  }
  return successResponse(resp,{updateCategory:isCategory},'updated success',200)
})

//delete cat
export const deletCategory=asyncHandler(async(req,resp)=>{
  const dltCategory=await Category.findByIdAndDelete(req.params.id)
  if(!dltCategory){
    return errorResponse(resp,'can not delete category',401)
  }
  return successResponse(resp,{},'category dlt success',200)
})