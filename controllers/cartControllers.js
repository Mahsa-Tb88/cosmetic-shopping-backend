import Cart from "../models/cartSchema.js";
import Order from "../models/orderSchema.js";
import Product from "../models/productSchema.js";
import User from "../models/userSchema.js";

export async function createCart(req, res) {
  const productId = req.body.productId;
  const userId = req.body.userId;
  try {
    if (!productId && !userId) {
      return res.fail("Please enter  a value for all fields");
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.fail("This username is not valid!", 401);
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.fail("This Id is not valid!", 401);
    }
    const cart = await Cart.create({
      userId,
      items: [
        {
          title: product.title,
          price: product.price,
          quantity: 1,
          totalPriceItem: product.price,
        },
      ],
      totalPrice: product.price,
    });
    res.success("New item fetched successfully!", cart);
  } catch (e) {
    return res.fail(e.message, 500);
  }
}

export async function updateCart(req, res) {
  const id = req.params.id;
  const productId = req.body.id;
  const quantity = req.body.quantity;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.fail("There is no product with this ID!");
    }
    let newItems;
    let newItem;
    const cart = await Cart.findById(id);
    const item = cart.items.find((i) => i.title == product.title);
    if (quantity == 0) {
      newItems = cart.items.filter((i) => i.title !== product.title);
      cart.items = newItems;
    } else {
      if (item) {
        newItems = cart.items.map((p) => {
          if (p.title == product.title) {
            return {
              title: p.title,
              price: p.price,
              quantity,
              totalPriceItem: p.price * quantity,
            };
          } else {
            return p;
          }
        });
        cart.items = newItems;
      } else {
        newItem = {
          title: product.title,
          price: product.price,
          quantity,
          totalPriceItem: product.price * quantity,
        };
        cart.items.push(newItem);
        newItems = cart.items;
      }
    }
    let priceItems = 0;
    newItems.forEach((i) => {
      priceItems = i.totalPriceItem + priceItems;
    });
    cart.totalPrice = priceItems;
    await cart.save();
    const itemUpdate = cart.items.find((i) => i.title == product.title);
    res.success("cart was updated successfully!", itemUpdate);
  } catch (e) {
    return res.fail(e.message, 500);
  }
}

export async function getCartById(req, res) {
  const id = req.params.id;
  if (!id) {
    return res.fail("Invalid Id!");
  }
  try {
    const cart = await Cart.findById(id);
    res.success("Cart was fetches Successfully!", cart);
  } catch (e) {
    return res.fail(e.message, 500);
  }
}
export async function deleteCart(req, res) {
  const cartId = req.params.id;
  try {
    const order = await Order.findOne({ cartId });
    const orderNumber = order.transactionNumber;
    const cart = await Cart.findByIdAndDelete(cartId);
    if (cart) {
      res.success("Cart was deleted successfully!", orderNumber);
    } else {
      return res.fail("There is not any cart with this Id", 401);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
