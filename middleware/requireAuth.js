import asyncHandler from "../lib/asyncHandler.js";
import { verifyAccessToken } from "../lib/token.js";
import BlackLIst from "../model/BlacklistedToken.js";
import User from "../model/user.model.js";
import { errorResponse } from "../lib/response.js";
import logger from '../config/logger.js'




const requireAuth=asyncHandler(async(req,resp,next)=>{
  const authHeader =req.headers.authorization|| req.cookies?.refreshtoken
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(resp,'you are not auth user',401)
  }
  const token=authHeader.split(" ")[1]
  const isBlacklistedtoken=await BlackLIst.findOne({token})
  if(isBlacklistedtoken){
   return errorResponse(resp,'token is invalid',400)
  }

  let payload
  try{
    payload=await verifyAccessToken(token)
    if(!payload){
      return errorResponse(resp,'dont have access token',400)
    }
  }catch(err){
     logger.error(err);
    return errorResponse(resp,'Internal server error',500)
  }

  const user=await User.findById(payload.userID)
  if(!user){
    return errorResponse(resp,'user not found',401)
  }
  req.user={
    id:user.id,
    name:user.name,
    email:user.email,
    isEmailVerified:user.isEmailVerified
  }
  logger.info('auth verified')
  next()
})

export default requireAuth