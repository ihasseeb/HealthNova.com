import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated) {
    if (user?.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user?.role === "DOCTOR") {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
