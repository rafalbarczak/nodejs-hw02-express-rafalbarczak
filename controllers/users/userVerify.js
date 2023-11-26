import User from "../../models/User.js";

export const userVerify = async (req, res, next) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({ message: "Verify token is required" });
  }

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ error: "Not Found" });
    }

    user.verificationToken = null;
    user.verify = true;

    await user.save();

    return res.json({ message: "Verification successful" });
  } catch (e) {
    next(e);
  }
};
