import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-300/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Brand Logo (Centered Top) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-0 right-0 flex justify-center"
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Activity size={20} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            HealthNova
          </span>
        </Link>
      </motion.div>

      {/* Main Auth Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="glass-card p-8 md:p-10 rounded-[2rem]">
          <Outlet />
        </div>
      </motion.div>

      {/* Footer Text */}
      <div className="absolute bottom-6 text-xs text-slate-400 font-medium">
        Secure Healthcare Ecosystem © 2026
      </div>
    </div>
  );
};

export default AuthLayout;
