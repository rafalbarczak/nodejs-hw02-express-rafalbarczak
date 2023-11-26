import User from "../../models/User.js";
import { v4 as uuid } from "uuid";
import nodemailer from "nodemailer";

export const userResendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing required field: email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const verificationToken = uuid();
    user.verificationToken = verificationToken;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "poczta.interia.pl",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Email Verification",
      text: `Click the following link to verify your email: http://localhost:3000/users/verify/${verificationToken}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email resent" });
  } catch (e) {
    next(e);
  }
};
