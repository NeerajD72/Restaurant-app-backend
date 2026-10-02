import { Router } from "express";
import { CreateRestruent, getAllResturrent,singleResturent,deleteresturant,updateResturant } from "../controller/resturantController.js";
import requireAuth from "../middleware/requireAuth.js";



const routes=Router()

routes.post('/create',requireAuth,CreateRestruent)
routes.get('/all-resturants',requireAuth,getAllResturrent)
routes.get('/single-resturant/:id',requireAuth,singleResturent)
routes.put('/update/:id',requireAuth,updateResturant)
routes.delete('/delete/:id',requireAuth,deleteresturant)





export default routes

