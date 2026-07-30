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
    <section className="relative overflow-hidden px-8 lg:px-16 py-20">
      {/* Animated Decorative Blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 -left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-40 -right-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200 cursor-pointer"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.span>
            <span className="text-sm font-semibold text-emerald-700">
              #1 AI-Powered Health Platform
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold text-slate-800 leading-tight"
            >
              Health Meets
            </motion.h1>
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Intelligence
              </span>
            </motion.h1>
          </div>

          <motion.p
            variants={itemVariants}
            className="text-slate-600 text-lg leading-relaxed max-w-lg"
          >
            Get instant AI-powered health insights, personalized diet plans,
            expert consultations, and 24/7 wellness support — all in one
            platform.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link to="/signup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="h-14 px-8 text-base bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 shadow-xl shadow-emerald-200">
                  Get Started Free →
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="h-14 px-8 text-base border-emerald-200 hover:bg-emerald-50"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-8 pt-6">
            <div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="text-3xl font-bold text-slate-800"
              >
                50K+
              </motion.p>
              <p className="text-sm text-slate-500">Happy Users</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="text-3xl font-bold text-slate-800"
              >
                500+
              </motion.p>
              <p className="text-sm text-slate-500">Expert Doctors</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
                className="text-3xl font-bold text-slate-800"
              >
                4.9★
              </motion.p>
              <p className="text-sm text-slate-500">User Rating</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Visual Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative bg-white rounded-3xl shadow-2xl shadow-emerald-100 p-8 border border-emerald-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-xl"
                >
                  ⚡
                </motion.div>
                <div>
                  <p className="font-bold text-slate-800">Health Score</p>
                  <p className="text-xs text-slate-500">Updated just now</p>
                </div>
              </div>
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full"
              >
                Excellent
              </motion.span>
            </div>

            <div className="text-center py-6">
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              >
                92
              </motion.p>
              <p className="text-sm text-slate-500 mt-2">out of 100</p>
            </div>

            <div className="space-y-3">
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
                  className={`flex items-center justify-between p-3 bg-${item.color}-50 rounded-xl cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating Badges */}
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-lg flex items-center justify-center text-lg">
                🧠
              </div>
              <div>
                <p className="text-xs text-slate-500">AI Analysis</p>
                <p className="text-sm font-bold text-slate-800">Complete ✓</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-lg"
              >
                🔥
              </motion.div>
              <div>
                <p className="text-xs text-slate-500">Streak</p>
                <p className="text-sm font-bold text-slate-800">30 Days</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
