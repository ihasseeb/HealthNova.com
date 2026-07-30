import api from "./api";
import type { LoginFormData, SignupFormData } from "../schemas/authSchemas";

// Login API call
export const loginUser = async (data: LoginFormData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Signup API call
export const signupUser = async (data: SignupFormData) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// Forgot Password
export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

// Logout API call
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
