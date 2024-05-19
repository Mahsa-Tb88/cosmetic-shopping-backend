import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "../controllers/blogControllers.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/", getBlogById);
router.post("/:id", createBlog);
router.put("/:id", updateBlog);
router.get("/:id", deleteBlog);

export default router;
