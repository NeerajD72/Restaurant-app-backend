import { OAuth2Client } from 'google-auth-library';
import logger from '../config/logger.js';
import asyncHandler from '../lib/asyncHandler.js'
import { sendMail } from '../lib/email.js';
import { passwordHash,comparePassword } from '../lib/hash.js';
import { errorResponse, successResponse } from '../lib/response.js';
import { AccessToken, RefreshToken, verifyRefreshToken,verifyAccessToken } from '../lib/token.js';
import User from '../model/user.model.js'
import BlackLIst from '../model/BlacklistedToken.js';
import crypto from 'crypto'




export const register=asyncHandler(async(req,resp)=>{
  const {name,email,password,phone,address}=req.body
  if (!email || !name || !password ) {
    return errorResponse(resp, "all fields are required", 400);
  }
  if (password.length < 8) {
    return errorResponse(resp, "Password must be at least 8 characters", 400);
  }
  const normalizeEmail=email.toLowerCase().trim()
  const user=await User.findOne({email:normalizeEmail})
  if(user){
    return errorResponse(resp,'you are already registerd',400)
  }

  const HashPassword=await passwordHash(password)

  const newUser=await User.create({
    name,
    email:normalizeEmail,
    password:HashPassword,
    phone,
    address
  })
  logger.info('user registerd')

  const verifyToken=await AccessToken(newUser._id)

  const verifyUrl=`http://localhost:3000/api/auth/verify-email?token=${verifyToken}`

  await sendMail({
    to:newUser.email,
    subject:"verify yor email",
    html:`<p>please verify your email by clicking<a href=${verifyUrl}>${verifyUrl}</a></p>`
  })

  return successResponse(
    resp,
    {
      id:newUser._id,
      email:newUser.email,
      userType:newUser.userType,
      isEmailVerified:newUser.isEmailVerified
    },
    'user registerd, please verify your email to login',200
  )
})


export const verifyEmail=asyncHandler(async(req,resp)=>{
  const token=req.query.token

  if(!token){
    return errorResponse(resp,'please registered first then verify your email',400)
  }

  let tokenverify
  try{
    tokenverify=await verifyAccessToken(token)
  }catch(err){
    if (err.name === "TokenExpiredError") {
      return errorResponse(resp, "Verification link expired", 400);
    }
    return errorResponse(resp, "Invalid token", 400);
  }

  const user=await User.findById(tokenverify.userID)
  if(!user){
    return errorResponse(resp,'user not found',401)
  }
  if(user.isEmailVerified){
    return errorResponse(resp,'email is verifyed',400)
  }

  user.isEmailVerified=true
  await user.save()
  logger.info('email is verifyed')
  return successResponse(resp,
    {},'user email verifyed',200
  )
})


export const login=asyncHandler(async(req,resp)=>{
  const {email,phone,password}=req.body
  if(!email || !password){
    return errorResponse(resp,'all fields are required',400)
  }

  const normalizeEmail=email.toLowerCase().trim()

  const user=await User.findOne({email:normalizeEmail}).select("+password")
  if(!user){
    return errorResponse(resp,'user not registerd',400)
  }
  const checkPassword=await comparePassword(password,user.password)
  if(!checkPassword){
    return errorResponse(resp,'Invalid credentials',400)
  }

  if(!user.isEmailVerified){
    return errorResponse(resp,'email is not verified',400)
  }
  await sendMail({
    to:user.email,
    html:`<p>you are loged in</p>`,
    subject:'user login'
  })

  const accessToken=await AccessToken(user._id)
  const refreshToken=await RefreshToken(user._id)

  const isprod=process.env.NODE_ENV === 'production'
  resp.cookie('refreshToken',refreshToken,{
    httpOnly:true,
    seure:isprod,
    sameSite:'lax',
    maxAge:30*24*60*60*1000
  })
  logger.info('user login success')

  return successResponse(resp,{
    accesstoken:accessToken,
    id: user.id,
      email: user.email,
      userType: user.userType,
      isEmailVerified :user.isEmailVerified,
  },'user login success',200)
})

export const refreshHandler=asyncHandler(async(req,resp)=>{
  const token=req.cookies?.refreshToken
  if(!token){
    return errorResponse(resp,'token is missing',400)
  }

  let payload
  try{
    payload=await verifyRefreshToken(token)
  }catch(err){
    logger.error(err)
  }

  const user=await User.findById(payload.userID)
  if(!user){
    return errorResponse(resp,'user not found',400)
  }

  const newAccessToken=await AccessToken(user._id)
  const newrefreshToken=await RefreshToken(user._id)

  const isprod=process.env.NODE_ENV === 'production'

  resp.cookie("refreshToken",newrefreshToken,{
    httpOnly:true,
    secure:isprod,
    sameSite:'lax',
    maxAge:30*24*60*60*1000
  })

  return successResponse(resp,{
    newAccessToken,
    user:{
      id: user.id,
      email: user.email,
      userType: user.userType,
      isEmailVerified :user.isEmailVerified,
    }
  },'token refresh',200)
})

export const logout=asyncHandler(async(req,resp)=>{
  const token=req.cookies.refreshToken
  if(!token){
    return errorResponse(resp,'token is missing',400)
  }

  const isBlocktoken=await BlackLIst.findOne({token:token})
  if(isBlocktoken){
    return errorResponse(resp,'token is epired',400)
  }
  await BlackLIst.create({token:token})

  resp.clearCookie("refreshToken",{path:'/'})
  logger.info('User logged out', { token: token.substring(0, 20) })
  return successResponse(resp,{}, "user logout success", 200);
})


export const forgetpassword=asyncHandler(async(req,resp)=>{
  const {email}=req.body
  if(!email){
    return errorResponse(resp,'email is required',400)
  }

  const normalizeEmail=email.toLowerCase().trim()

  const user=await User.findOne({email:normalizeEmail})
  if(!user){
    return errorResponse(resp,'user not found',400)
  }
  const rawToken=crypto.randomBytes(32).toString('hex')
  const hashRawToken=crypto.createHash('sha256').update(rawToken).digest('hex')

  user.resetPasswordToken=hashRawToken
  user.resetPasswordExpires=new Date(Date.now()+15*60*1000)
  await user.save()

  const reseturl=`http://localhost:3000/api/auth/reset-password?token=${rawToken}`
  await sendMail({
      to: user.email,
      subject:"to rest your password",
      html:`<p>please click the link to rest your password<a href=${reseturl}>${reseturl}</a></p>`
  })
  return successResponse(resp,{},'If an account with this email exists, we will send you a reset password token',200)
})

export const resetPassword=asyncHandler(async(req,resp)=>{
  const {token,password}=req.body
  if(!token || !password){
    return errorResponse(resp,'token and password is required',400)
  }

  const tokenHash=crypto.createHash('sha256').update(token).digest('hex')
  const user=await User.findOne({resetPasswordToken:tokenHash,resetPasswordExpires:{ $gt: new Date()}})
  if(!user){
    return errorResponse(resp,'user not found',400)
  }

  const newPassword=await passwordHash(password)
  user.password=newPassword
  user.resetPasswordToken=undefined
  user.resetPasswordExpires=undefined

  await user.save()
  return successResponse(resp,{},'password rest successfull',200)
})


async function getGoogleClient(){
  const clientId= process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectURI=process.env.GOOGLE_REDIRECT_URI

  return new OAuth2Client({
    clientId,
    clientSecret,
    redirect_uri: redirectURI 
  })
}

export const googleLogin=asyncHandler(async(req,resp)=>{
  const client=await getGoogleClient()

  const url=client.generateAuthUrl({
    access_type:'offline',
    prompt:'consent',
    scope:['openid','email','profile'],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI
  })
  return resp.redirect(url)
})

export const googleLoginHandler=asyncHandler(async(req,resp)=>{
  const code=req.query.code
    if(!code){
      return errorResponse(resp,'code is missing in callback',400)
    }

    const client=await getGoogleClient()
    const {tokens}=await client.getToken({code,redirect_uri:process.env.GOOGLE_REDIRECT_URI})
    if(!tokens.id_token){
      return errorResponse(resp,'no google id token is present')
    }
    const ticket=await client.verifyIdToken({
      idToken:tokens.id_token,
      audience:process.env.GOOGLE_CLIENT_ID
    })

    const payload =ticket.getPayload()
   const name = payload?.name
   const email =payload?.email
   const emailVerified = payload?.email_verified
   if(!email || !emailVerified){
      return resp.status(400).json({message:"google accoutn is not verified"})
   }

   const normalizedEmail = email.toLowerCase().trim()
   
   let user= await User.findOne({email:normalizedEmail})
    if(!user){
      const randomPassword =crypto.randomBytes(16).toString('hex')
      const PasswordHash =await passwordHash(randomPassword)
      user = await User.create({
        name:name,
        email:normalizedEmail,
        password:PasswordHash,
        isEmailVerified:true,
      })

    }else{
      if(!user.isEmailVerified){
        user.isEmailVerified = true
        await user.save()
      }
    }

    const access_token =await AccessToken(user._id)
    const refreshToken =await RefreshToken(user._id)
    
    const isProd = process.env.NODE_ENV === 'production'

   resp.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure: isProd,
    sameSite: "lax",
    maxAge : 30*24*60*60*1000
   })
   

   return successResponse(resp,{
    access_token,
    user:{
      _id:user.id,
      email:user.email,
      userType:user.userType,
      isEmailVerified:user.isEmailVerified
    }
    },"google login successfull",200)
})