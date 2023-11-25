import User from "../../models/User.js";

export const userLogout = async (req, res, next) => {
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
