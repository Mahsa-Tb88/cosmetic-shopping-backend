import express from "express";

import { isLoggedIn } from "../middlewares/authMiddleWare.js";
import {
  createCart,
  deleteCart,
  updateCart,
} from "../controllers/cartControllers.js";

const router = express.Router();

router.post("/", isLoggedIn, createCart);
router.put("/:id", isLoggedIn, updateCart);
router.delete("/:id", isLoggedIn, deleteCart);

export default router;
