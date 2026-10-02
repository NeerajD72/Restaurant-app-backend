import { Router } from "express";
import { createFodd,getAllfood,singlefood,foodByresturen,updateFood,dltfood } from "../controller/foodController.js";
import requireAuth from "../middleware/requireAuth.js";

const router=Router()

router.post('/create-food',requireAuth,createFodd)
router.get('/all-food',requireAuth,getAllfood)
router.get('/single-food/:id',requireAuth,singlefood)
router.get('/Byresturant-food/:id',requireAuth,foodByresturen)
router.put('/update-food/:id',requireAuth,updateFood)
router.delete('/delete-food/:id',requireAuth,dltfood)

export default router