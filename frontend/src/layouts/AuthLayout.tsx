import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <nav className="px-4 md:px-8 py-4 glass-nav z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                HealthNova
              </span>
              <span className="text-xs text-primary-600 font-bold ml-1">
                AI
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* LEFT SIDE - Marketing Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-200/50 w-fit">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              <span className="text-sm font-bold text-primary-700 tracking-wide uppercase">
                Welcome to HealthNova
              </span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Your Health,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                Powered by AI
              </span>
            </h1>

            <p className="text-slate-500 text-lg leading-relaxed max-w-lg font-medium">
              Join thousands of users transforming their health journey with
              AI-powered insights, personalized plans, and 24/7 expert support.
            </p>

            {/* Feature List */}
            <div className="space-y-5 pt-4">
              {[
                {
                  icon: "🩺",
                  title: "AI Symptom Checker",
                  desc: "Instant clinical health analysis",
                },
                {
                  icon: "🥗",
                  title: "Personalized Diet",
                  desc: "Nutrition tailored to your goals",
                },
                {
                  icon: "💬",
                  title: "24/7 AI Chatbot",
                  desc: "Virtual health support anytime",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + 0.1 * i }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-slate-100 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{feature.title}</p>
                    <p className="text-sm text-slate-500 font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE - Auth Form (Glass Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 md:p-10 border border-white/50">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-xs font-medium">
        Secure Healthcare Ecosystem © 2026 HealthNova AI.
      </footer>
    </div>
  );
};

export default AuthLayout;
