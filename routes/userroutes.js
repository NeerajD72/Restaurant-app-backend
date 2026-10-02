import {Router} from 'express'
import { AllUser,singleuser,Updateuser,deleteUser } from "../controller/userController.js";
import requireAuth from '../middleware/requireAuth.js';


const routes=Router()

routes.get('/users',requireAuth,AllUser)
routes.get('/user',requireAuth,singleuser)
routes.put('/update',requireAuth,Updateuser)
routes.delete('/delete',requireAuth,deleteUser)

export default routes