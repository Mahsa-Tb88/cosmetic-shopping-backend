import Msg from "../models/msgSchema.js";
export async function messageController(req, res) {
  const title = req.body.title;
  const firstname = req.body.firstname || "";
  const lastname = req.body.lastname || "";
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber || "";
  const message = req.body.message;
  if (!title && !email && !message) {
    return res.fail("Please enter a value for all fields.");
  }

  try {
    const newMsg = await Msg.create({
      title,
      firstname,
      lastname,
      email,
      phoneNumber,
      message,
    });
    res.success("Your message was submitted successfully!");
  } catch (e) {
    res.fail(e.message, 500);
  }
}
