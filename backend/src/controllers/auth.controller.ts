import { Request, Response } from "express";
import {
  signupService,
  loginService,
  verifyOTPService,
  resendOTPService,
  forgotPasswordService,
  resetPasswordService,
  getCurrentUserService,
  changePasswordService,
  refreshTokenService,
} from "../services/auth.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

// SIGNUP Controller
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = await signupService(req.body);

  return successResponse(res, 201, result.message, {
    user: result.user,
  });
});

// VERIFY OTP Controller
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await verifyOTPService(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return successResponse(res, 200, "Email verified successfully! 🎉", {
    user,
    token: accessToken,
  });
});

// RESEND OTP Controller
export const resendOTP = asyncHandler(async (req: Request, res: Response) => {
  const result = await resendOTPService(req.body);
  return successResponse(res, 200, result.message);
});

// LOGIN Controller
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginService(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return successResponse(res, 200, "Login successful", {
    user,
    token: accessToken,
  });
});

// LOGOUT Controller
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  return successResponse(res, 200, "Logout successful");
});

// FORGOT PASSWORD Controller
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await forgotPasswordService(req.body);
    return successResponse(res, 200, result.message);
  },
);

// RESET PASSWORD Controller
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await resetPasswordService(req.body);
    return successResponse(res, 200, result.message);
  },
);

// GET CURRENT USER Controller
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await getCurrentUserService(userId);
    return successResponse(res, 200, "User fetched successfully", { user });
  },
);

// CHANGE PASSWORD Controller
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await changePasswordService(userId, req.body);
    return successResponse(res, 200, result.message);
  },
);

// REFRESH TOKEN Controller
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
      throw new AppError("No refresh token provided", 401);
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await refreshTokenService(refreshTokenFromCookie);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, "Token refreshed successfully", {
      token: accessToken,
    });
  },
);
