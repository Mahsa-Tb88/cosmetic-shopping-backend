import express from "express";
import { isAdmin, isLoggedIn } from "../middlewares/authMiddleWare.js";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", isAdmin, getUsers);
router.get("/:id", isAdmin, getUserById);
router.put("/:id", isLoggedIn, updateUser);
router.delete("/:id", isAdmin, deleteUser);

export default router;
