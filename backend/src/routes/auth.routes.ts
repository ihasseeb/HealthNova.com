import { Router } from "express";
import {
  signup,
  login,
  logout,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middlewares";
import {
  signupSchema,
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validators/auth.validator";

const router = Router();

// Public Routes
router.post("/signup", validate(signupSchema), signup);
router.post("/verify-otp", validate(verifyOTPSchema), verifyOTP);
router.post("/resend-otp", validate(resendOTPSchema), resendOTP);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

// Protected Routes
router.get("/me", authenticate, getCurrentUser);

export default router;
