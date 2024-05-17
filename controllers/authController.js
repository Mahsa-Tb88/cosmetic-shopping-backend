import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function registerUser(req, res) {
  const { firstname, lastname, username, password, role } = req.body;

  if (firstname && lastname && username && password) {
    if (req.role == "admin" && role == "admin") {
      role = "admin";
    }
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) {
        const dashPassword = await bcryptjs.hash(password, 10);
        const newUser = await User.create({
          firstname,
          lastname,
          username,
          password: dashPassword,
          role,
        });
        newUser.password = undefined;
        res.success("Your Registeretion done successfully!", newUser);
      } else {
        res.fail("This username is already exist!", 401);
      }
    } catch (e) {
      res.fail(e.message, 500);
    }
  } else {
    res.fail("Please enter a value for all fields.");
  }
}

export async function loginUser(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    try {
      const user = await User.findOne({ username });
      if (user) {
        const match = await bcryptjs.compare(password, user.password);
        if (match) {
          const token = await jwt.sign({ username }, process.env.SECRET_KEY, {
            expiresIn: "1d",
          });
          user.password = undefined;
          res.success("Logined in done successfully!", { user, token });
        } else {
          res.fail("Username or Password is not correct!", 402);
        }
      } else {
        res.fail("Username or Password is not correct!", 402);
      }
    } catch (e) {
      res.fail(e.message, 500);
    }
  }
}