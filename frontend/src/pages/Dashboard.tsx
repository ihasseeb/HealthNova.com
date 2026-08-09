import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../store/authStore";
import { useGetHealthProfile } from "../hooks/useHealthProfile";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: profileData } = useGetHealthProfile();

  const profile = profileData?.data?.profile;

  const aiFeatures = [
    {
      icon: "🩺",
      title: "Symptom Checker",
      description: "Get AI health analysis",
      path: "/symptom-checker",
    },
    {
      icon: "🥗",
      title: "Diet Plan",
      description: "Personalized 7-day meals",
      path: "/diet-plan",
    },
    {
      icon: "💪",
      title: "Workout Plan",
      description: "Custom exercise routines",
      path: "/workout-plan",
    },
    {
      icon: "💬",
      title: "AI Chat",
      description: "Ask health questions",
      path: "/chat",
    },
    {
      icon: "📄",
      title: "Report Analyzer",
      description: "Upload medical reports",
      path: "/report-analyzer",
    },
    {
      icon: "💡",
      title: "Health Tips",
      description: "Daily wellness advice",
      path: "/health-tips",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
              </h1>
              <p className="text-white/90 text-lg">
                Your AI-powered health companion is ready
              </p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-7xl hidden md:block"
            >
              💚
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-emerald-100 hover:shadow-xl hover:border-emerald-300 transition">
              <div className="text-4xl mb-2">⚖️</div>
              <p className="text-3xl font-bold text-emerald-600">
                {profile.weight}
              </p>
              <p className="text-sm text-slate-500">Weight (kg)</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-emerald-100 hover:shadow-xl hover:border-emerald-300 transition">
              <div className="text-4xl mb-2">📏</div>
              <p className="text-3xl font-bold text-teal-600">
                {profile.height}
              </p>
              <p className="text-sm text-slate-500">Height (cm)</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-emerald-100 hover:shadow-xl hover:border-emerald-300 transition">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-3xl font-bold text-cyan-600">{profile.bmi}</p>
              <p className="text-sm text-slate-500">BMI</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-emerald-100 hover:shadow-xl hover:border-emerald-300 transition">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-lg font-bold text-emerald-600">
                {profile.goal?.replace("_", " ")}
              </p>
              <p className="text-sm text-slate-500">Goal</p>
            </div>
          </motion.div>
        )}

        {/* Setup Profile Card - If No Profile */}
        {!profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  🎯 Complete Your Health Profile
                </h3>
                <p className="text-white/90">
                  Setup your profile to unlock personalized AI recommendations
                </p>
              </div>
              <Button
                onClick={() => navigate("/health-profile")}
                className="bg-white text-emerald-600 hover:bg-slate-50 shrink-0"
              >
                Setup Now
              </Button>
            </div>
          </motion.div>
        )}

        {/* AI Features Grid */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2"
          >
            🤖 AI Health Tools
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(feature.path)}
                className="cursor-pointer"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-2xl hover:border-emerald-300 transition h-full relative overflow-hidden group">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition" />

                  <div className="relative">
                    <div className="text-5xl mb-3">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                      Try Now
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => navigate("/health-profile")}
              variant="outline"
              className="h-12 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700"
            >
              🩺 Profile
            </Button>
            <Button
              onClick={() => navigate("/chat")}
              variant="outline"
              className="h-12 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700"
            >
              💬 Chat
            </Button>
            <Button
              onClick={() => navigate("/health-tips")}
              variant="outline"
              className="h-12 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700"
            >
              💡 Tips
            </Button>
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              className="h-12 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700"
            >
              ⚙️ Settings
            </Button>
          </div>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white text-center shadow-lg"
        >
          <p className="text-lg font-semibold italic">
            "Your health is an investment, not an expense" 💚
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
