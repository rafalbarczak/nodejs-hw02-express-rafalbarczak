import User from "../../models/User.js";

export const userGetCurrent = async (req, res, next) => {
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
