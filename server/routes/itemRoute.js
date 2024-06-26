import { createItem, getItems, getItem, getItemByBusiness, addReview, updateReview, updateItem,deleteReview, deleteItem, analytics, generateSurprise } from "../controllers/Item.js";
import verifyToken from "../middlewares/verifyToken.js";
import express from "express";

const router = express.Router();


router.get("/", getItems);
router.get("/:id", getItem);
router.get("/analytics/:id", verifyToken, analytics);
router.get("/business/:businessId", getItemByBusiness);
router.post("/", verifyToken, createItem);
router.put("/:id", verifyToken, updateItem);
router.delete("/:id", verifyToken, deleteItem);
router.get("/surprise/:budget", verifyToken, generateSurprise);
router.post("/review", verifyToken, addReview);
router.patch("/review/:itemId", verifyToken, updateReview);
router.delete("/review/:itemId", verifyToken, deleteReview);

export default router;