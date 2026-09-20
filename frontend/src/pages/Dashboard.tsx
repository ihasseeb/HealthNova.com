import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useAuthStore } from "../store/authStore";
import { useGetHealthProfile } from "../hooks/useHealthProfile";
import {
  Stethoscope,
  Salad,
  Dumbbell,
  MessageSquare,
  FileText,
  Lightbulb,
  Brain,
  Calendar,
  Pill,
  FileBox,
  CreditCard,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data: profileData, isLoading } = useGetHealthProfile();

  const profile = profileData?.data?.profile;

  // AI Tools List with refined modern colors and Lucide Icons
  const aiFeatures = [
    {
      icon: <Stethoscope size={32} strokeWidth={1.5} />,
      title: "Symptom Checker",
      description: "Get instant AI health insights",
      path: "/symptom-checker",
      color: "text-emerald-500",
      bgHover: "hover:bg-emerald-50",
      borderColor: "hover:border-emerald-200",
    },
    {
      icon: <Salad size={32} strokeWidth={1.5} />,
      title: "Diet Plan",
      description: "Personalized 7-day meal guide",
      path: "/diet-plan",
      color: "text-orange-500",
      bgHover: "hover:bg-orange-50",
      borderColor: "hover:border-orange-200",
    },
    {
      icon: <Dumbbell size={32} strokeWidth={1.5} />,
      title: "Workout Routine",
      description: "Custom fitness plans",
      path: "/workout-plan",
      color: "text-blue-500",
      bgHover: "hover:bg-blue-50",
      borderColor: "hover:border-blue-200",
    },
    {
      icon: <MessageSquare size={32} strokeWidth={1.5} />,
      title: "AI Health Chat",
      description: "24/7 Virtual Consultation",
      path: "/chat",
      color: "text-purple-500",
      bgHover: "hover:bg-purple-50",
      borderColor: "hover:border-purple-200",
    },
    {
      icon: <FileText size={32} strokeWidth={1.5} />,
      title: "Report Analyzer",
      description: "AI Medical Vision Analysis",
      path: "/report-analyzer",
      color: "text-cyan-500",
      bgHover: "hover:bg-cyan-50",
      borderColor: "hover:border-cyan-200",
    },
    {
      icon: <Lightbulb size={32} strokeWidth={1.5} />,
      title: "Health Tips",
      description: "Daily personalized advice",
      path: "/health-tips",
      color: "text-yellow-500",
      bgHover: "hover:bg-yellow-50",
      borderColor: "hover:border-yellow-200",
    },
    {
      icon: <Brain size={32} strokeWidth={1.5} />,
      title: "Mental Health",
      description: "Mood tracking & AI therapy",
      path: "/mental-health",
      color: "text-indigo-500",
      bgHover: "hover:bg-indigo-50",
      borderColor: "hover:border-indigo-200",
    },
  ];

  // Core Management Links
  const quickManagement = [
    {
      icon: <Calendar size={28} strokeWidth={1.5} className="text-slate-600" />,
      title: "Appointments",
      description: "Manage bookings",
      path: "/appointments",
    },
    {
      icon: <Pill size={28} strokeWidth={1.5} className="text-slate-600" />,
      title: "Prescriptions",
      description: "Digital Rx records",
      path: "/prescriptions",
    },
    {
      icon: <FileBox size={28} strokeWidth={1.5} className="text-slate-600" />,
      title: "Medical Vault",
      description: "Store & share records",
      path: "/medical-records",
    },
    {
      icon: (
        <CreditCard size={28} strokeWidth={1.5} className="text-slate-600" />
      ),
      title: "Billing & Receipts",
      description: "Track payments",
      path: "/payment/history",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* 1. Welcome Header Banner (Glassmorphism & Gradient) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-200/50 bg-white"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-accent-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Patient Portal
              </p>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Good to see you,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                {user?.name?.split(" ")[0] || "User"}
              </span>{" "}
              👋
            </h1>
            <p className="text-slate-500 text-base md:text-lg mt-3 max-w-2xl">
              Your comprehensive AI-powered health dashboard. Monitor your
              vitals, connect with experts, and manage clinical records
              seamlessly.
            </p>
          </div>
        </motion.div>

        {/* 2. Setup Profile Alert Banner */}
        {!profile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
          >
            <div>
              <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
                ⚠️ Action Required: Complete Profile
              </h3>
              <p className="text-amber-700 text-sm mt-1">
                AI tools require your basic health metrics (age, weight, height)
                to generate accurate insights.
              </p>
            </div>
            <Button
              onClick={() => navigate("/health-profile")}
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 w-full sm:w-auto shrink-0 rounded-xl"
            >
              Setup Profile Now
            </Button>
          </motion.div>
        )}

        {/* 3. Health Metrics Cards (Minimalist Premium Look) */}
        {profile && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">
              Health Overview
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  label: "Weight",
                  value: `${profile.weight} kg`,
                  desc: "Current weight",
                },
                {
                  label: "Height",
                  value: `${profile.height} cm`,
                  desc: "Current height",
                },
                {
                  label: "BMI Score",
                  value: profile.bmi || "N/A",
                  desc: "Body Mass Index",
                },
                {
                  label: "Health Goal",
                  value: profile.goal?.replace(/_/g, " ") || "Maintain",
                  desc: "Active focus",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 hover:shadow-md hover:border-primary-200 transition-all group"
                >
                  <p className="text-sm font-semibold text-slate-500 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-extrabold text-slate-800 group-hover:text-primary-600 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">{stat.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        )}

        {/* 4. Core Management Section (Compact Grid) */}
        <div className="pt-4">
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">
            Clinical Records
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickManagement.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => navigate(item.path)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-slate-300 cursor-pointer transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. AI Intelligence Tools (Premium Glass Cards) */}
        <div className="pt-4">
          <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">
            Intelligence Suite
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiFeatures.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(tool.path)}
                className={`bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 cursor-pointer transition-all duration-300 ${tool.borderColor} ${tool.bgHover} group relative overflow-hidden`}
              >
                {/* Subtle Background Glow on Hover */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-current opacity-0 group-hover:opacity-5 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-white shadow-sm border border-slate-100 ${tool.color}`}
                  >
                    {tool.icon}
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-800 transition-colors shadow-sm">
                    <ChevronRight size={16} />
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-lg mb-1.5 group-hover:text-slate-900">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {tool.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
