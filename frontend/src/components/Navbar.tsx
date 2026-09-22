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
  const isPatient = user?.role === "PATIENT";

  return (
    <div className="fixed top-0 inset-x-0 z-[100] flex justify-center mt-4 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto w-full max-w-6xl glass-nav rounded-full px-6 py-3 shadow-lg shadow-primary-900/5 flex items-center justify-between transition-all bg-white/80"
      >
        {/* LOGO - ALWAYS VISIBLE */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-accent-500/30 transition-all">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
              HealthNova
            </span>
            <span className="text-xs text-primary-600 font-bold ml-1">AI</span>
          </div>
        </Link>

        {/* DESKTOP LINKS - ONLY VISIBLE IF AUTHENTICATED */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {/* Patient Links */}
            {isPatient && (
              <>
                <Link
                  to="/"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                >
                  Dashboard
                </Link>
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
                </Link>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="px-4 py-2 rounded-full text-sm font-medium text-accent-600 bg-accent-50 hover:bg-accent-100 flex items-center gap-2 transition-all outline-none">
                      <Sparkles size={16} /> AI Tools
                    </button>
                  </DropdownMenuTrigger>
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
                    <DropdownMenuItem
                      onClick={() => navigate("/health-tips")}
                      className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                    >
                      💡 Health Tips
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Doctor Links */}
            {isDoctor && (
              <>
                <Link
                  to="/doctor/dashboard"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                >
                  Doctor Portal
                </Link>
                <Link
                  to="/doctor/appointments"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                >
                  Schedule
                </Link>
                <Link
                  to="/doctor/prescriptions"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                >
                  Rx Center
                </Link>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="px-4 py-2 rounded-full text-sm font-bold text-accent-700 hover:text-accent-900 hover:bg-white transition-all shadow-sm"
              >
                Admin Command Center
              </Link>
            )}
          </div>
        )}

        {/* AUTH SECTION & AVATAR */}
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
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-2 bg-white shadow-2xl border border-slate-200 z-[110]"
                >
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-slate-500 font-normal">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />

                  {isDoctor ? (
                    <DropdownMenuItem
                      onClick={() => navigate("/doctor/profile-setup")}
                      className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                    >
                      <UserIcon size={16} className="mr-3 text-slate-500" />{" "}
                      Clinic Profile
                    </DropdownMenuItem>
                  ) : isAdmin ? null : (
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                    >
                      <UserIcon size={16} className="mr-3 text-slate-500" /> My
                      Profile
                    </DropdownMenuItem>
                  )}

                  {!isAdmin && (
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="rounded-xl cursor-pointer py-2 hover:bg-slate-50 font-medium text-slate-700"
                    >
                      <span className="mr-3 text-slate-500">⚙️</span> Settings
                    </DropdownMenuItem>
                  )}

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
            // LOGGED OUT VIEW - ONLY LOGIN & GET STARTED
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

        {/* MOBILE MENU TOGGLE - ONLY VISIBLE IF LOGGED IN (To avoid blank menu for guests) */}
        {isAuthenticated && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 outline-none ml-auto"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </motion.nav>

      {/* MOBILE DRAWER (For Authenticated Users) */}
      <AnimatePresence>
        {mobileMenuOpen && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 pointer-events-auto z-[110]"
          >
            <div className="flex flex-col gap-4">
              {isPatient && (
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-semibold text-slate-700 hover:text-primary-600"
                  >
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-semibold text-slate-700 hover:text-primary-600"
                  >
                    Dashboard
                  </Link>
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
                        className="block w-full text-left py-2 text-slate-700 text-sm hover:text-primary-600"
                      >
                        🩺 Symptom Checker
                      </button>
                      <button
                        onClick={() => {
                          navigate("/diet-plan");
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 text-slate-700 text-sm hover:text-primary-600"
                      >
                        🥗 Diet Plan
                      </button>
                      <button
                        onClick={() => {
                          navigate("/workout-plan");
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 text-slate-700 text-sm hover:text-primary-600"
                      >
                        💪 Workout Plan
                      </button>
                      <button
                        onClick={() => {
                          navigate("/chat");
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 text-slate-700 text-sm hover:text-primary-600"
                      >
                        💬 AI Chat
                      </button>
                      <button
                        onClick={() => {
                          navigate("/report-analyzer");
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-2 text-slate-700 text-sm hover:text-primary-600"
                      >
                        📄 Report Analyzer
                      </button>
                    </div>
                  </div>
                </>
              )}

              {isDoctor && (
                <>
                  <Link
                    to="/doctor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-semibold text-slate-700 hover:text-primary-600"
                  >
                    Doctor Portal
                  </Link>
                  <Link
                    to="/doctor/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-semibold text-slate-700 hover:text-primary-600"
                  >
                    Schedule
                  </Link>
                  <Link
                    to="/doctor/prescriptions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-semibold text-slate-700 hover:text-primary-600"
                  >
                    Rx Center
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-accent-600"
                >
                  Admin Command Center
                </Link>
              )}

              <div className="pt-4 border-t border-slate-200 mt-2">
                <Button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  variant="destructive"
                  className="w-full rounded-xl"
                >
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
