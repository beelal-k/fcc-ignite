import Conversation from "../models/Conversation.js";
import AuthModel from "../models/Auth.js";

export const getMyConversations = async (req, res) => {
    try {
        const userId = req.userId;
        let conversations = await Conversation.find({
            members: {
                $in: [userId],
            },
        });
        const receiverId = conversations.map((c) => c.members.find((m) => m !== userId));
        const user = await AuthModel.findById(receiverId);
        res.status(200).json({conversations, user});
    } catch (err) {
        res.status(500).json(err);
    }
};

export const createConversation = async (req, res) => {
    const conversation = await Conversation.findOne({
        members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    if (conversation) {
        return res.status(200).json("Conversation already exists");
    }
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });
    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const deleteConversation = async (req, res) => {
    try {
        await Conversation.findOneAndDelete({
            id: req.params.id,
        })
        res.status(200).json("Conversation has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
}
