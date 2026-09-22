import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetDashboardStats,
  useGetPendingDoctors,
  useVerifyDoctor,
} from "../../hooks/useAdmin";
import {
  Users,
  UserCheck,
  CalendarDays,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "verifications">(
    "overview",
  );

  const { data: statsData, isLoading: loadingStats } = useGetDashboardStats();
  const { data: pendingData, isLoading: loadingDocs } = useGetPendingDoctors();
  const verifyMutation = useVerifyDoctor();

  const stats = statsData?.data?.stats;
  const recentUsers = statsData?.data?.recentUsers || [];
  const pendingDoctors = pendingData?.data?.doctors || [];

  if (loadingStats || loadingDocs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header & Tabs (Modern Control Panel Style) */}
        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-4">
              <ShieldCheck size={14} className="text-primary-400" />
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Admin Control Center
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Platform Overview
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Monitor system health, user analytics, and manage verifications.
            </p>
          </div>

          <div className="flex bg-slate-800/50 p-1.5 rounded-full border border-slate-700/50 shadow-inner w-full md:w-auto relative z-10">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("verifications")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 relative ${
                activeTab === "verifications"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Verifications
              {pendingDoctors.length > 0 && (
                <span
                  className={`absolute -top-1 -right-1 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse ${activeTab === "verifications" ? "bg-primary-600" : "bg-red-500"}`}
                >
                  {pendingDoctors.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1: Platform Overview */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  icon: <Users size={24} />,
                  value: stats.totalUsers,
                  label: "Total Users",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: <UserCheck size={24} />,
                  value: stats.totalDoctors,
                  label: "Verified Doctors",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  icon: <CalendarDays size={24} />,
                  value: stats.totalAppointments,
                  label: "Appointments",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  icon: <DollarSign size={24} />,
                  value: `$${stats.totalRevenue}`,
                  label: "Total Revenue",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
              ].map((stat, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-200/60 hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Users Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Registrations
                </h2>
                <Button
                  variant="ghost"
                  className="text-primary-600 text-sm font-semibold hover:bg-primary-50"
                >
                  View All <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    <tr>
                      <th className="p-4 rounded-l-xl">User Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Account Type</th>
                      <th className="p-4 rounded-r-xl">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentUsers.map((user: any) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4 font-semibold text-slate-900">
                          {user.name}
                        </td>
                        <td className="p-4 font-medium text-slate-600">
                          {user.email}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                              user.role === "ADMIN"
                                ? "bg-slate-900 text-white"
                                : user.role === "DOCTOR"
                                  ? "bg-primary-50 text-primary-700 border border-primary-100"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            { dateStyle: "medium" },
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tab 2: Doctor Verifications */}
        {activeTab === "verifications" && (
          <div className="space-y-6">
            {pendingDoctors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-slate-200/60 max-w-2xl mx-auto mt-10"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Queue is Empty
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  There are no pending doctor verifications at the moment. Great
                  job keeping up!
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingDoctors.map((doc: any, i: number) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[2rem] p-8 shadow-sm border border-amber-200/60 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />

                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-bold text-xl text-slate-900">
                            {doc.user.name}
                          </h3>
                          <p className="text-sm font-medium text-slate-500 mt-1">
                            {doc.user.email}
                          </p>
                        </div>
                        <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                          Review Needed
                        </span>
                      </div>

                      <div className="bg-slate-50 p-5 rounded-2xl text-sm space-y-3 mb-6 border border-slate-100">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                          <span className="text-slate-500 font-medium">
                            Specialization
                          </span>
                          <span className="font-bold text-slate-900">
                            {doc.specialization}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                          <span className="text-slate-500 font-medium">
                            License No
                          </span>
                          <span className="font-mono font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            {doc.licenseNumber}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                          <span className="text-slate-500 font-medium">
                            Experience
                          </span>
                          <span className="font-bold text-slate-900">
                            {doc.experience} Years
                          </span>
                        </div>
                        <div className="pt-2">
                          <span className="text-slate-500 font-medium block mb-2">
                            Qualifications
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(doc.qualifications) &&
                            doc.qualifications.length > 0 ? (
                              doc.qualifications.map((q: string, j: number) => (
                                <span
                                  key={j}
                                  className="bg-white border border-slate-200 shadow-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-700"
                                >
                                  {q}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">
                                Not provided
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      <Button
                        onClick={() => verifyMutation.mutate(doc.id)}
                        disabled={verifyMutation.isPending}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-xl"
                      >
                        {verifyMutation.isPending
                          ? "Processing..."
                          : "Approve & Verify"}
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      >
                        Reject
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
