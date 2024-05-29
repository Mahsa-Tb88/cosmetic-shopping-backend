import mongoose from "mongoose";
import Category from "../models/categorySchema.js";
import Product from "../models/productSchema.js";

export async function getProducts(req, res) {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 6;
  const category = req.query.category ?? "";
  const sort = req.query.sort ?? "updatedAt";
  const order = req.query.order ?? "desc";
  const q = req.query.q ?? "";
  const startProduct = (page - 1) * limit;
  const query = {
    $or: [{ title: RegExp(q, "i") }, { description: RegExp(q, "i") }],
  };

  if (category) {
    try {
      const findedCategory = await Category.findOne({ slug: category });
      if (findedCategory) {
        query.category = findedCategory._id;
      } else {
        return res.fail("The category was not found!");
      }
    } catch (e) {
      return res.fail(e.message, 500);
    }
  }
  try {
    const all = await Product.countDocuments();
    const filtered = await Product.countDocuments(query);
    const products = await Product.find(query)
      .limit(limit)
      .skip(startProduct)
      .sort(order == "asc" ? sort : "-" + sort)
      .populate("category");
    res.json({
      success: true,
      body: products,
      message: "products fetch successfully!",
      totalProducts: { all, filtered },
      code: 201,
    });
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function getProductById(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);

  if (!isValid) {
    return res.fail("Invalid Product Id", 404);
  }

  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.success("The product fetch successfully!", product);
    } else {
      res.fail("The product was not found!", 401);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function createProduct(req, res) {
  const title = req.body.title;
  const category = req.body.category;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image ?? "";

  if (!title) {
    return res.fail("Please enter a title");
  } else if (!category) {
    return res.fail("Please enter a category");
  } else if (!price) {
    return res.fail("Please enter a price");
  } else if (!description) {
    return res.fail("Please enter a description");
  }

  try {
    const findedProduct = await Product.findOne({ title });
    if (findedProduct) {
      return res.fail("This product title already exist!");
    }
    const findedCategory = await Category.findById(category);
    if (findedCategory) {
      const newCategory = await Product.create({
        title,
        category: findedCategory._id,
        price,
        description,
        image,
      });
      res.success("New product was created successfully!", newCategory);
    } else {
      return res.fail("This category was not found!");
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function updateProduct(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    return res.fail("InValid Product Id");
  }
  try {
    const findedProduct = await Product.findById(req.params.id);
    if (findedProduct) {
      const title = req.body.title || findedProduct.title;
      const category = req.body.category || findedProduct.category;
      const price = req.body.price || findedProduct.price;
      const description = req.body.description || findedProduct.description;
      const image = req.body.image || findedProduct.image;

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        title,
        category,
        price,
        image,
        description,
      });
      if (!updatedProduct) {
        return res.fail("This product was not found!");
      }
      res.success("The product was upadated successfully!", updatedProduct);
    } else {
      res.fail("This product was not found!");
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function deleteProduct(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    return res.fail("InValid Product Id");
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.success("The product was deleted successfully");
    } else {
      res.fail("The product was not found!");
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
