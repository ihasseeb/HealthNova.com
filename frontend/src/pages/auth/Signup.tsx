import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "../../schemas/authSchemas";
import { useSignup } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ShieldCheck,
  UserPlus,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";

const Signup = () => {
  const { mutate, isPending } = useSignup();
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "PATIENT",
    },
  });

  // Handle Role Change
  const handleRoleChange = (selectedRole: "PATIENT" | "DOCTOR") => {
    setRole(selectedRole);
    setValue("role", selectedRole);
  };

  const onSubmit = (data: SignupFormData) => {
    mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Icon based on Role */}
      <div className="flex justify-center">
        <motion.div
          key={role}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl rotate-3 hover:rotate-6 transition text-white ${
            role === "DOCTOR"
              ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-blue-200"
              : "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-emerald-200"
          }`}
        >
          {role === "DOCTOR" ? (
            <Stethoscope className="w-8 h-8" />
          ) : (
            <UserPlus className="w-8 h-8" />
          )}
        </motion.div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="text-slate-500 text-sm">
          Join HealthNova as a {role === "PATIENT" ? "Patient" : "Doctor"}
        </p>
      </div>

      {/* Role Decider Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => handleRoleChange("PATIENT")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            role === "PATIENT"
              ? "bg-white text-emerald-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          👨‍👩‍👧‍👦 I'm a Patient
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("DOCTOR")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            role === "DOCTOR"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          👨‍⚕️ I'm a Doctor
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 font-medium">
            Full Name {role === "DOCTOR" && "(with Title)"}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="name"
              placeholder={role === "DOCTOR" ? "Dr. John Doe" : "John Doe"}
              className="pl-10 h-11 border-slate-200 focus-visible:ring-emerald-500"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="pl-10 h-11 border-slate-200 focus-visible:ring-emerald-500"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-11 border-slate-200 focus-visible:ring-emerald-500"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-slate-700 font-medium"
            >
              Confirm
            </Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-11 border-slate-200 focus-visible:ring-emerald-500"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className={`w-full h-12 text-base font-semibold shadow-lg text-white ${
            role === "DOCTOR"
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 shadow-blue-200"
              : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-90 shadow-emerald-200"
          }`}
        >
          {isPending
            ? "Creating Account..."
            : `Join as ${role === "PATIENT" ? "Patient" : "Doctor"}`}
        </Button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default Signup;
