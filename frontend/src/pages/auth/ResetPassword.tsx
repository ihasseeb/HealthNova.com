import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../schemas/authSchemas";
import { useResetPassword } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { mutate, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Check token exists
  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;
    mutate({ token, newPassword: data.newPassword });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Icon */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 text-3xl"
        >
          🔑
        </motion.div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Reset Password</h1>
        <p className="text-slate-500 text-sm">Enter your new password below</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-slate-700 font-medium">
            New Password
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
              🔒
            </span>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              className="pl-10 h-11 border-slate-200 focus-visible:ring-emerald-500"
              {...register("newPassword")}
            />
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-slate-700 font-medium"
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
              ✅
            </span>
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

        {/* Password Requirements */}
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Password must contain:
          </p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>✓ At least 8 characters</li>
            <li>✓ One uppercase letter</li>
            <li>✓ One lowercase letter</li>
            <li>✓ One number</li>
          </ul>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-90 h-12 text-base font-semibold shadow-lg shadow-emerald-200"
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      {/* Back to Login */}
      <p className="text-center text-sm text-slate-500">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold"
        >
          Back to Login
        </Link>
      </p>
    </motion.div>
  );
};

export default ResetPassword;
