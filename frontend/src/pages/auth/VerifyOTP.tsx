import { Button } from "../../components/ui/button";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useVerifyOTP, useResendOTP } from "../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResending } = useResendOTP();

  useEffect(() => {
    if (!email) {
      toast.error("Please signup first");
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
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
    if (otpString.length !== 6) return toast.error("Please enter all 6 digits");
    verifyOTP({ email, otp: otpString });
  };

  const handleResend = () => {
    resendOTP({ email });
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100 text-primary-600">
          <MailCheck size={32} strokeWidth={2} />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Check your email
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          We sent a verification code to
        </p>
        <p className="text-slate-900 font-bold text-sm break-all px-2">
          {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div
          className="flex justify-center gap-2 sm:gap-3 px-2"
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
              className="w-11 h-14 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-xl sm:text-2xl md:text-3xl font-bold border-2 border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all bg-slate-50/50 focus:bg-white text-slate-900"
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={isVerifying}
          className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
        >
          {isVerifying ? "Verifying..." : "Verify Account"}
        </Button>
      </form>

      <div className="text-center space-y-4">
        <div className="text-sm font-medium text-slate-500">
          Didn't receive the code?{" "}
          {timer > 0 ? (
            <span className="font-bold text-slate-400">Resend in {timer}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-primary-600 hover:text-primary-700 font-bold transition-colors"
            >
              {isResending ? "Sending..." : "Click to resend"}
            </button>
          )}
        </div>

        <Link
          to="/signup"
          className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          ← Back to signup
        </Link>
      </div>
    </div>
  );
};

export default VerifyOTP;
