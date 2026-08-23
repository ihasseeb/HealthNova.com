import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetPaymentHistory,
  useGetMySubscription,
  useSubscribe,
} from "../../hooks/usePayment";

const PaymentHistory = () => {
  const { data: historyData, isLoading: loadingHistory } =
    useGetPaymentHistory();
  const { data: subData, isLoading: loadingSub } = useGetMySubscription();
  const subscribeMutation = useSubscribe();

  const payments = historyData?.data?.payments || [];
  const subscription = subData?.data?.subscription;

  const handleUpgrade = (plan: "PRO" | "PREMIUM") => {
    subscribeMutation.mutate({ plan });
  };

  if (loadingHistory || loadingSub) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">💳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              💳 Billing & Subscriptions
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Manage active plans and view transaction receipts
            </p>
          </div>
        </div>

        {/* Current Active Plan Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-bold">
              💎
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">
                Current Plan
              </p>
              <h2 className="text-xl font-bold text-slate-800">
                {subscription?.plan || "FREE"} Tier
              </h2>
              <p className="text-xs text-emerald-600 font-medium">
                Status: {subscription?.status || "ACTIVE"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {subscription?.plan !== "PRO" && (
              <Button
                onClick={() => handleUpgrade("PRO")}
                disabled={subscribeMutation.isPending}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-xs"
              >
                Upgrade to PRO ($9.99/mo)
              </Button>
            )}
            {subscription?.plan !== "PREMIUM" && (
              <Button
                onClick={() => handleUpgrade("PREMIUM")}
                disabled={subscribeMutation.isPending}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-90 text-xs"
              >
                Go Premium ($19.99/mo)
              </Button>
            )}
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            📜 Transaction Receipts
          </h2>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No payments processed yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-xs">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((pmt: any) => (
                    <tr key={pmt.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-semibold text-slate-800">
                        {pmt.description || "Medical Consultation"}
                      </td>
                      <td className="p-3 font-bold text-emerald-600">
                        ${pmt.amount} {pmt.currency.toUpperCase()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            pmt.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : pmt.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {pmt.status}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-slate-500">
                        {new Date(pmt.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentHistory;
