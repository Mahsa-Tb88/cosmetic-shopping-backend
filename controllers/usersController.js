import User from "../models/userSchema.js";

export async function getUsers(req, res) {
  const limit = req.query.limit ?? 5;
  const page = req.query.page ?? 1;
  const startUser = (page - 1) * limit;
  try {
    const users = await User.find()
      .limit(limit)
      .skip(startUser)
      .select("-password");
    const all = users.length;
    res.json({
      success: true,
      body: {
        users,
        totalUsers: {
          all,
          filtered: all,
        },
        message: "All users fetched successfully!",
        code: 200,
      },
    });
  } catch (e) {
    res.fail(e.message, 500);
  }
}
export async function updateUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const firstname = req.querry.firstname ?? user.firstname;
      const lastname = req.querry.lastname ?? user.lastname;
      const username = req.querry.username ?? user.username;
      const password = req.querry.password ?? "";
      const role = req.querry.role ?? user.role;

      if (req.role !== "admin" && req.userId != user._id.toString()) {
        return res.fail("You dont have allowance for updating");
      }
      if (role === "admin" && req.role !== "admin") {
        return res.fail("You dont have allowance for updating");
      }
      let hashPassword = user.password;
      if (password) {
        const newPassword = bcryptjs.hash(password, process.env.SECRET_KEY);
        hashPassword = newPassword;
      }
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        firstname,
        lastname,
        username,
        password: hashPassword,
        role,
      });

      res.success("User was updated successfully!");
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
