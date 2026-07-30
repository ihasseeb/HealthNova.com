import { useMutation } from "@tanstack/react-query";
import { loginUser, signupUser, logoutUser } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { forgotPassword } from "../services/authService";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Login Hook
export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });
};

// Signup Hook
export const useSignup = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success(`Account created! Welcome ${data.user.name} 🎉`);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    },
  });
};

// Forgot Password Hook
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Reset link sent! Check your email 📧");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to send reset link.";
      toast.error(message);
    },
  });
};

// Logout Hook
export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      toast.success("Logged out successfully 👋");
      navigate("/login");
    },
  });
};
