import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useGetDoctorProfile } from "../../hooks/useDoctor";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetDoctorProfile();
  const doctor = data?.data?.profile;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">👨‍⚕️</div>
      </div>
    );
  }

  // If doctor hasn't set up their profile yet
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md space-y-4">
          <div className="text-6xl">🩺</div>
          <h2 className="text-2xl font-bold text-slate-800">
            Complete Your Doctor Profile
          </h2>
          <p className="text-slate-600 text-sm">
            Before accepting patient appointments, please fill out your
            qualifications and medical license.
          </p>
          <Button
            onClick={() => navigate("/doctor/profile-setup")}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Set Up Doctor Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Verification Alert if Pending */}
        {!doctor.isVerified && (
          <div className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-xl text-amber-800 text-sm flex justify-between items-center">
            <span>
              ⏳ <strong>Account Pending Verification:</strong> Your medical
              credentials are under review by Admin.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/doctor/profile-setup")}
              className="border-amber-500 text-amber-800"
            >
              Edit Credentials
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Welcome, Dr. {doctor.user?.name || "Doctor"}! 👨‍⚕️
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Specialization: {doctor.specialization} •{" "}
              {doctor.hospital || "Private Practice"}
            </p>
          </div>
          <Button
            onClick={() => navigate("/doctor/profile-setup")}
            className="bg-white text-emerald-600 hover:bg-slate-50 text-sm"
          >
            ⚙️ Edit Profile
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow border border-emerald-100 text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {doctor.experience} Yrs
            </p>
            <p className="text-xs text-slate-500 mt-1">Experience</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow border border-emerald-100 text-center">
            <p className="text-3xl font-bold text-teal-600">
              ${doctor.consultationFee}
            </p>
            <p className="text-xs text-slate-500 mt-1">Fee per Visit</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow border border-emerald-100 text-center">
            <p className="text-3xl font-bold text-cyan-600">
              ⭐ {doctor.averageRating}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Rating ({doctor.totalReviews} Reviews)
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow border border-emerald-100 text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {doctor.isVerified ? "Verified" : "Pending"}
            </p>
            <p className="text-xs text-slate-500 mt-1">License Status</p>
          </div>
        </div>

        {/* Quick Management Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/doctor/appointments")}
            className="bg-white p-6 rounded-2xl shadow border border-emerald-100 hover:border-emerald-500 cursor-pointer transition"
          >
            <div className="text-4xl mb-2">📅</div>
            <h3 className="font-bold text-slate-800">Manage Appointments</h3>
            <p className="text-xs text-slate-500 mt-1">
              View pending patient visits & set time slots
            </p>
          </div>

          <div
            onClick={() => navigate("/doctor/prescriptions")}
            className="bg-white p-6 rounded-2xl shadow border border-emerald-100 hover:border-emerald-500 cursor-pointer transition"
          >
            <div className="text-4xl mb-2">📋</div>
            <h3 className="font-bold text-slate-800">Prescriptions</h3>
            <p className="text-xs text-slate-500 mt-1">
              Issue digital prescriptions to patients
            </p>
          </div>

          <div
            onClick={() => navigate("/chat")}
            className="bg-white p-6 rounded-2xl shadow border border-emerald-100 hover:border-emerald-500 cursor-pointer transition"
          >
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-bold text-slate-800">Patient Messages</h3>
            <p className="text-xs text-slate-500 mt-1">
              Chat directly with booked patients
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;
