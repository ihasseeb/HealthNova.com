import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center space-y-6 border border-red-100"
      >
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-5xl mx-auto">
          ❌
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Payment Cancelled
          </h1>
          <p className="text-slate-500 text-sm">
            You cancelled the payment process. No funds were charged from your
            account.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            onClick={() => navigate("/pricing")}
            className="w-full bg-slate-800 hover:bg-slate-900 h-12"
          >
            Return to Pricing
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="w-full h-12"
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
