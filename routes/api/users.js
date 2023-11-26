import express from "express";
import authMiddleware from "../../middlewares/jwt.js";
import { userGetCurrent } from "../../controllers/users/userGetCurrent.js";
import { updateUserAvatar } from "../../controllers/users/updateUserAvatar.js";
import { userLogout } from "../../controllers/users/userLogout.js";
import { userSignup } from "../../controllers/users/userSignup.js";
import { userLogin } from "../../controllers/users/userLogin.js";
import { uploadMiddleware } from "../../middlewares/multer.js";
import { userVerify } from "../../controllers/users/userVerify.js";
import { userResendVerificationEmail } from "../../controllers/users/userResendVerificationEmail.js";
const router = express.Router();

router.post("/signup", userSignup);

router.post("/login", userLogin);

router.get("/logout", authMiddleware, userLogout);

router.get("/current", authMiddleware, userGetCurrent);

router.get("/verify/:verificationToken", userVerify);

router.post("/verify", userResendVerificationEmail);

router.patch(
  "/avatars",
  [authMiddleware, uploadMiddleware.single("picture")],
  updateUserAvatar
);

export { router };
