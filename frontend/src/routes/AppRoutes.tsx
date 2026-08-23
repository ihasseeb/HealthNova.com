import { Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/auth/HomePage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ResetPassword from "../pages/auth/ResetPassword";
import HealthProfile from "../pages/HealthProfile";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import SymptomChecker from "../pages/ai/SymptomChecker";
import DietPlan from "../pages/ai/DietPlan";
import WorkoutPlan from "../pages/ai/WorkoutPlan";
import Chat from "../pages/ai/Chat";
import ReportAnalyzer from "../pages/ai/ReportAnalyzer";
import HealthTips from "../pages/ai/HealthTips";
import Doctors from "../pages/Doctor";
import Pricing from "../pages/Pricing";
import GoogleSuccess from "../pages/auth/GoogleSuccess";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorProfileSetup from "../pages/doctor/DoctorProfileSetup";
import PatientAppointments from "../pages/patient/PatientAppointments";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import CreatePrescription from "../pages/doctor/CreatePrescription";
import PatientPrescriptions from "../pages/patient/PatientPrescription";
import DoctorPatientChat from "../pages/chat/DoctorPatientChat";
import PaymentHistory from "../pages/patient/PaymentHistory";
import PaymentSuccess from "../pages/patient/PaymentSuccess";
import PaymentCancel from "../pages/patient/PaymentCancel";
import AdminDashboard from "../pages/admin/AdminDashboard";
import NotificationsPage from "../pages/NotificationBell";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/doctor-chat" element={<DoctorPatientChat />} />
        <Route element={<MainLayout />}>
          <Route path="/payment/history" element={<PaymentHistory />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          {/* General User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/health-profile" element={<HealthProfile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Patient Appointments */}
          <Route path="/appointments" element={<PatientAppointments />} />
          <Route path="/prescriptions" element={<PatientPrescriptions />} />
          {/* AI Features */}
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/diet-plan" element={<DietPlan />} />
          <Route path="/workout-plan" element={<WorkoutPlan />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/report-analyzer" element={<ReportAnalyzer />} />
          <Route path="/health-tips" element={<HealthTips />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route
            path="/doctor/create-prescription"
            element={<CreatePrescription />}
          />

          <Route
            path="/doctor/profile-setup"
            element={<DoctorProfileSetup />}
          />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
