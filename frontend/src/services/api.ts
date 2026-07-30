import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Axios instance create karo
const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL (baad mein change karenge)
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cookies bhejne ke liye
});

// Request Interceptor - Har request pe token add karo
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor - Errors handle karo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - Auto logout
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
