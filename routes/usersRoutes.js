import express from "express";
import { isAdmin } from "../middlewares/authMiddleWare.js";
import {
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", isAdmin, getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
