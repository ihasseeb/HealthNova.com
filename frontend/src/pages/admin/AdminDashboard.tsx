import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetDashboardStats,
  useGetPendingDoctors,
  useVerifyDoctor,
} from "../../hooks/useAdmin";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">🛡️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header & Tabs */}
        <div className="bg-slate-900 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
              <span>🛡️</span> Admin Command Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Platform analytics and user management
            </p>
          </div>

          <div className="flex bg-white/10 p-1 rounded-xl gap-1 relative z-10">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "overview"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300"
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab("verifications")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition relative ${
                activeTab === "verifications"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-300"
              }`}
            >
              👨‍⚕️ Verifications
              {pendingDoctors.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-3xl font-bold text-slate-800">
                  {stats.totalUsers}
                </p>
                <p className="text-xs text-slate-500 font-semibold uppercase mt-1">
                  Total Users
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-2">👨‍⚕️</div>
                <p className="text-3xl font-bold text-teal-600">
                  {stats.totalDoctors}
                </p>
                <p className="text-xs text-slate-500 font-semibold uppercase mt-1">
                  Registered Doctors
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalAppointments}
                </p>
                <p className="text-xs text-slate-500 font-semibold uppercase mt-1">
                  Appointments
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-2">💰</div>
                <p className="text-3xl font-bold text-emerald-600">
                  ${stats.totalRevenue}
                </p>
                <p className="text-xs text-slate-500 font-semibold uppercase mt-1">
                  Platform Revenue
                </p>
              </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Latest Registered Users
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-xs">
                    <tr>
                      <th className="p-3 rounded-l-lg">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 rounded-r-lg">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">
                          {user.name}
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : user.role === "DOCTOR"
                                  ? "bg-teal-100 text-teal-700"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Doctor Verifications */}
        {activeTab === "verifications" && (
          <div className="space-y-4">
            {pendingDoctors.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-slate-800">
                  All Caught Up!
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  There are no pending doctor verifications at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingDoctors.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">
                          {doc.user.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {doc.user.email}
                        </p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded">
                        PENDING VERIFICATION
                      </span>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl text-sm space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Specialization:</span>
                        <span className="font-semibold text-slate-800">
                          {doc.specialization}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">License No:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {doc.licenseNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Experience:</span>
                        <span className="font-semibold text-slate-800">
                          {doc.experience} Years
                        </span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-200">
                        <span className="text-slate-500 block mb-1">
                          Qualifications:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {doc.qualifications.map((q: string, i: number) => (
                            <span
                              key={i}
                              className="bg-white border border-slate-200 px-2 py-0.5 rounded text-xs text-slate-600"
                            >
                              {q}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => verifyMutation.mutate(doc.id)}
                      disabled={verifyMutation.isPending}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      {verifyMutation.isPending
                        ? "Verifying..."
                        : "✅ Approve & Verify Credentials"}
                    </Button>
                  </div>
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
