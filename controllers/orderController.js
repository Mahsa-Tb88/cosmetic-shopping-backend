import Order from "../models/orderSchema.js";
import User from "../models/userSchema.js";
import Cart from "../models/cartSchema.js";

export async function createOrder(req, res) {
  const userId = req.body.userId;
  const cartId = req.body.cartId;
  const transactionNumber = req.body.transactionNumber;

  if (!userId && !cartId && !transactionNumber) {
    return res.fail("Please enter a value for all fields!", 401);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.fail("This userId is not valid!", 401);
    }
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.fail("This cartId is not valid!", 401);
    }

    let totalPriceOrder = 0;
    cart.items.forEach(
      (el) => (totalPriceOrder = el.totalPriceItem + totalPriceOrder)
    );
    const order = await Order.create({
      userId,
      cartId,
      shops: cart.items,
      totalPriceOrder,
      transactionNumber,
    });
    res.success("New item fetched successfully!", order);
  } catch (e) {
    return res.fail(e.message, 500);
  }
}

export async function getOrdersByUserId(req, res) {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.fail("There is no user with this id.", 401);
    }
    const orders = await Order.find({ userId });
    res.success("Orders fetched successfully!", orders);
  } catch (e) {
    res.fail(e.message, 500);
  }
}

export async function updateOrder(req, res) {}
export async function deleteOrder(req, res) {}
