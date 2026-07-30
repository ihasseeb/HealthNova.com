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
import { motion } from "framer-motion";
import { useState } from "react";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data, {
      onSuccess: () => setIsSubmitted(true),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {!isSubmitted ? (
        <>
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
            <h1 className="text-3xl font-bold text-slate-800">
              Forgot Password?
            </h1>
            <p className="text-slate-500 text-sm">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                  📧
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10 h-11 border-slate-200 focus-visible:ring-emerald-500"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-90 h-12 text-base font-semibold shadow-lg shadow-emerald-200"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
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
        </>
      ) : (
        <>
          {/* Success State */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-4xl shadow-xl shadow-emerald-200">
              ✅
            </div>
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">
              Check Your Email!
            </h1>
            <p className="text-slate-500 text-sm">
              We've sent a password reset link to
            </p>
            <p className="text-emerald-600 font-semibold">
              {getValues("email")}
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-slate-600 text-center">
              💡 Didn't receive it? Check your spam folder or try again in a few
              minutes.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full h-11 border-emerald-200 hover:bg-emerald-50"
            >
              Try Another Email
            </Button>
            <Link to="/login" className="block">
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 h-11">
                Back to Login
              </Button>
            </Link>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ForgotPassword;
