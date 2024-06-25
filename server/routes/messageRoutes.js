import {createMessage, getMessages} from "../controllers/Message.js"
import express from "express";

const router = express.Router();

router.post("/:conversationId", createMessage);
router.get("/:conversationId", getMessages);

export default router;