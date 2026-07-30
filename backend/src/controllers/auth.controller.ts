import { Request, Response } from "express";
import { signupService, loginService } from "../services/auth.service";
import { successResponse, errorResponse } from "../utils/apiResponse";

// SIGNUP Controller
export const signup = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } = await signupService(req.body);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 201, "Account created successfully", {
      user,
      token: accessToken,
    });
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

// LOGIN Controller
export const login = async (req: Request, res: Response) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 200, "Login successful", {
      user,
      token: accessToken,
    });
  } catch (error: any) {
    return errorResponse(res, 401, error.message);
  }
};

// LOGOUT Controller
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken");
    return successResponse(res, 200, "Logout successful");
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};
