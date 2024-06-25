import mongoose from "mongoose";

const orderSchema = new mongoose.Schema ({
  userId: {
    type: mongoose.Types.ObjectId, ref: "User",
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      selectedDate: {
        type: Date,
        required: true,
      },
      personsCount: {
        type: Number,
        required: true,
      },
      itemPrice: {
        type: Number,
        required: true,
      }
    },
  ],
  booker_details: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
  total_price: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    default: "pending",
  },
  payment_method: {
    type: String,
    default: "cash",
  },
  order_status: {
    type: String,
    default: "pending",
  },
  stripe_price_id: {
    type:String,
    default: "",
  }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;