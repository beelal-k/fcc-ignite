import {
    createBusiness,
    getBusiness,
    getBusinesses,
    updateBusiness,
    deleteBusiness,
    analytics
} from "../controllers/business.js"

import verifyToken from "../middlewares/verifyToken.js";
import isBusiness from "../middlewares/isBusiness.js";
import express from "express";

const router = express.Router();

router.post("/", verifyToken, createBusiness);
router.get("/", getBusinesses);
router.get("/analytics", analytics);
router.get("/:id", getBusiness);
router.patch("/:id", verifyToken, isBusiness, updateBusiness);
router.delete("/:id", verifyToken, isBusiness, deleteBusiness);

export default router;