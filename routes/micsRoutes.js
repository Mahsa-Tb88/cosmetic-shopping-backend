import express from "express";
import uploadMiddleWare from "../middlewares/uploadMiddleWare.js";
import { initialize, uploadFile } from "../controllers/miscController.js";
import { isAdmin } from "../middlewares/authMiddleWare.js";

const router = express.Router();

router.get("/misc/initialize", initialize);

router.post("/uploads", isAdmin, uploadMiddleWare, uploadFile);
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.fail("Max Size");
  } else if (err.code === "INVALID_EXTENSION") {
    res.fail("Invalid Extension");
  }
});

export default router;
