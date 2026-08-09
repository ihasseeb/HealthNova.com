import { Button } from "../../components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useVerifyOTP, useResendOTP } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResending } = useResendOTP();

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("Please signup first");
      navigate("/signup");
    }
  }, [email, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    verifyOTP({ email, otp: otpString });
  };

  const handleResend = () => {
    resendOTP({ email });
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full"
    >
      {/* Icon */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 text-3xl"
        >
          🔐
        </motion.div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Verify Your Email
        </h1>
        <p className="text-slate-500 text-sm">We've sent a 6-digit code to</p>
        <p className="text-emerald-600 font-semibold text-sm break-all px-2">
          {email}
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Boxes - Fixed Sizing */}
        <div
          className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 px-2"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-14 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-xl sm:text-2xl md:text-3xl font-bold border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition bg-white"
            />
          ))}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isVerifying}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:opacity-90 h-12 text-base font-semibold shadow-lg shadow-emerald-200"
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </Button>
      </form>

      {/* Resend */}
      <div className="text-center space-y-2">
        <p className="text-sm text-slate-500">Didn't receive the code?</p>
        {timer > 0 ? (
          <p className="text-sm text-slate-400">
            Resend in{" "}
            <span className="font-bold text-emerald-600">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold text-sm"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </div>

      {/* Back to Signup */}
      <p className="text-center text-sm text-slate-500">
        Wrong email?{" "}
        <Link
          to="/signup"
          className="text-emerald-600 hover:text-emerald-700 hover:underline font-semibold"
        >
          Go back
        </Link>
      </p>
    </motion.div>
  );
};

export default VerifyOTP;
