import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";

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

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE - Marketing Content (Hidden on Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200 w-fit">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.span>
              <span className="text-sm font-semibold text-emerald-700">
                Welcome to HealthNova AI
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl xl:text-6xl font-bold text-slate-800 leading-tight">
              Your Health,{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-lg leading-relaxed">
              Join thousands of users transforming their health journey with
              AI-powered insights, personalized plans, and 24/7 support.
            </p>

            {/* Features List */}
            <div className="space-y-4 pt-4">
              {[
                {
                  icon: "🩺",
                  title: "AI Symptom Checker",
                  desc: "Instant health analysis",
                },
                {
                  icon: "🥗",
                  title: "Personalized Diet Plans",
                  desc: "Tailored to your goals",
                },
                {
                  icon: "💪",
                  title: "Custom Workouts",
                  desc: "Fitness that fits you",
                },
                {
                  icon: "💬",
                  title: "24/7 AI Chat",
                  desc: "Health support anytime",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + 0.1 * i }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl border border-emerald-100 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {feature.title}
                    </p>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 pt-6 border-t border-slate-200"
            >
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
                  H
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
                  +
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  50,000+ Happy Users
                </p>
                <p className="text-xs text-slate-500">
                  ⭐⭐⭐⭐⭐ 4.9/5 Rating
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border border-emerald-100">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-slate-500 text-xs">
        © 2026 HealthNova AI. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
