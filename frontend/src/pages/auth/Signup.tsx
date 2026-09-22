import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "../../schemas/authSchemas";
import { useSignup } from "../../hooks/useAuth";
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
    defaultValues: { role: "PATIENT" },
  });

  const handleRoleChange = (selectedRole: "PATIENT" | "DOCTOR") => {
    setRole(selectedRole);
    setValue("role", selectedRole);
  };

  const onSubmit = (data: SignupFormData) => mutate(data);

  return (
    <div className="space-y-7">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Account
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Join HealthNova as a {role === "PATIENT" ? "Patient" : "Doctor"}
        </p>
      </div>

      <div className="relative flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
        <div
          className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-slate-200/50 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${role === "DOCTOR" ? "translate-x-full" : "translate-x-0"}`}
        />
        <button
          type="button"
          onClick={() => handleRoleChange("PATIENT")}
          className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${role === "PATIENT" ? "text-primary-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          <UserPlus size={16} /> Patient
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("DOCTOR")}
          className={`relative z-10 flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 ${role === "DOCTOR" ? "text-accent-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Stethoscope size={16} /> Doctor
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Full Name {role === "DOCTOR" && "(with Title)"}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder={role === "DOCTOR" ? "Dr. John Doe" : "John Doe"}
              className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-primary-500 font-medium"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="email"
              placeholder="name@example.com"
              className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-primary-500 font-medium"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-primary-500 font-medium"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 font-medium leading-tight">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Confirm
            </Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-primary-500 font-medium"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-500 font-medium leading-tight">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className={`w-full h-12 rounded-xl text-white font-bold text-base shadow-lg transition-all mt-2 active:scale-[0.98] ${
            role === "DOCTOR"
              ? "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
              : "bg-primary-600 hover:bg-primary-700 shadow-primary-600/20"
          }`}
        >
          {isPending
            ? "Creating Account..."
            : `Join as ${role === "PATIENT" ? "Patient" : "Doctor"}`}
        </Button>
      </form>

      <div className="flex items-center gap-4 text-sm text-slate-300">
        <div className="flex-1 border-t border-slate-200"></div>
        <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">
          or
        </span>
        <div className="flex-1 border-t border-slate-200"></div>
      </div>

      <a
        href={`${import.meta.env.VITE_API_URL}/auth/google`}
        className="w-full flex items-center justify-center gap-3 h-12 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-700 shadow-sm active:scale-[0.98]"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </a>

      <p className="text-center text-sm text-slate-500 font-medium">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 font-bold transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
