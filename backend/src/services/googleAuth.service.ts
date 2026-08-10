import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

// Generate Google OAuth URL
export const getGoogleAuthUrl = (): string => {
  return client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });
};

// Handle Google OAuth callback
export const googleAuthCallbackService = async (code: string) => {
  try {
    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AppError("Failed to get Google user info", 400);
    }

    const { email, name, picture } = payload;

    if (!email || !name) {
      throw new AppError("Google account missing required info", 400);
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create new
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: "google-oauth-" + Date.now(), // Placeholder password
          isVerified: true, // Google already verified
        },
      });
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Remove sensitive data
    const {
      password,
      otp,
      otpExpiry,
      resetToken,
      resetTokenExpiry,
      ...userWithoutSensitive
    } = user;

    return { user: userWithoutSensitive, accessToken, refreshToken };
  } catch (error: any) {
    throw new AppError(error.message || "Google authentication failed", 500);
  }
};
