import express from "express";
import authMiddleware from "../../middlewares/jwt.js";
import {
  userGetCurrent,
  userLogin,
  userLogout,
  userSignup,
} from "../../controllers/users.js";
const router = express.Router();

router.post("/signup", userSignup);

router.post("/login", userLogin);

router.get("/logout", authMiddleware, userLogout);

router.get("/current", authMiddleware, userGetCurrent);

export { router };
