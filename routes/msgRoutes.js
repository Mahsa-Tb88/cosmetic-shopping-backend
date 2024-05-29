import express from "express";
import { messageController } from "../controllers/messageController.js";

const router = express.Router();

router.post("/message", messageController);

export default router;
