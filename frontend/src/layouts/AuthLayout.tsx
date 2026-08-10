import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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

          <Link
            to="/"
            className="text-sm text-slate-600 hover:text-emerald-600 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-emerald-100">
            <Outlet />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-slate-500 text-xs">
        © 2026 HealthNova AI. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
