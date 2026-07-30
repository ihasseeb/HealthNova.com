import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import { motion, type Variants } from "framer-motion";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Welcome Header */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />

          <div className="relative flex items-center justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-sm mb-1"
              >
                Good Morning 🌅
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold mb-2"
              >
                Welcome back, {user?.name}!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/90"
              >
                Here's your health overview for today
              </motion.p>
            </div>
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl"
            >
              👋
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">
                ❤️
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                +5%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">72</p>
            <p className="text-sm text-slate-500 mt-1">Heart Rate (BPM)</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-2xl">
                💧
              </div>
              <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">
                75%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">6/8</p>
            <p className="text-sm text-slate-500 mt-1">Water Glasses</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
                🔥
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">1,850</p>
            <p className="text-sm text-slate-500 mt-1">Calories Burned</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                👣
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                84%
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">8,432</p>
            <p className="text-sm text-slate-500 mt-1">Steps Today</p>
          </motion.div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Score Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Health Score
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Your overall wellness
                </p>
              </div>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full"
              >
                Excellent
              </motion.span>
            </div>

            <div className="flex items-center justify-center py-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative w-48 h-48"
              >
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#e2e8f0"
                    strokeWidth="16"
                    fill="none"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray="502"
                    initial={{ strokeDashoffset: 502 }}
                    animate={{ strokeDashoffset: 50 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
                  >
                    92
                  </motion.p>
                  <p className="text-sm text-slate-500">out of 100</p>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-center cursor-pointer"
              >
                <p className="text-2xl font-bold text-emerald-600">95</p>
                <p className="text-xs text-slate-500">Physical</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-center cursor-pointer"
              >
                <p className="text-2xl font-bold text-cyan-600">88</p>
                <p className="text-xs text-slate-500">Mental</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-center cursor-pointer"
              >
                <p className="text-2xl font-bold text-teal-600">93</p>
                <p className="text-xs text-slate-500">Nutrition</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Quick Actions
            </h2>
            <motion.div variants={containerVariants} className="space-y-3">
              {[
                { icon: "🧠", text: "AI Symptom Check", color: "emerald" },
                { icon: "🥗", text: "Get Diet Plan", color: "cyan" },
                { icon: "💪", text: "Workout Plan", color: "orange" },
                { icon: "📋", text: "Upload Report", color: "purple" },
                { icon: "👨‍⚕️", text: "Book Doctor", color: "rose" },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className={`w-full justify-start bg-${action.color}-50 hover:bg-${action.color}-100 text-${action.color}-700 h-14 text-base`}
                  >
                    {action.icon} {action.text}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Recent Activity
            </h2>
            <motion.div variants={containerVariants} className="space-y-4">
              {[
                {
                  icon: "✅",
                  bg: "emerald",
                  title: "Morning workout completed",
                  desc: "30 minutes • 250 calories",
                  time: "2h ago",
                },
                {
                  icon: "🥗",
                  bg: "cyan",
                  title: "Logged breakfast",
                  desc: "450 calories • High protein",
                  time: "3h ago",
                },
                {
                  icon: "😴",
                  bg: "purple",
                  title: "Great sleep quality",
                  desc: "7h 45m • Deep sleep",
                  time: "Today",
                },
                {
                  icon: "💊",
                  bg: "rose",
                  title: "Medicine reminder",
                  desc: "Vitamin D • Taken",
                  time: "5h ago",
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5, backgroundColor: "#f8fafc" }}
                  className="flex items-center gap-4 p-3 rounded-xl transition cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 bg-${activity.bg}-100 rounded-full flex items-center justify-center text-lg`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 text-sm">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500">{activity.desc}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Upcoming Appointment */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg text-white cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-4">Upcoming Appointment</h2>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl"
                >
                  👨‍⚕️
                </motion.div>
                <div>
                  <p className="font-bold text-lg">Dr. Sarah Ahmed</p>
                  <p className="text-white/80 text-sm">Cardiologist</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>Tomorrow, 10:30 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Video Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>30 minutes session</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button className="w-full bg-white text-emerald-600 hover:bg-slate-50">
                  Join Call
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white">
                  Reschedule
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 pt-6 border-t border-white/20"
            >
              <p className="text-sm text-white/80 mb-1">💡 Health Tip</p>
              <p className="text-sm">
                Drink at least 8 glasses of water daily for optimal hydration!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
