import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(user, token);
        toast.success(`Welcome, ${user.name}! 👋`);

        // 🎯 Role-based redirect for Google Login
        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (user.role === "DOCTOR") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        toast.error("Login failed");
        navigate("/login");
      }
    } else {
      toast.error("Google login failed");
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">⚕️</div>
        <p className="text-slate-600">Logging you in...</p>
      </div>
    </div>
  );
};

export default GoogleSuccess;
