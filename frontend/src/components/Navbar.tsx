import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useAuth";
import NotificationBell from "../pages/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isDoctor = user?.role === "DOCTOR";
  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* 1. Logo - LEFT */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg text-lg">
            💚
          </div>
          <div>
            <span className="text-lg md:text-xl font-bold text-slate-800">
              HealthNova
            </span>
            <span className="text-xs text-emerald-600 font-semibold ml-1">
              AI
            </span>
          </div>
        </Link>

        {/* 2. Desktop Navigation Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-emerald-600 font-medium transition"
          >
            Home
          </Link>

          {isAuthenticated && (
            <>
              {/* Dashboard Link based on Role */}
              <Link
                to={
                  isAdmin
                    ? "/admin/dashboard"
                    : isDoctor
                      ? "/doctor/dashboard"
                      : "/dashboard"
                }
                className="text-slate-600 hover:text-emerald-600 font-medium transition"
              >
                {isAdmin
                  ? "Admin Portal"
                  : isDoctor
                    ? "Doctor Portal"
                    : "Dashboard"}
              </Link>

              {/* Patient Only Quick Links */}
              {!isDoctor && !isAdmin && (
                <>
                  <Link
                    to="/appointments"
                    className="text-slate-600 hover:text-emerald-600 font-medium transition"
                  >
                    My Appointments
                  </Link>
                  <Link
                    to="/prescriptions"
                    className="text-slate-600 hover:text-emerald-600 font-medium transition"
                  >
                    Prescriptions
                  </Link>
                </>
              )}

              {/* AI Features Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="text-slate-600 hover:text-emerald-600 font-medium transition flex items-center gap-1.5 outline-none">
                    <span className="text-lg">🤖</span>
                    <span>AI Tools</span>
                    <span className="text-xs">▼</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>AI Health Features</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/symptom-checker")}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">🩺</span> Symptom Checker
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/diet-plan")}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">🥗</span> Diet Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/workout-plan")}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">💪</span> Workout Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/chat")}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">💬</span> AI Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/report-analyzer")}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">📄</span> Report Analyzer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/health-tips")}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">💡</span> Health Tips
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <Link
            to="/doctors"
            className="text-slate-600 hover:text-emerald-600 font-medium transition"
          >
            Doctors
          </Link>
          <Link
            to="/pricing"
            className="text-slate-600 hover:text-emerald-600 font-medium transition"
          >
            Pricing
          </Link>

          {/* User Controls & Bell Icon */}
          <div className="border-l border-slate-200 pl-6 flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationBell />

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:bg-emerald-50 px-3 py-2 rounded-xl transition outline-none">
                      <Avatar className="w-9 h-9 border-2 border-emerald-200">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-sm font-bold">
                          {user?.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {user?.name?.split(" ")[0] || "User"}
                        </p>
                        <p className="text-xs text-slate-500 leading-tight">
                          {user?.role || "USER"}
                        </p>
                      </div>
                      <span className="text-slate-400 text-xs">▼</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-slate-500 font-normal">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Role Specific Links */}
                    {isDoctor ? (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/doctor/dashboard")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">👨‍⚕️</span> Doctor Portal
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/doctor/appointments")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">📅</span> Patient Visits
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate("/doctor/create-prescription")
                          }
                          className="cursor-pointer"
                        >
                          <span className="mr-2">📋</span> Issue Prescription
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/doctor-chat")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">💬</span> Patient Messages
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/doctor/profile-setup")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">⚙️</span> Credentials Setup
                        </DropdownMenuItem>
                      </>
                    ) : isAdmin ? (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/admin/dashboard")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">🛡️</span> Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/dashboard")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">📊</span> Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/health-profile")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">🩺</span> Health Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/appointments")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">📅</span> My Appointments
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/prescriptions")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">💊</span> My Prescriptions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/medical-records")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">📁</span> Medical Vault
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/payment/history")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">💳</span> Billing & Receipts
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/profile")}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">👤</span> Account Settings
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <span className="mr-2">🚪</span> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3. Mobile Navigation Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated && <NotificationBell />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-2xl text-slate-700"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 4. Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 px-4 py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            🏠 Home
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to={isDoctor ? "/doctor/dashboard" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 font-medium"
              >
                📊 {isDoctor ? "Doctor Portal" : "Dashboard"}
              </Link>

              {!isDoctor && !isAdmin && (
                <>
                  <Link
                    to="/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-slate-700 font-medium"
                  >
                    📅 My Appointments
                  </Link>
                  <Link
                    to="/prescriptions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-slate-700 font-medium"
                  >
                    💊 My Prescriptions
                  </Link>
                  <Link
                    to="/medical-records"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-slate-700 font-medium"
                  >
                    📁 Medical Records
                  </Link>
                </>
              )}

              {/* AI Features Mobile */}
              <div className="py-2">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">
                  🤖 AI Tools
                </p>
                <div className="space-y-1 pl-2">
                  <button
                    onClick={() => {
                      navigate("/symptom-checker");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-slate-700 text-sm"
                  >
                    🩺 Symptom Checker
                  </button>
                  <button
                    onClick={() => {
                      navigate("/diet-plan");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-slate-700 text-sm"
                  >
                    🥗 Diet Plan
                  </button>
                  <button
                    onClick={() => {
                      navigate("/workout-plan");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-slate-700 text-sm"
                  >
                    💪 Workout Plan
                  </button>
                  <button
                    onClick={() => {
                      navigate("/chat");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-slate-700 text-sm"
                  >
                    💬 AI Chat
                  </button>
                  <button
                    onClick={() => {
                      navigate("/report-analyzer");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-slate-700 text-sm"
                  >
                    📄 Report Analyzer
                  </button>
                </div>
              </div>
            </>
          )}

          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            👨‍⚕️ Doctors
          </Link>

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white mt-2"
              >
                🚪 Logout
              </Button>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button className="w-full bg-emerald-600">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
