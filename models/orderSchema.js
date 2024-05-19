import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    NumberOfOrder: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
