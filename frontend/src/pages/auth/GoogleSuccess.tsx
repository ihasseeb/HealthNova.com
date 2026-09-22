import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import { Activity } from "lucide-react";

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

        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (user.role === "DOCTOR") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    } else {
      toast.error("Google login failed. Connection interrupted.");
      navigate("/login");
    }
  }, [login, navigate, searchParams]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-primary-200 rounded-full blur-xl animate-pulse" />
        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center relative z-10 border border-slate-100">
          <Activity size={36} className="text-primary-600 animate-bounce" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Authenticating...</h2>
        <p className="text-sm font-medium text-slate-500">
          Securely connecting your Google Account
        </p>
      </div>
    </div>
  );
};

export default GoogleSuccess;
