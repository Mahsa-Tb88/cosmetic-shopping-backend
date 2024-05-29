import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    shops: {
      type: [
        {
          title: String,
          quantity: Number,
          price: Number,
          totalPriceItem: Number,
        },
      ],
    },
    totalPriceOrder: {
      type: Number,
      required: true,
    },
    transactionNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
