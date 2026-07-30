import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Agar logged in hai → dashboard pe redirect
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Logged in nahi hai → login/signup dikhao
  return <Outlet />;
};

export default PublicRoute;
