import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrdersByUserId,
  updateOrder,
} from "../controllers/orderController.js";
import { isLoggedIn } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.get("/:id", isLoggedIn, getOrdersByUserId);
router.post("/", isLoggedIn, createOrder);
router.put("/:id", isLoggedIn, updateOrder);
router.delete("/:id", isLoggedIn, deleteOrder);

export default router;
