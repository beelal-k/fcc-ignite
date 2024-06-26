import Reply from '../models/reply.js';
import Forum from '../models/forum.js';
import mongoose from 'mongoose';

export const createReply = async (req, res) => {
    const { content, userId, forumId } = req.body;
    try {
        const reply = await Reply.create({
            content,
            userId,
            forumId,
        });

        const forum = await Forum.findById(forumId);
        forum.replies.push(reply._id);
        forum.replyCount = forum.replyCount + 1;
        await forum.save();

        res.status(200).send(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getReplies = async (req, res) => {
    try {
        const replies = await Reply.find();
        res.status(200).send(replies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getReply = async (req, res) => {
    try {
        const { id } = req.params;
        const reply = await Reply.findById(id);
        if (!reply) {
            return res.status(500).json({ error: "Reply not found!" });
        }
        res.status(200).send(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const updateReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No reply with id: ${id}`);
        }
        const reply = Reply.findById(id);
        if (!reply) {
            return res.status(404).send("Reply not found");
        }
        reply.content = content;
        await reply.save();
        res.json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteReply = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No reply with id: ${id}`);
        }
        await Reply.findByIdAndRemove(id);
        res.json({ message: "Reply deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const likeReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No reply with id: ${id}`);
        }
        const reply = await Reply.findById(id);
        if (!reply) {
            return res.status(404).send("Reply not found");
        }
        if (reply.likes.includes(userId)) {
            return res.status(400).send("You already liked this reply");
        }
        await reply.likes.push(userId);
        await reply.save();
        res.json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const dislikeReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send(`No reply with id: ${id}`);
        }
        const reply = await Reply.findById(id);
        if (!reply) {
            return res.status(404).send("Reply not found");
        }
        // type in db so its disliks
        await reply.disliks.push(userId);
        await reply.save();
        res.json(reply);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}