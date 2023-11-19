import User from "../models/User.js";
import jwt from "jsonwebtoken";

const userSignup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }, { _id: 1 }).lean();

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  try {
    const newUser = new User({ email });
    await newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (e) {
    next(e);
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const isPasswordCorrect = await user.validatePassword(password);

  if (isPasswordCorrect) {
    const payload = {
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    };
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "12h" });
    return res.json({
      data: {
        token,
        user: {
          email: `${payload.email}`,
          subscription: `${payload.subscription}`,
        },
      },
    });
  } else {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
};

const userLogout = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const user = await User.findById(currentUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    user.token = null;

    await user.save();

    res.status(204).json({ message: "Logout successful" });
  } catch (e) {
    next(e);
  }
};

const userGetCurrent = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const user = await User.findById(currentUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (e) {
    next(e);
  }
};

export { userSignup, userLogin, userLogout, userGetCurrent };
