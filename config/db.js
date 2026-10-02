import mongoose from 'mongoose'
import logger from './logger.js'



let isConnected = false
const connection=async()=>{
  if(isConnected){
    logger.info('Using existing database connection')
    return
  }
  let attempts=0
  const maxRetries=5
  while(attempts<maxRetries){
    try{
      await mongoose.connect(process.env.MONGODB_URI,{
        serverSelectionTimeoutMS:5000,
        socketTimeoutMS:4500,

        maxPoolSize:10,
        retryWrites:true
      })
      logger.info('database connected')
      return 
    }catch(err){
      attempts++
      logger.error('database attempted failed')
      if(attempts == maxRetries){
        logger.warn("try after sometime")
        process.exit(1)
      }
      await new Promise(resolve=> setTimeout(resolve,5000))
    }
  }
  
}

export default connection
