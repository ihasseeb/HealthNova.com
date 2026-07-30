import { create } from "zustand";
import { persist } from "zustand/middleware";

// User type define karo
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Store ka type define karo
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Store create karo
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Login function
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      // Logout function
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // localStorage mein save hoga
    },
  ),
);
