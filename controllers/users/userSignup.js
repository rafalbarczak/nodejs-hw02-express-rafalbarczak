import gravatar from "gravatar";
import User from "../../models/User.js";
import { v4 as uuid } from "uuid";
import nodemailer from "nodemailer";

export const userSignup = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }, { _id: 1 }).lean();

  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }
  try {
    const verificationToken = uuid();

    const avatarURL = gravatar.url(email);
    const newUser = new User({ email, avatarURL, verificationToken });
    await newUser.setPassword(password);
    await newUser.save();

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
    res.status(201).json({ message: "User created. Verification email sent." });
  } catch (e) {
    next(e);
  }
};
