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
      const firstname = req.body.firstname ?? user.firstname;
      const lastname = req.body.lastname ?? user.lastname;
      const username = req.body.username ?? user.username;
      const password = req.body.password ?? "";
      const role = req.body.role ?? user.role;
      const pendingShopping = req.body.pendingShopping ?? user.pendingShopping;
      const shopping = req.body.shopping ?? user.shopping;

      if (req.role !== "admin" && req.userId != user._id.toString()) {
        return res.fail("You dont have allowance for updating");
      }
      if (role === "admin" && req.role !== "admin") {
        return res.fail("You dont have allowance for updating");
      }
      if(req.username !== req.body.username){
        return res.fail("You can not change your username!");

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
        pendingShopping,
        shopping,
      });

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
