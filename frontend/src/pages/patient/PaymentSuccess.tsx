import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Invalidate queries so subscription status & appointments update immediately
    queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
    queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
    queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center space-y-6 border border-emerald-100"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto">
          ✅
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Payment Successful!
          </h1>
          <p className="text-slate-500 text-sm">
            Thank you for your payment. Your transaction has been completed
            securely via Stripe.
          </p>
          {sessionId && (
            <p className="text-[10px] text-slate-400 font-mono break-all pt-2">
              Ref: {sessionId}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 h-12"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => navigate("/payment/history")}
            variant="outline"
            className="w-full h-12 border-slate-200"
          >
            View Payment History
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
