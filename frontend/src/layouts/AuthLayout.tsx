import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Stethoscope, HeartPulse, Brain, Salad } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-40 -right-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-12 px-8 lg:px-16 py-12 max-w-7xl mx-auto">
        {/* Left Side - Content */}
        <div className="space-y-8 flex flex-col justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-emerald-200 w-fit">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-emerald-700">
              Trusted by 50,000+ Users
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              Your Health,
            </h2>
            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-lg max-w-md leading-relaxed">
            Experience the future of healthcare with personalized AI-driven
            insights, expert consultations, and 24/7 support.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100 transition-all hover:-translate-y-1">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-emerald-200">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                AI Symptom Check
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Smart health analysis instantly
              </p>
            </div>

            <div className="p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-teal-100 hover:shadow-xl hover:shadow-teal-100 transition-all hover:-translate-y-1">
              <div className="w-11 h-11 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-teal-200">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Expert Doctors
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Consult certified professionals
              </p>
            </div>

            <div className="p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-cyan-100 hover:shadow-xl hover:shadow-cyan-100 transition-all hover:-translate-y-1">
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-cyan-200">
                <Salad className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Diet Plans</h3>
              <p className="text-xs text-slate-500 mt-1">
                Personalized nutrition guide
              </p>
            </div>

            <div className="p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100 transition-all hover:-translate-y-1">
              <div className="w-11 h-11 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-rose-200">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Health Tracking
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Monitor your wellness daily
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-100 p-8 border border-white">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
