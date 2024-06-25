import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId, ref: "User",
      required: true
    },
    postedItems: {
      type: mongoose.Types.ObjectId, ref: 'Item',
    },
    name: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.models.Business || mongoose.model("Business", businessSchema);
export default Business;