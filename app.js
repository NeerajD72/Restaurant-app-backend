import express from 'express'
import dotenv from 'dotenv/config'
import cookieparser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userroutes.js'
import resturantRoutes from './routes/resturantRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import foodRoutes from './routes/foodRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import helmet from 'helmet'
import cors from 'cors'

const app=express()



app.use(express.json())
app.use(cookieparser())
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))



app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/resturant',resturantRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/food',foodRoutes)
app.use('/api/order',orderRoutes)



export default app