import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request Interceptor - Attach Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - Smart Token Refresh & Handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try calling silent refresh-token API
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        if (res.data?.success && res.data?.data?.token) {
          const newToken = res.data.data.token;
          const user = useAuthStore.getState().user;

          // Update token in Zustand
          if (user) {
            useAuthStore.getState().login(user, newToken);
          }

          // Retry original failed request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails & user is on a protected route, ONLY THEN logout
        const currentPath = window.location.pathname;
        const isAuthPage = [
          "/login",
          "/signup",
          "/forgot-password",
          "/verify-otp",
          "/",
        ].includes(currentPath);

        if (!isAuthPage) {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
