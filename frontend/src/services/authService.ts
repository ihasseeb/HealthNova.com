import api from "./api";
import type {
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
} from "../schemas/authSchemas";

// Signup
export const signupUser = async (data: SignupFormData) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// Verify OTP
export const verifyOTP = async (data: { email: string; otp: string }) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

// Resend OTP
export const resendOTP = async (data: { email: string }) => {
  const response = await api.post("/auth/resend-otp", data);
  return response.data;
};

// Login
export const loginUser = async (data: LoginFormData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Logout
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Forgot Password
export const forgotPassword = async (data: ForgotPasswordFormData) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

// Reset Password
export const resetPassword = async (data: {
  token: string;
  newPassword: string;
}) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

// Get Current User
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
