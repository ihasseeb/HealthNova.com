import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-4 md:px-8 lg:px-16 py-8 md:py-16 lg:py-20">
      {/* Animated Decorative Blobs - Hidden on mobile for performance */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="hidden md:block absolute top-20 -left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="hidden md:block absolute top-40 -right-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6 md:space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200 cursor-pointer"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.span>
            <span className="text-xs md:text-sm font-semibold text-emerald-700">
              #1 AI-Powered Health Platform
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-2 md:space-y-4">
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-5xl lg:text-7xl font-bold text-slate-800 leading-tight"
            >
              Health Meets
            </motion.h1>
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Intelligence
              </span>
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-slate-600 text-base md:text-lg leading-relaxed max-w-lg"
          >
            Get instant AI-powered health insights, personalized diet plans,
            expert consultations, and 24/7 wellness support — all in one
            platform.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 shadow-xl shadow-emerald-200">
                  Get Started Free →
                </Button>
              </motion.div>
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-sm md:text-base border-emerald-200 hover:bg-emerald-50"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 md:gap-8 pt-4 md:pt-6"
          >
            <div className="text-center md:text-left">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="text-2xl md:text-3xl font-bold text-slate-800"
              >
                50K+
              </motion.p>
              <p className="text-xs md:text-sm text-slate-500">Happy Users</p>
            </div>
            <div className="text-center md:text-left border-l border-r md:border-l-0 md:border-r-0 border-slate-200 md:relative">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="text-2xl md:text-3xl font-bold text-slate-800"
              >
                500+
              </motion.p>
              <p className="text-xs md:text-sm text-slate-500">Doctors</p>
            </div>
            <div className="text-center md:text-left">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
                className="text-2xl md:text-3xl font-bold text-slate-800"
              >
                4.9★
              </motion.p>
              <p className="text-xs md:text-sm text-slate-500">Rating</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Visual Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative w-full max-w-md mx-auto lg:max-w-none"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl shadow-emerald-100 p-4 md:p-8 border border-emerald-100"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-lg md:text-xl flex-shrink-0"
                >
                  ⚡
                </motion.div>
                <div>
                  <p className="font-bold text-slate-800 text-sm md:text-base">
                    Health Score
                  </p>
                  <p className="text-xs text-slate-500">Updated just now</p>
                </div>
              </div>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-2 md:px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full"
              >
                Excellent
              </motion.span>
            </div>

            <div className="text-center py-4 md:py-6">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              >
                92
              </motion.p>
              <p className="text-xs md:text-sm text-slate-500 mt-2">
                out of 100
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              {[
                {
                  icon: "❤️",
                  label: "Heart Rate",
                  value: "72 BPM",
                  color: "emerald",
                },
                {
                  icon: "👣",
                  label: "Steps Today",
                  value: "8,432",
                  color: "teal",
                },
                {
                  icon: "🥗",
                  label: "Calories",
                  value: "1,850",
                  color: "cyan",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`flex items-center justify-between p-2.5 md:p-3 bg-${item.color}-50 rounded-xl cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base md:text-lg">{item.icon}</span>
                    <span className="text-xs md:text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-bold text-slate-800">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating Badges - Smaller on Mobile */}
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 md:-top-4 -right-2 md:-right-4 bg-white rounded-xl md:rounded-2xl shadow-xl p-2 md:p-4 border border-emerald-100"
          >
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-lg flex items-center justify-center text-sm md:text-lg">
                🧠
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] md:text-xs text-slate-500">
                  AI Analysis
                </p>
                <p className="text-xs md:text-sm font-bold text-slate-800">
                  Complete ✓
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 bg-white rounded-xl md:rounded-2xl shadow-xl p-2 md:p-4 border border-emerald-100"
          >
            <div className="flex items-center gap-1.5 md:gap-2">
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-sm md:text-lg"
              >
                🔥
              </motion.div>
              <div className="hidden sm:block">
                <p className="text-[10px] md:text-xs text-slate-500">Streak</p>
                <p className="text-xs md:text-sm font-bold text-slate-800">
                  30 Days
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
