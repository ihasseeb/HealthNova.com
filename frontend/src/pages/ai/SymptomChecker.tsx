import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useSymptomCheck, useSymptomHistory } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";

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
    checkSymptoms({ symptoms: [symptoms], duration });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "bg-green-100 text-green-700 border-green-300";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "EMERGENCY":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityEmoji = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "✅";
      case "MODERATE":
        return "⚠️";
      case "HIGH":
        return "🚨";
      case "EMERGENCY":
        return "🆘";
      default:
        return "🩺";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <span className="text-5xl">🩺</span>
                AI Symptom Checker
              </h1>
              <p className="text-white/90">
                Describe your symptoms and get AI-powered health insights
              </p>
            </div>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-white text-emerald-600 hover:bg-slate-50"
            >
              {showHistory ? "📝 New Check" : "📊 History"}
            </Button>
          </div>
        </div>

        {!showHistory ? (
          <>
            {/* LOADING STATE */}
            {isPending && (
              <AILoadingScreen
                emoji="🩺"
                title="Analyzing Your Symptoms..."
                description="Our AI is carefully reviewing your symptoms and preparing personalized health guidance"
                steps={[
                  { icon: "📋", text: "Reading your symptoms" },
                  { icon: "🧠", text: "Consulting medical knowledge" },
                  { icon: "🔍", text: "Analyzing possible causes" },
                  { icon: "💊", text: "Preparing recommendations" },
                  { icon: "✨", text: "Finalizing your report" },
                ]}
                tip="Providing detailed symptoms helps AI give better analysis!"
              />
            )}

            {/* INPUT FORM - Only when not loading */}
            {!isPending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">
                      Describe Your Symptoms *
                    </Label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="E.g., I have severe headache, fever of 101°F, and body aches..."
                      className="w-full min-h-[150px] p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none"
                      required
                      minLength={10}
                    />
                    <p className="text-xs text-slate-500">
                      Minimum 10 characters. Be as detailed as possible.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-semibold">Duration (optional)</Label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="">Select duration</option>
                      <option value="Less than 24 hours">
                        Less than 24 hours
                      </option>
                      <option value="1-2 days">1-2 days</option>
                      <option value="3-5 days">3-5 days</option>
                      <option value="1 week">1 week</option>
                      <option value="More than 1 week">More than 1 week</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={symptoms.length < 10}
                    className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-lg font-semibold shadow-xl shadow-emerald-200"
                  >
                    🔍 Analyze Symptoms
                  </Button>
                </form>
              </motion.div>
            )}

            {/* RESULTS */}
            <AnimatePresence>
              {analysis && !isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Severity Card */}
                  <div
                    className={`p-6 rounded-2xl border-2 ${getSeverityColor(
                      analysis.severity,
                    )}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">
                        {getSeverityEmoji(analysis.severity)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Severity Level</p>
                        <p className="text-3xl font-bold">
                          {analysis.severity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Possible Causes */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      🔎 Possible Causes
                    </h3>
                    <div className="space-y-2">
                      {analysis.possibleCauses?.map(
                        (cause: string, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 bg-slate-50 rounded-lg border-l-4 border-emerald-500"
                          >
                            {cause}
                          </motion.div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      💡 Recommendations
                    </h3>
                    <div className="space-y-2">
                      {analysis.recommendations?.map(
                        (rec: string, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg"
                          >
                            <span className="text-emerald-600 font-bold">
                              ✓
                            </span>
                            <span>{rec}</span>
                          </motion.div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Home Remedies */}
                  {analysis.homeRemedies?.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        🏠 Home Remedies
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {analysis.homeRemedies?.map(
                          (remedy: string, i: number) => (
                            <div
                              key={i}
                              className="p-3 bg-cyan-50 rounded-lg border border-cyan-200"
                            >
                              🌿 {remedy}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Warning Signs */}
                  {analysis.warningSignsToWatch?.length > 0 && (
                    <div className="bg-red-50 rounded-2xl p-6 shadow-lg border-2 border-red-200">
                      <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                        ⚠️ Warning Signs to Watch
                      </h3>
                      <div className="space-y-2">
                        {analysis.warningSignsToWatch?.map(
                          (sign: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-red-600">🚨</span>
                              <span>{sign}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* When to See Doctor */}
                  {analysis.whenToSeeDoctor && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                      <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                        👨‍⚕️ When to See a Doctor
                      </h3>
                      <p>{analysis.whenToSeeDoctor}</p>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-sm text-yellow-800">
                    ⚠️ <strong>Disclaimer:</strong> This is AI-generated advice.
                    Please consult a healthcare professional for medical
                    concerns.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* History Section */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-slate-800">
              📊 Past Symptom Checks
            </h2>
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-slate-500">No symptom checks yet</p>
              </div>
            ) : (
              history.map((check: any, i: number) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-slate-500">
                        {new Date(check.createdAt).toLocaleString()}
                      </p>
                      <p className="font-semibold text-slate-800 mt-1">
                        {check.symptoms}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(
                        check.severity,
                      )}`}
                    >
                      {check.severity}
                    </span>
                  </div>
                  {check.recommendations?.length > 0 && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        Key Recommendations:
                      </p>
                      <ul className="text-sm space-y-1">
                        {check.recommendations
                          ?.slice(0, 2)
                          .map((rec: string, j: number) => (
                            <li key={j}>✓ {rec}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SymptomChecker;
