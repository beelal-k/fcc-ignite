import {
    createReply,
    getReplies,
    getReply,
    updateReply,
    deleteReply,
    dislikeReply,
    likeReply
} from "../controllers/reply.js"

import express from "express"
import verifyToken from "../middlewares/verifyToken.js"
const router = express.Router()

router.post("/", verifyToken, createReply)
router.get("/", getReplies)
router.get("/:id", getReply)
router.patch("/:id/dislike", verifyToken, dislikeReply)
router.patch("/:id/like", verifyToken, likeReply)
router.patch("/:id", verifyToken, updateReply)
router.delete("/:id", verifyToken, deleteReply)

export default router;