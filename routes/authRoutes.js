import {Router} from 'express'
import { register,verifyEmail,login,logout,refreshHandler,googleLogin,googleLoginHandler, forgetpassword, resetPassword } from "../controller/authController.js";
import requireAuth from '../middleware/requireAuth.js';


const router=Router()

router.post('/register',register)
router.get('/verify-email',verifyEmail)
router.post('/login',login)
router.post('/refresh',refreshHandler)
router.post('/logout',requireAuth,logout)
router.post('/forget',forgetpassword)
router.post('/reset',resetPassword)
router.get('/google',googleLogin)
router.get('/google/callback',googleLoginHandler)



export default router
