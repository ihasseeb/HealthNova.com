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
import { useEffect } from "react";
import { toast } from "sonner";
import { Lock, ShieldCheck, ArrowLeft, ShieldAlert } from "lucide-react";

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

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired reset link");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) return;
    mutate({ token, newPassword: data.newPassword });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100 text-primary-600">
          <ShieldAlert size={32} strokeWidth={2} />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Set new password
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Your new password must be different to previously used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus-visible:ring-primary-500 font-medium"
              {...register("newPassword")}
            />
          </div>
          {errors.newPassword && (
            <p className="text-xs text-red-500 font-medium">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Confirm Password
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
            <p className="text-xs text-red-500 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Password Rules */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs font-bold text-slate-700 mb-2">
            Password must contain:
          </p>
          <ul className="text-xs text-slate-500 font-medium space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400"></span>At
              least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400"></span>One
              uppercase & lowercase letter
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400"></span>One
              number
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to log in
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
