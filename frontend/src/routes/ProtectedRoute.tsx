import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Agar logged in nahi hai → login pe redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in hai → page dikhao
  return <Outlet />;
};

export default ProtectedRoute;
