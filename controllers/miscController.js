import Category from "../models/categorySchema.js";
import User from "../models/userSchema.js";

export async function initialize(req, res) {
  let user, categories;
  try {
    categories = await Category.find();
  } catch (e) {
    res.fail(e.message, 500);
  }
  if (req.username) {
    user = await User.findOne({ username: req.username }).select("-password");
  }
  res.success("Initialization was done successfully!", { user, categories });
}

export async function uploadFile(req, res) {
  const filename = req.file.filename;

  const body = {
    filename: filename,
    url: "/uploads/" + req.folder + "/" + filename,
  };
  res.success("The file was uploaded successfully!", body);
}
