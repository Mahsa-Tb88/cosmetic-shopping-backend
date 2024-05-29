import Cart from "../models/cartSchema.js";
import Category from "../models/categorySchema.js";
import User from "../models/userSchema.js";

export async function initialize(req, res) {
  let cart, categories;
  try {
    categories = await Category.find();

    if (req.userId) {
      const user = await User.findById(req.userId);
      cart = await Cart.findOne({ userId: req.userId }).populate("userId");
      if (!cart) {
        cart = { _id: 0, userId: user, items: [], totalPrice: 0 };
      }
    }
    res.success("Initialization was done successfully!", { cart, categories });
  } catch (e) {
    res.fail(e.message, 500);
  }
}

export async function uploadFile(req, res) {
  const filename = req.file.filename;

  const body = {
    filename: filename,
    url: "/uploads/" + req.folder + "/" + filename,
  };
  res.success("The file was uploaded successfully!", body);
}
