import mongoose, { Schema } from "mongoose";

const cartScheam = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: {
    type: [
      {
        title: String,
        price: Number,
        quantity: Number,
        totalPriceItem: Number,
      },
    ],
    default: [],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});
const Cart = mongoose.model("Cart", cartScheam);
export default Cart;
