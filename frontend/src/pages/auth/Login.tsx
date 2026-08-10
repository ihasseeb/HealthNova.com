import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../schemas/authSchemas";
import { useLogin } from "../../hooks/useAuth";

const Login = () => {
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 rotate-3 hover:rotate-6 transition text-3xl">
          🔐
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
        <p className="text-slate-500 text-sm">
          Sign in to continue your health journey.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-slate-400">OR</span>
          </div>
        </div>

        {/* Google Login Button */}
        <a
          href={`${import.meta.env.VITE_API_URL}/auth/google`}
          className="w-full flex items-center justify-center gap-3 h-12 border-2 border-slate-200 rounded-lg hover:bg-slate-50 transition font-semibold text-slate-700"
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
          Continue with Google
        </a>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password" className="text-slate-700 font-medium">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-90 h-12 text-base font-semibold shadow-lg shadow-emerald-200"
        >
          {isPending ? "Signing in..." : "Sign In"}
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

      {/* Signup Link */}
      <p className="text-center text-sm text-slate-500">
        New to HealthNova?{" "}
        <Link
          to="/signup"
          className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
