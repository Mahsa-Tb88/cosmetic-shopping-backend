import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export async function checkToken(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.substring(7);
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      if (decode) {
        const user = await User.findOne({ username: decode.username });
        req.username = user.username;
        req.role = user.role;
        req.userId = user._id.toString();
      }
      return next();
    } catch (e) {
      return next();
    }
  }
  next();
}

export async function isAdmin(req, res, next) {
  if (req.role == "admin" || req.role == "Main Admin") {
    next();
  } else {
    res.fail("You don't have permission to go through!", 401);
  }
}

export async function isLoggedIn(req, res, next) {
  if (req.username) {
    next();
  } else {
    res.fail("Please log in first!", 402);
  }
}
