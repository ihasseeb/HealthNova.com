import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
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

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-emerald-600 font-medium"
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-slate-600 hover:text-emerald-600 font-medium"
              >
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-slate-600 hover:text-emerald-600 font-medium flex items-center gap-1">
                    🤖 AI ▼
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>AI Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/symptom-checker")}
                  >
                    🩺 Symptom Checker
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/diet-plan")}>
                    🥗 Diet Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/workout-plan")}>
                    💪 Workout Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/chat")}>
                    💬 AI Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/report-analyzer")}
                  >
                    📄 Report Analyzer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/health-tips")}>
                    💡 Health Tips
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <Link
            to="/doctors"
            className="text-slate-600 hover:text-emerald-600 font-medium"
          >
            Doctors
          </Link>
          <Link
            to="/pricing"
            className="text-slate-600 hover:text-emerald-600 font-medium"
          >
            Pricing
          </Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-emerald-50 px-2 py-1 rounded-xl">
                  <Avatar className="w-9 h-9 border-2 border-emerald-200">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-sm font-bold">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-slate-400 text-sm">▼</span>
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
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  📊 Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/health-profile")}>
                  🩺 Health Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  ⚙️ Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-600"
                >
                  🚪 Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-2xl"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 px-4 py-4 space-y-2">
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
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 font-medium"
              >
                📊 Dashboard
              </Link>
              <div className="py-2">
                <p className="text-xs font-semibold text-slate-500 mb-2">
                  AI TOOLS
                </p>
                <div className="space-y-1 pl-2">
                  <button
                    onClick={() => {
                      navigate("/symptom-checker");
                      setMobileMenuOpen(false);
                    }}
                    className="block py-1.5 text-slate-700 text-sm"
                  >
                    🩺 Symptom Checker
                  </button>
                  <button
                    onClick={() => {
                      navigate("/diet-plan");
                      setMobileMenuOpen(false);
                    }}
                    className="block py-1.5 text-slate-700 text-sm"
                  >
                    🥗 Diet Plan
                  </button>
                  <button
                    onClick={() => {
                      navigate("/workout-plan");
                      setMobileMenuOpen(false);
                    }}
                    className="block py-1.5 text-slate-700 text-sm"
                  >
                    💪 Workout Plan
                  </button>
                  <button
                    onClick={() => {
                      navigate("/chat");
                      setMobileMenuOpen(false);
                    }}
                    className="block py-1.5 text-slate-700 text-sm"
                  >
                    💬 AI Chat
                  </button>
                  <button
                    onClick={() => {
                      navigate("/report-analyzer");
                      setMobileMenuOpen(false);
                    }}
                    className="block py-1.5 text-slate-700 text-sm"
                  >
                    📄 Report Analyzer
                  </button>
                  <button
                    onClick={() => {
                      navigate("/health-tips");
                      setMobileMenuOpen(false);
                    }}
                    className="block py-1.5 text-slate-700 text-sm"
                  >
                    💡 Health Tips
                  </button>
                </div>
              </div>
              <Link
                to="/health-profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-700 font-medium"
              >
                🩺 Health Profile
              </Link>
            </>
          )}
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            👨‍⚕️ Doctors
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            💰 Pricing
          </Link>

          <div className="pt-2 border-t border-slate-200">
            {isAuthenticated ? (
              <>
                <div className="py-2 flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-emerald-200">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-sm font-bold">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white mt-2"
                >
                  🚪 Logout
                </Button>
              </>
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
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                    Get Started
                  </Button>
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
