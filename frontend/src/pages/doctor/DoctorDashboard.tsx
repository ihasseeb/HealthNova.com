import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetDoctorProfile } from "../../hooks/useDoctor";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  MessageSquare,
  AlertCircle,
  Award,
  Clock,
  Activity,
} from "lucide-react";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useGetDoctorProfile();
  const doctor = data?.data?.profile;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200/60 text-center max-w-md space-y-4"
        >
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Profile
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Before accepting patient appointments, please set up your medical
            credentials.
          </p>
          <Button
            onClick={() => navigate("/doctor/profile-setup")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 mt-4"
          >
            Setup Doctor Profile
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {!doctor.isVerified && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-[1.5rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-600" size={24} />
              <div>
                <p className="font-bold text-amber-900 text-sm">
                  Account Pending Verification
                </p>
                <p className="text-amber-700 text-xs mt-0.5 font-medium">
                  Admin is reviewing your medical credentials.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/doctor/profile-setup")}
              className="border-amber-300 text-amber-800 hover:bg-amber-100 rounded-xl"
            >
              Edit Credentials
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, Dr. {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {doctor.specialization} •{" "}
                {doctor.hospital || "Private Practice"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/doctor/profile-setup")}
            variant="outline"
            className="rounded-xl border-slate-200 font-semibold"
          >
            Edit Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Clock size={20} />,
              label: "Experience",
              value: `${doctor.experience} Yrs`,
              color: "text-blue-600",
            },
            {
              icon: <Activity size={20} />,
              label: "Consult Fee",
              value: `$${doctor.consultationFee}`,
              color: "text-emerald-600",
            },
            {
              icon: <Award size={20} />,
              label: "Rating",
              value: doctor.averageRating,
              sub: `(${doctor.totalReviews} reviews)`,
              color: "text-amber-500",
            },
            {
              icon: <AlertCircle size={20} />,
              label: "Status",
              value: doctor.isVerified ? "Verified" : "Pending",
              color: doctor.isVerified ? "text-primary-600" : "text-amber-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-200/60 hover:border-primary-200 transition-colors group"
            >
              <div className={`mb-3 ${stat.color}`}>{stat.icon}</div>
              <p className="text-2xl font-extrabold text-slate-900">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                {stat.label}{" "}
                {stat.sub && (
                  <span className="normal-case text-slate-400">{stat.sub}</span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Management */}
        <h2 className="text-lg font-bold text-slate-900 pt-4 px-2">
          Clinical Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <CalendarDays size={28} />,
              title: "Appointments",
              desc: "Manage patient visits & schedule",
              path: "/doctor/appointments",
            },
            {
              icon: <FileText size={28} />,
              title: "Prescriptions",
              desc: "Issue & view digital prescriptions",
              path: "/doctor/prescriptions",
            },
            {
              icon: <MessageSquare size={28} />,
              title: "Patient Messages",
              desc: "Direct chat with your patients",
              path: "/chat",
            },
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-200/60 hover:shadow-md hover:border-primary-300 cursor-pointer transition-all group"
            >
              <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;
