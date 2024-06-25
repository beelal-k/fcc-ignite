import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    videos: { type: [String], required: true },
    businessId: {
      type: String,
    },
    content: [
      {
        title: { type: String, required: true },
        markdown: { type: String, required: true },
      },
    ],
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      region: {
        type: String,
        required: true,
      },
    },
    price: { type: Number, required: true },
    reviews: [
      {
        user_id: { type: String, required: true },
        review: { type: String, required: true },
        rating: { type: Number, required: true },
      },
    ],
    available_dates: {
      all_available: { type: Boolean, default: false },
      dates: { type: [Date], required: true },
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchema);
export default Item;
