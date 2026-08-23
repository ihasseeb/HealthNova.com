import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  signupUser,
  logoutUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// SIGNUP Hook - Redirect to OTP page
export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (response, variables) => {
      toast.success(response.message);
      // Redirect to OTP verification with email
      navigate("/verify-otp", { state: { email: variables.email } });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
    },
  });
};

// VERIFY OTP Hook
export const useVerifyOTP = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: (response) => {
      toast.success(response.message || "Email verified! 🎉");
      toast.info("Please login to continue");
      navigate("/login");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "OTP verification failed";
      toast.error(message);
    },
  });
};

// RESEND OTP Hook
export const useResendOTP = () => {
  return useMutation({
    mutationFn: resendOTP,
    onSuccess: (response) => {
      toast.success(response.message || "New OTP sent!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to resend OTP";
      toast.error(message);
    },
  });
};

// LOGIN Hook
export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      toast.loading("Logging in...", { id: "login" });
    },
    onSuccess: (response) => {
      const { user, token } = response.data;
      login(user, token);
      toast.success(`Welcome back, ${user.name}! 👋`, { id: "login" });

      // 🎯 Role-Based Smart Redirect
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "DOCTOR") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message, { id: "login" });
    },
  });
};
// LOGOUT Hook
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
    onError: () => {
      logout();
      navigate("/login");
    },
  });
};

// FORGOT PASSWORD Hook
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response.message || "Reset link sent to your email!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to send reset link";
      toast.error(message);
    },
  });
};

// RESET PASSWORD Hook
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successful!");
      navigate("/login");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Reset failed";
      toast.error(message);
    },
  });
};
