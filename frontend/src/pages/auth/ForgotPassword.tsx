import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../schemas/authSchemas";
import { useForgotPassword } from "../../hooks/useAuth";
import { useState } from "react";
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data, { onSuccess: () => setIsSubmitted(true) });
  };

  return (
    <div className="space-y-8">
      {!isSubmitted ? (
        <>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100 text-primary-600">
              <KeyRound size={32} strokeWidth={2} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
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

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
            >
              {isPending ? "Sending..." : "Reset Password"}
            </Button>
          </form>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to log in
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Check your email
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              We sent a password reset link to
            </p>
            <p className="text-slate-900 font-bold text-sm">
              {getValues("email")}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Didn't receive the email? Check your spam filter, or{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-primary-600 font-bold hover:underline"
              >
                try another email address
              </button>
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to log in
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
