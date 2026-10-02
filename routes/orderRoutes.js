import { Router } from "express";
import { placeOrder,orderStatus } from "../controller/OrderController.js";

const router=Router()

router.post('/place-order',placeOrder)
router.post('/update-order',orderStatus)

export default router