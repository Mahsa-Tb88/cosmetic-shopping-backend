import mongoose from "mongoose";
import Blog from "../models/blogSchema.js";

export async function getBlogs(req, res) {
  const page = req.query.page ?? 1;
  const limit = req.query.limit ?? 6;
  const startBlog = (page - 1) * limit;
  const search = req.query.search ?? "";

  try {
    const query = {
      $or: [
        { title: RegExp(search, "i") },
        { description: RegExp(search, "i") },
      ],
    };
    const blogs = await Blog.find(query).skip(startBlog).limit(limit);
    const all = await Blog.countDocuments();
    const filtered = await Blog.countDocuments(query);
    res.json({
      success: true,
      body: blogs,

      message: "Blogs fetch successully!",
      totalBlogs: {
        all,
        filtered,
      },
      code: 200,
    });
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function getBlogById(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    return res.fail("Invalid Blog Id");
  }
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.success("The blog fetch successfully!", blog);
    } else {
      res.fail("The blog not found", 401);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function createBlog(req, res) {
  const title = req.body.title;
  const slug = req.body.slug;
  const description = req.body.description;
  const items = req.body.items || [];
  const details = req.body.details || ["body care", "DR.Mike Serv"];
  const image = req.body.image;

  if (!title) {
    return res.fail("Please enter a title");
  } else if (!slug) {
    return res.fail("Please enter a slug");
  } else if (!description) {
    return res.fail("Please enter a description");
  } else if (!image) {
    return res.fail("Please select an image");
  }
  try {
    const findedBlog = await Blog.findOne({ title });
    if (findedBlog) {
      return res.fail("The title of blog already exist!");
    }
    const newBlog = await Blog.create({
      title,
      slug,
      description,
      items,
      details,
      image,
    });
    res.success("New blog was created successfully!", newBlog);
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function updateBlog(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    return res.fail("Invalid Blog Id");
  }

  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      const title = req.body.title || blog.title;
      const slug = req.body.slug || blog.slug;
      const description = req.body.description || blog.description;
      const items = req.body.items || blog.items;
      const details = req.body.details || blog.details;
      const image = req.body.image ?? "";
      const findedBlog = await Blog.findOne({ title: req.body.title });
      if (findedBlog && findedBlog._id.toString() != blog._id) {
        return res.fail("This title already exist!");
      }

      const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
        title,
        slug,
        description,
        items,
        details,
        image,
      });
      res.success("The blog was updated successfully!", updatedBlog);
    } else {
      res.fail("The blog was not found!");
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function deleteBlog(req, res) {
  const isValid = mongoose.isValidObjectId(req.params.id);
  if (!isValid) {
    return res.fail("Invalid Blog Id");
  }
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog) {
      res.success("The blog was deleted succesfully!");
    } else {
      res.fail("This blog was not found!", 401);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
