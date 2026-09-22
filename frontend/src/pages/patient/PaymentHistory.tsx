import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetPaymentHistory,
  useGetMySubscription,
  useSubscribe,
} from "../../hooks/usePayment";
import { CreditCard, Sparkles, Check, ArrowRight } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100">
              <CreditCard size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Billing & Subscriptions
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Manage your membership plans and view payment receipts
              </p>
            </div>
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Tier
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {subscription?.plan || "FREE"} Plan
            </h2>
            <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Status: {subscription?.status || "ACTIVE"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-10">
            {subscription?.plan !== "PRO" && (
              <Button
                onClick={() => handleUpgrade("PRO")}
                disabled={subscribeMutation.isPending}
                className="bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl h-12 px-6 shadow-md"
              >
                Upgrade Pro ($9.99/mo)
              </Button>
            )}
            {subscription?.plan !== "PREMIUM" && (
              <Button
                onClick={() => handleUpgrade("PREMIUM")}
                disabled={subscribeMutation.isPending}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl h-12 px-6 shadow-md shadow-primary-600/20"
              >
                Go Premium ($19.99/mo)
              </Button>
            )}
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Transaction Receipts
          </h2>

          {payments.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm font-medium">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                  <tr>
                    <th className="p-4 rounded-l-xl">Description</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 rounded-r-xl">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pmt: any) => (
                    <tr
                      key={pmt.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-bold text-slate-800">
                        {pmt.description || "Medical Consultation"}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">
                        ${pmt.amount} {pmt.currency.toUpperCase()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            pmt.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700"
                              : pmt.status === "FAILED"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {pmt.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-500">
                        {new Date(pmt.createdAt).toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
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
