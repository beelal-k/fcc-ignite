import mongoose from "mongoose";

const forum = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
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
    replyCount: {
        type: Number,
        default: 0,
    },
    replies: [{
        type: mongoose.Types.ObjectId,
        ref: "Reply",
    }],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Auth",
        required: true,
    }
}, {
    timestamps: true,
});

const Forum = mongoose.model("Forum", forum);
export default Forum;