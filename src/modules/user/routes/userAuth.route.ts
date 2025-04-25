import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyAccount,
  resendVerificationOTP,
  logout,
  getUserProfile,
  verifyForgotPassword,
} from "../controllers/userAuth.controller";
import { authenticate } from "../../../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.post("/verify", verifyAccount);
router.post("/verify-forgot-password", verifyForgotPassword);
router.post("/resend-verification", resendVerificationOTP);
router.post("/logout", logout);
// router.get("/user-profile", authenticate, getUserProfile);

export default router;
