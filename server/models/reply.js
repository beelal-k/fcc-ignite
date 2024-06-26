import mongoose from "mongoose";

const replySchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "Auth",
    }],
    disliks: [{
        type: mongoose.Types.ObjectId,
        ref: "Auth",
    }],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    forumId: {
        type: mongoose.Types.ObjectId,
        ref: "Forum",
        required: true,
    }
}, {
    timestamps: true,
});

const Reply = mongoose.model("Reply", replySchema);
export default Reply;