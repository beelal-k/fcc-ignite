import {createNotification}  from "../controllers/Notification.js";
import express from "express";
const router = express.Router();

router.post("/", createNotification);

export default router;