import express from "express";
import { isAdmin } from "../middlewares/authMiddleWare.js";
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
router.post("/", isAdmin, createBlog);
router.put("/:id", isAdmin, updateBlog);
router.delete("/:id", isAdmin, deleteBlog);

export default router;
