import Message from "../models/Message.js";

export const createMessage = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const newMessage = new Message({
            conversationId,
            sender: req.body.sender,
            text: req.body.text,
        });
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
};