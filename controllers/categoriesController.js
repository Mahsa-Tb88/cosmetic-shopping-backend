import Category from "../models/categorySchema.js";
import Product from "../models/productSchema.js";
export async function getCategories(req, res) {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 5;
  const startCategory = (page - 1) * limit;
  try {
    const categories = await Category.find().limit(limit).skip(startCategory);
    res.success("Category fetch successfully!", categories);
  } catch (e) {
    res.fail(e.message, 500);
  }
}

export async function getCategory(req, res) {
  try {
    const findedCategory = await Category.findById(req.params.id);
    if (findedCategory) {
      res.success("category fetch successfully!", 200);
    } else {
      res.fail("category was not found", 404);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}

export async function createCategory(req, res) {
  const { slug, title } = req.body;

  if (!slug) {
    return res.fail("Please enter a slug");
  } else if (!title) {
    return res.fail("Please enter a title");
  }

  try {
    const findCategory = await Category.findOne({ slug });
    if (!findCategory) {
      const newCategory = await Category.create({ slug, title });
      res.success("New Category was created successfully!", newCategory);
    } else {
      res.fail("This slug already exist!", 401);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}

export async function updateCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      const slug = req.body.slug ?? category.slug;
      const title = req.body.title ?? category.title;
      const findedCategory = await Category.findOne({ slug: req.body.slug });

      if (findedCategory && findedCategory._id.toString() !== req.params.id) {
        return res.fail("This slug already exists!");
      }

      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {
        slug,
        title,
      });
      res.success("Category was updated successfully", updatedCategory);
    } else {
      res.fail("This category was not found", 401);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}

export async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
      const findProducts = await Product.findOne({
        category: category._id,
      });
      if (!findProducts) {
        res.success("category was deleted successfully");
      } else {
        res.fail("The category includes at least one product!");
      }
    } else {
      res.fail("This Category was not found", 401);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
