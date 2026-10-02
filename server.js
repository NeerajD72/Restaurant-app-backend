import app from './app.js'
import connection from './config/db.js'


const startServer=async()=>{
  await connection()
  app.listen(process.env.PORT,()=>{
    console.log(`server listingn at ${process.env.PORT}`)
  })
}

startServer().catch(err=>{
  console.log(err)
  process.exit(1)
})