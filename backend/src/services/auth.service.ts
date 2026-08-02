import prisma from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { generateOTP, generateOTPExpiry, isOTPExpired } from "../utils/otp";
import {
  generateResetToken,
  generateTokenExpiry,
  isTokenExpired,
} from "../utils/token";
import { sendEmail } from "./email.service";
import {
  otpEmailTemplate,
  welcomeEmailTemplate,
  forgotPasswordEmailTemplate,
} from "../utils/emailTemplates";
import { AppError } from "../utils/AppError";
import type {
  SignupInput,
  LoginInput,
  VerifyOTPInput,
  ResendOTPInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from "../validators/auth.validator";

// SIGNUP Service
export const signupService = async (data: SignupInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const hashedPassword = await hashPassword(data.password);

  const otp = generateOTP();
  const otpExpiry = generateOTPExpiry();

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      otp,
      otpExpiry,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "🔐 Verify Your HealthNova AI Account",
    html: otpEmailTemplate(user.name, otp),
  });

  return {
    user,
    message: "OTP sent to your email. Please verify to continue.",
  };
};

// VERIFY OTP Service
export const verifyOTPService = async (data: VerifyOTPInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      otp: true,
      otpExpiry: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email already verified", 400);
  }

  if (!user.otp || !user.otpExpiry) {
    throw new AppError("No OTP found. Please request a new one", 400);
  }

  if (isOTPExpired(user.otpExpiry)) {
    throw new AppError("OTP has expired. Please request a new one", 400);
  }

  if (user.otp !== data.otp) {
    throw new AppError("Invalid OTP", 400);
  }

  const verifiedUser = await prisma.user.update({
    where: { email: data.email },
    data: {
      isVerified: true,
      otp: null,
      otpExpiry: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });

  const tokenPayload = {
    userId: verifiedUser.id,
    email: verifiedUser.email,
    role: verifiedUser.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  sendEmail({
    to: verifiedUser.email,
    subject: "🎉 Welcome to HealthNova AI!",
    html: welcomeEmailTemplate(verifiedUser.name),
  }).catch((err) => console.error("Welcome email failed:", err.message));

  return { user: verifiedUser, accessToken, refreshToken };
};

// RESEND OTP Service
export const resendOTPService = async (data: ResendOTPInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      otp: true,
      otpExpiry: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email already verified", 400);
  }

  const otp = generateOTP();
  const otpExpiry = generateOTPExpiry();

  await prisma.user.update({
    where: { email: data.email },
    data: { otp, otpExpiry },
  });

  await sendEmail({
    to: user.email,
    subject: "🔐 Your New HealthNova AI OTP",
    html: otpEmailTemplate(user.name, otp),
  });

  return { message: "New OTP sent to your email" };
};

// LOGIN Service
export const loginService = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const {
    password,
    otp,
    otpExpiry,
    resetToken,
    resetTokenExpiry,
    ...userWithoutSensitive
  } = user;

  return { user: userWithoutSensitive, accessToken, refreshToken };
};

// FORGOT PASSWORD Service
export const forgotPasswordService = async (data: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
    },
  });

  if (!user) {
    throw new AppError("No account found with this email", 404);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  const resetToken = generateResetToken();
  const resetTokenExpiry = generateTokenExpiry();

  await prisma.user.update({
    where: { email: data.email },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "🔐 Reset Your HealthNova AI Password",
    html: forgotPasswordEmailTemplate(user.name, resetLink),
  });

  return {
    message: "Password reset link sent to your email",
  };
};

// RESET PASSWORD Service
export const resetPasswordService = async (data: ResetPasswordInput) => {
  const user = await prisma.user.findFirst({
    where: { resetToken: data.token },
    select: {
      id: true,
      email: true,
      resetToken: true,
      resetTokenExpiry: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  if (!user.resetTokenExpiry || isTokenExpired(user.resetTokenExpiry)) {
    throw new AppError(
      "Reset token has expired. Please request a new one",
      400,
    );
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return {
    message: "Password reset successfully! Please login with new password.",
  };
};

// GET CURRENT USER Service
export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

// CHANGE PASSWORD Service
export const changePasswordService = async (
  userId: string,
  data: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isCurrentPasswordValid = await comparePassword(
    data.currentPassword,
    user.password,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 400);
  }

  const isSamePassword = await comparePassword(data.newPassword, user.password);
  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }

  const hashedPassword = await hashPassword(data.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};

// REFRESH TOKEN Service
export const refreshTokenService = async (refreshToken: string) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.isVerified) {
    throw new AppError("Account not verified", 403);
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
