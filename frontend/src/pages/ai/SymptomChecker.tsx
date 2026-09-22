import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useSymptomCheck, useSymptomHistory } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";
import {
  Activity,
  Clock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  AlertOctagon,
} from "lucide-react";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const { mutate: checkSymptoms, isPending, data: result } = useSymptomCheck();
  const { data: historyData } = useSymptomHistory();

  const history = historyData?.data?.history || [];
  const analysis = result?.data;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim().length < 10) return;
    checkSymptoms({ symptoms, duration });
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "LOW":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: <CheckCircle2 className="text-emerald-600" size={32} />,
        };
      case "MODERATE":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: <AlertTriangle className="text-amber-600" size={32} />,
        };
      case "HIGH":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: <AlertOctagon className="text-orange-600" size={32} />,
        };
      case "EMERGENCY":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: <Activity className="text-red-600 animate-pulse" size={32} />,
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: <Stethoscope className="text-slate-600" size={32} />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Modern Clean Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100">
              <Stethoscope size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                AI Symptom Check
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Describe how you feel, get clinical insights
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="outline"
            className="w-full md:w-auto rounded-xl font-semibold border-slate-200 text-slate-700"
          >
            {showHistory ? "← New Analysis" : "View History"}
          </Button>
        </div>

        {!showHistory ? (
          <>
            {isPending && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60 mt-6">
                <AILoadingScreen
                  emoji="🔬"
                  title="Analyzing Clinical Data..."
                  description="Cross-referencing your symptoms with medical databases."
                  steps={[
                    { icon: "📝", text: "Parsing symptom description" },
                    { icon: "🧠", text: "Running diagnostic AI models" },
                    { icon: "📊", text: "Generating actionable insights" },
                  ]}
                />
              </div>
            )}

            {!isPending && !analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      What are your symptoms?{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="E.g., I've had a throbbing headache and a mild fever (101°F) since yesterday morning..."
                      className="w-full min-h-[160px] p-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none resize-none text-base"
                      required
                      minLength={10}
                    />
                    <p className="text-xs text-slate-400 font-medium">
                      Please provide as much detail as possible (min 10 chars).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" /> Duration
                      (Optional)
                    </Label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full h-12 px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none text-sm font-medium"
                    >
                      <option value="">Select duration</option>
                      <option value="Less than 24 hours">
                        Less than 24 hours
                      </option>
                      <option value="1-3 days">1 to 3 days</option>
                      <option value="1 week">About a week</option>
                      <option value="More than a week">More than a week</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={symptoms.trim().length < 10}
                    className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg"
                  >
                    Analyze Symptoms
                  </Button>
                </form>
              </motion.div>
            )}

            <AnimatePresence>
              {analysis && !isPending && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Severity Banner */}
                  <div
                    className={`p-6 rounded-[2rem] border-2 flex items-center gap-5 ${getSeverityStyles(analysis.severity).bg} ${getSeverityStyles(analysis.severity).border}`}
                  >
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      {getSeverityStyles(analysis.severity).icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Assessed Severity
                      </p>
                      <p
                        className={`text-2xl font-extrabold tracking-tight ${getSeverityStyles(analysis.severity).text}`}
                      >
                        {analysis.severity}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Causes */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60 h-full">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-primary-600" />{" "}
                        Possible Causes
                      </h3>
                      <ul className="space-y-3">
                        {analysis.possibleCauses?.map(
                          (cause: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100"
                            >
                              <span className="text-primary-500 font-bold mt-0.5">
                                •
                              </span>{" "}
                              {cause}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60 h-full">
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-emerald-600" />{" "}
                        Actionable Advice
                      </h3>
                      <ul className="space-y-3">
                        {analysis.recommendations?.map(
                          (rec: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm font-medium text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50"
                            >
                              <CheckCircle2
                                size={16}
                                className="text-emerald-500 shrink-0 mt-0.5"
                              />{" "}
                              {rec}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Warning Signs */}
                  {(analysis.warningSignsToWatch?.length > 0 ||
                    analysis.whenToSeeDoctor) && (
                    <div className="bg-red-50 rounded-[2rem] p-6 border border-red-100">
                      <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                        <AlertOctagon size={20} /> Critical Warnings
                      </h3>
                      <div className="space-y-4">
                        {analysis.warningSignsToWatch?.length > 0 && (
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {analysis.warningSignsToWatch.map(
                              (sign: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm text-red-700 bg-white/60 p-3 rounded-xl"
                                >
                                  <span className="font-bold shrink-0">⚠</span>{" "}
                                  {sign}
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                        {analysis.whenToSeeDoctor && (
                          <div className="mt-4 p-4 bg-white/80 rounded-xl text-sm font-medium text-red-800 border border-red-200/50">
                            <strong>Seek Medical Attention If:</strong>{" "}
                            {analysis.whenToSeeDoctor}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-center pt-2 pb-6">
                    <p className="text-xs text-slate-400 font-medium max-w-md mx-auto">
                      Disclaimer: This AI-generated insight is for informational
                      purposes only and does not replace professional medical
                      diagnosis.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* History View (Minimalist) */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {history.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-200/60">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  No History Found
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Your previous symptom checks will appear here.
                </p>
              </div>
            ) : (
              history.map((check: any) => (
                <div
                  key={check.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-200 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {new Date(check.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </p>
                    <p className="font-medium text-slate-800 text-sm line-clamp-2 leading-relaxed">
                      "{check.symptoms}"
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${getSeverityStyles(check.severity).bg} ${getSeverityStyles(check.severity).text}`}
                  >
                    {check.severity}
                  </span>
                </div>
              ))
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SymptomChecker;
