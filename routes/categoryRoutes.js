import { Router } from "express";
import { addCategory,allCategory,singleCategory,updateCategory,deletCategory, } from "../controller/CategoryController.js";
import requireAuth from "../middleware/requireAuth.js";
const router=Router()

router.post('/add-category',requireAuth,addCategory)
router.get('/all-category',requireAuth,allCategory)
router.get('/single-category/:id',requireAuth,singleCategory)
router.put('/update-category/:id',requireAuth,updateCategory)
router.delete('/delete-category/:id',requireAuth,deletCategory)


export default router