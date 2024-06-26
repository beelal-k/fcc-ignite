import {
    createOrder,
    getOrder,
    getOrders,
    getOrdersByUser,
    getOrdersByBusiness,
    getOrdersByItem,
    updateOrder,
    deleteOrder,
    approvePayment
} from "../controllers/order.js"

import express from "express"

const router = express.Router()

router.get("/", getOrders)
router.post("/", createOrder)
router.get("/approve/:id", approvePayment)
router.get("/user/:id", getOrdersByUser)
router.get("/business/:businessId", getOrdersByBusiness)
router.get("/item/:id", getOrdersByItem)
router.get("/:id", getOrder)
router.patch("/:id", updateOrder)
router.delete("/:id", deleteOrder)

export default router;
