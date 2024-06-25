import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    selectedDate: {
        type: Date,
        required: true
    },
    persons: {
        adults: {
            type: Number,
            required: true
        },
        children: {
            type: Number,
            required: true
        },
        infants: {
            type: Number,
            required: true
        }
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const CartItem = mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema)
export default CartItem;