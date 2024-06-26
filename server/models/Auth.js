import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
    },
    picture: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    verificationToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    preferences: [
      {
        type: String,
      },
    ],
    cart: [
      {
        type: mongoose.Types.ObjectId,
        ref: "CartItem",
        default: [],
      },
    ],
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: "Business",
      default: null,
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        default: [],
      },
    ],
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Item",
        default: [],
      },
    ],
    notifications: [
      {
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AuthModel = mongoose.model("Auth", AuthSchema);
export default AuthModel;
