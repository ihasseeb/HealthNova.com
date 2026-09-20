import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useAuth";
import NotificationBell from "./NotificationBell";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Activity,
  Sparkles,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  const isDoctor = user?.role === "DOCTOR";
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="fixed top-0 inset-x-0 z-[100] flex justify-center mt-4 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto w-full max-w-6xl glass-nav rounded-full px-6 py-3 shadow-lg shadow-primary-900/5 flex items-center justify-between transition-all bg-white/80"
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-accent-500/30 transition-all">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            HealthNova<span className="text-primary-500">.AI</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
          {/* <Link
            to="/"
            className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
          >
            Home
          </Link>

          {isAuthenticated && (
            <Link
              to={
                isAdmin
                  ? "/admin/dashboard"
                  : isDoctor
                    ? "/doctor/dashboard"
                    : "/dashboard"
              }
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/doctors"
            className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
          >
            Doctors
          </Link>
          <Link
            to="/pharmacy"
            className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
          >
            Pharmacy
          </Link> */}

          {isAuthenticated && !isDoctor && !isAdmin && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 rounded-full text-sm font-medium text-accent-600 bg-accent-50 hover:bg-accent-100 flex items-center gap-2 transition-all outline-none">
                  <Sparkles size={16} /> AI Tools
                </button>
              </DropdownMenuTrigger>
              {/* SOLID BACKGROUND ADDED HERE */}
              <DropdownMenuContent
                align="center"
                className="w-56 rounded-2xl p-2 bg-white shadow-2xl border border-slate-200 z-[110]"
              >
                <DropdownMenuLabel className="text-xs text-slate-400">
                  Intelligence Suite
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem
                  onClick={() => navigate("/symptom-checker")}
                  className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                >
                  🩺 Symptom Checker
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/diet-plan")}
                  className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                >
                  🥗 AI Diet Plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/workout-plan")}
                  className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                >
                  💪 Workout Plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/chat")}
                  className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                >
                  💬 Health Chatbot
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/report-analyzer")}
                  className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                >
                  📄 Report Analyzer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* AUTH SECTION */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 pr-4 rounded-full hover:shadow-md transition-all outline-none">
                    <Avatar className="w-8 h-8 rounded-full border border-primary-200">
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-bold">
                        {getInitials(user?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-slate-700">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                {/* SOLID BACKGROUND ADDED HERE */}
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-2 bg-white shadow-2xl border border-slate-200 z-[110]"
                >
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                  >
                    <UserIcon size={16} className="mr-3 text-slate-500" /> My
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="rounded-xl cursor-pointer py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 font-medium"
                  >
                    <LogOut size={16} className="mr-3" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link to="/signup">
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-lg px-6 h-10 text-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl p-6 border border-slate-200 pointer-events-auto z-[110]"
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-700 hover:text-primary-600"
              >
                Home
              </Link>

              {isAuthenticated && (
                <Link
                  to={
                    isAdmin
                      ? "/admin/dashboard"
                      : isDoctor
                        ? "/doctor/dashboard"
                        : "/dashboard"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-semibold text-slate-700 hover:text-primary-600"
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/doctors"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-700 hover:text-primary-600"
              >
                Find Doctors
              </Link>
              <Link
                to="/pharmacy"
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-700 hover:text-primary-600"
              >
                Pharmacy Store
              </Link>

              {isAuthenticated ? (
                <Button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  variant="destructive"
                  className="mt-4 rounded-xl font-bold"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl font-bold"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-xl bg-slate-900 text-white font-bold">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
