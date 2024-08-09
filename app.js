console.clear();

import path from "path";
import { fileURLToPath } from "url";

import corsMiddleWare from "./middlewares/corsMiddleWare.js";
import responseMiddleWare from "./middlewares/responseMiddleWare.js";
import { checkToken } from "./middlewares/authMiddleWare.js";

import express from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import blogsRoutes from "./routes/blogsRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import micsRoutes from "./routes/micsRoutes.js";
import msgRoutes from "./routes/msgRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import User from "./models/userSchema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(corsMiddleWare);
app.use(responseMiddleWare);
app.use(checkToken);
app.use(micsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);
app.use("/", msgRoutes);
app.use("/order", orderRoutes);
app.use("/cart", cartRoutes);

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to database");

  app.listen(3000, () => {
    console.log("Server is running on http://localhost3000");
  });
  const findMainAdmin = await User.findOne({ username: "MainAdmin" });
  const dashedPassword = await bcryptjs.hash("admin", 10);
  if (!findMainAdmin) {
    await User.create({
      firstname: "Mahsa",
      lastname: "Tabesh",
      username: "MainAdmin",
      password: dashedPassword,
      role: "Main Admin",
    });
  }
} catch (e) {
  console.log(e.message);
}
