import User from "../../models/User.js";
import jwt from "jsonwebtoken";

export const userLogin = async (req, res) => {
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
