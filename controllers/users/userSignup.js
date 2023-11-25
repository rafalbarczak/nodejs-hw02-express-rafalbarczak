import gravatar from "gravatar";
import User from "../../models/User.js";

export const userSignup = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }, { _id: 1 }).lean();

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  try {
    const avatarURL = gravatar.url(email);
    const newUser = new User({ email, avatarURL });
    await newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (e) {
    next(e);
  }
};
