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

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: logout } = useLogout();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 text-xl">
          💚
        </div>
        <div>
          <span className="text-xl font-bold text-slate-800">HealthNova</span>
          <span className="text-xs text-emerald-600 font-semibold ml-1">
            AI
          </span>
        </div>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-8">
        {/* Menu Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-emerald-600 font-medium transition"
          >
            Home
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-slate-600 hover:text-emerald-600 font-medium transition"
              >
                Dashboard
              </Link>

              {/* AI Features Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-slate-600 hover:text-emerald-600 font-medium transition flex items-center gap-1">
                    🤖 AI Features
                    <span className="text-xs">▼</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>AI Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/symptom-checker")}
                    className="cursor-pointer"
                  >
                    🩺 Symptom Checker
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/diet-plan")}
                    className="cursor-pointer"
                  >
                    🥗 Diet Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/workout-plan")}
                    className="cursor-pointer"
                  >
                    💪 Workout Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/chat")}
                    className="cursor-pointer"
                  >
                    💬 AI Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/health-tips")}>
                    💡 Health Tips
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/report-analyzer")}
                    className="cursor-pointer"
                  >
                    📄 Report Analyzer
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
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-emerald-50 px-3 py-2 rounded-xl transition">
                  <Avatar className="w-9 h-9 border-2 border-emerald-200">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-sm font-bold">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                  <span className="text-slate-400">▼</span>
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
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer"
                >
                  📊 Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/health-profile")}
                  className="cursor-pointer"
                >
                  🩺 Health Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  👤 My Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-slate-500">
                  AI Features
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigate("/symptom-checker")}
                  className="cursor-pointer"
                >
                  🩺 Symptom Checker
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/diet-plan")}
                  className="cursor-pointer"
                >
                  🥗 Diet Plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/workout-plan")}
                  className="cursor-pointer"
                >
                  💪 Workout Plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/chat")}
                  className="cursor-pointer"
                >
                  💬 AI Chat
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/report-analyzer")}
                  className="cursor-pointer"
                >
                  📄 Report Analyzer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/health-tips")}>
                  💡 Health Tips
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="cursor-pointer"
                >
                  ⚙️ Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  🚪 Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-slate-700 hover:text-emerald-600"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-200">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
