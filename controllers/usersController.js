import User from "../models/userSchema.js";
import bcryptjs from "bcryptjs";

export async function getUsers(req, res) {
  const limit = req.query.limit ?? 5;
  const page = req.query.page ?? 1;
  const startUser = (page - 1) * limit;
  try {
    const users = await User.find()
      .limit(limit)
      .skip(startUser)
      .select("-password");
    const all = await User.countDocuments();
    res.json({
      success: true,
      body: {
        users,
        totalUsers: {
          all,
          filtered: users.length,
        },
        message: "All users fetched successfully!",
        code: 200,
      },
    });
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function getUserById(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.fail("There is no user with this id!");
    }
    res.success("user fetched successfully!", user);
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function updateUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const firstname = req.body.firstname ?? user.firstname;
      const lastname = req.body.lastname ?? user.lastname;
      const password = req.body.password || user.password;
      const username = req.body.username || user.username;
      const role = req.body.role ?? user.role;
      if (req.role !== "Main Admin" && req.userId != user._id.toString()) {
        return res.fail("You don't have permission to update....");
      }
      if (role === "Main Admin" && req.role !== "Main Admin") {
        return res.fail("You don't have permission to update.");
      }
      if (req.username !== username && req.userId == user._id.toString()) {
        return res.fail("You can not change the username!");
      }
      let hashPassword = user.password;

      if (req.body.password) {
        const newPassword = await bcryptjs.hash(password, 10);
        hashPassword = newPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          firstname,
          lastname,
          password: hashPassword,
          role,
        },
        { new: true }
      );

      res.success("User was updated successfully!", updatedUser);
    } else {
      res.fail(" user not founded", 404);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.success("User was deleted successfully!");
    } else {
      res.fail("user not found", 404);
    }
  } catch (e) {
    res.fail(e.message, 500);
  }
}
