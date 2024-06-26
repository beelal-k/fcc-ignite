import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
    }
}, {
    timestamps: true,
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;