import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "../../schemas/authSchemas";
import { useSignup } from "../../hooks/useAuth";

const Signup = () => {
  const { mutate, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 rotate-3 hover:rotate-6 transition text-3xl">
          🚀
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
        <p className="text-slate-500 text-sm">
          Join HealthNova and take control of your health.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 font-medium">
            Full Name
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
              👤
            </span>
            <Input
              id="name"
              placeholder="John Doe"
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                🔒
              </span>
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
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-90 h-12 text-base font-semibold shadow-lg shadow-emerald-200"
        >
          {isPending ? "Creating Account..." : "Create My Account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-slate-400">OR</span>
        </div>
      </div>

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
