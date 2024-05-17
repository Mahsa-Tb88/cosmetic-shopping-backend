console.clear();

import path from "path";
import { fileURLToPath } from "url";

import corsMiddleWare from "./middlewares/corsMiddleWare.js";
import responseMiddleWare from "./middlewares/responseMiddleWare.js";
import { checkToken } from "./middlewares/authMiddleWare.js";

import express, { response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import blogsRoutes from "./routes/blogsRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import micsRoutes from "./routes/micsRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(corsMiddleWare);
app.use(responseMiddleWare);
app.use(checkToken);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/blogs", blogsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);
app.use(micsRoutes);

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to database");

  app.listen(3000, () => {
    console.log("Server is running on http://localhost3000");
  });
} catch (e) {
  console.log(e.message);
}
