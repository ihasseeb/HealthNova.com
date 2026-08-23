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

  // AI Tools Navigation List
  const aiFeatures = [
    {
      icon: "🩺",
      title: "Symptom Checker",
      description: "Get instant AI health insights",
      path: "/symptom-checker",
    },
    {
      icon: "🥗",
      title: "Diet Plan",
      description: "Personalized 7-day meal guide",
      path: "/diet-plan",
    },
    {
      icon: "💪",
      title: "Workout Routine",
      description: "Custom fitness plans",
      path: "/workout-plan",
    },
    {
      icon: "💬",
      title: "AI Health Chat",
      description: "24/7 Virtual Consultation",
      path: "/chat",
    },
    {
      icon: "📄",
      title: "Report Analyzer",
      description: "AI Medical Vision Analysis",
      path: "/report-analyzer",
    },
    {
      icon: "💡",
      title: "Health Tips",
      description: "Daily personalized advice",
      path: "/health-tips",
    },
  ];

  // Core Management Links
  const quickManagement = [
    {
      icon: "📅",
      title: "My Appointments",
      description: "View & manage bookings",
      path: "/appointments",
      badge: "Consultations",
    },
    {
      icon: "💊",
      title: "Prescriptions",
      description: "Digital Rx from doctors",
      path: "/prescriptions",
      badge: "Medications",
    },
    {
      icon: "📁",
      title: "Medical Vault",
      description: "Store & share records",
      path: "/medical-records",
      badge: "Documents",
    },
    {
      icon: "💳",
      title: "Billing & Receipts",
      description: "Subscriptions & payments",
      path: "/payment/history",
      badge: "Finance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* 1. Welcome Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs md:text-sm font-medium mb-1">
                Patient Portal
              </p>
              <h1 className="text-2xl md:text-4xl font-bold">
                Welcome back, {user?.name?.split(" ")[0] || "Patient"}! 👋
              </h1>
              <p className="text-white/90 text-sm md:text-base mt-1">
                Your AI-powered health metrics & clinical records in one place
              </p>
            </div>
            <div className="text-6xl hidden md:block">💚</div>
          </div>
        </motion.div>

        {/* 2. Setup Profile Alert Banner (If Profile Missing) */}
        {!profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-amber-900 text-base">
                  Complete Your Health Profile
                </h3>
                <p className="text-amber-700 text-xs mt-0.5">
                  Set up your age, weight, and allergies so AI can give you
                  accurate recommendations.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/health-profile")}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs w-full sm:w-auto shrink-0"
            >
              Setup Profile Now →
            </Button>
          </motion.div>
        )}

        {/* 3. Health Profile Summary Bar (If Profile Exists) */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          >
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-emerald-100 text-center">
              <p className="text-2xl md:text-3xl font-bold text-emerald-600">
                {profile.weight} kg
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Weight</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-emerald-100 text-center">
              <p className="text-2xl md:text-3xl font-bold text-teal-600">
                {profile.height} cm
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Height</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-emerald-100 text-center">
              <p className="text-2xl md:text-3xl font-bold text-cyan-600">
                {profile.bmi || "N/A"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">BMI Score</p>
            </div>
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-emerald-100 text-center">
              <p className="text-sm md:text-base font-bold text-emerald-700 truncate">
                {profile.goal?.replace("_", " ") || "Maintain"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Current Goal</p>
            </div>
          </motion.div>
        )}

        {/* 4. Core Clinical & Management Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            📋 Patient Records & Appointments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickManagement.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                onClick={() => navigate(item.path)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-400 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Access Module →
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. AI Features Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
            🤖 AI Health Intelligence Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {aiFeatures.map((tool, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                onClick={() => navigate(tool.path)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 hover:border-emerald-500 hover:shadow-md cursor-pointer transition"
              >
                <div className="text-4xl mb-3">{tool.icon}</div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {tool.description}
                </p>
                <div className="mt-4 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Launch AI Tool →
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 6. Quick Action Shortcuts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">⚡ Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/doctors")}
              className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              👨‍⚕️ Book Doctor
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/chat")}
              className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              💬 Consult AI
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/health-profile")}
              className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              🩺 Edit Health Stats
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/payment/history")}
              className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              💳 Subscriptions
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
