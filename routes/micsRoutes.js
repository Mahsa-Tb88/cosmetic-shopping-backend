import express from "express";
import uploadMiddleWare from "../middlewares/uploadMiddleWare.js";
import { initialize, uploadFile } from "../controllers/miscController.js";
import { isAdmin } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.get("/misc/initialize", initialize);

router.post("/uploads", isAdmin, uploadMiddleWare, uploadFile);

export default router;
