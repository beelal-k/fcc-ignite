import express from "express"
import {chat } from "../controllers/Bot.js"
const router = express.Router();

router.post("/", chat);

export default router;