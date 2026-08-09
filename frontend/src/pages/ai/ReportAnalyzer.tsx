import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useAnalyzeReportImage } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";
import { toast } from "sonner";

const ReportAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reportType, setReportType] = useState("Blood Test");

  const {
    mutate: analyzeImage,
    isPending,
    data: result,
  } = useAnalyzeReportImage();

  const analysis = result?.data;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image size should be less than 20MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      // Remove data:image/xxx;base64, prefix
      const base64Data = base64String.split(",")[1];
      setImage(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!image) {
      toast.error("Please upload an image first");
      return;
    }
    analyzeImage({ image, reportType });
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NORMAL":
        return "bg-green-100 text-green-700 border-green-300";
      case "ATTENTION_NEEDED":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "CONCERNING":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700";
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
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">📄</span>
              AI Report Analyzer
            </h1>
            <p className="text-white/90">
              Upload medical report image and get AI analysis
            </p>
          </div>
        </div>

        {/* Loading */}
        {isPending && (
          <AILoadingScreen
            emoji="📄"
            title="Analyzing Your Report..."
            description="Our AI is reading the image and extracting medical information"
            steps={[
              { icon: "📸", text: "Processing image" },
              { icon: "🔍", text: "Extracting text and values" },
              { icon: "🧠", text: "Analyzing findings" },
              { icon: "💡", text: "Preparing recommendations" },
              { icon: "✨", text: "Finalizing analysis" },
            ]}
            tip="AI can analyze various reports: blood tests, X-rays, prescriptions, and more!"
          />
        )}

        {/* Upload Form */}
        {!isPending && !analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            {/* Report Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full h-11 px-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              >
                <option value="Blood Test">Blood Test</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI">MRI</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Ultrasound">Ultrasound</option>
                <option value="ECG">ECG</option>
                <option value="Prescription">Prescription</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Lipid Profile">Lipid Profile</option>
                <option value="Thyroid">Thyroid Test</option>
                <option value="Diabetes">Diabetes Report</option>
                <option value="General">Other</option>
              </select>
            </div>

            {/* Image Upload */}
            {!imagePreview ? (
              <label className="block cursor-pointer">
                <div className="border-4 border-dashed border-emerald-300 rounded-2xl p-12 text-center hover:border-emerald-500 hover:bg-emerald-50 transition">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Upload Report Image
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Click here or drag & drop your medical report
                  </p>
                  <p className="text-xs text-slate-400">
                    Supported: JPG, PNG, WEBP (Max 20MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300">
                  <img
                    src={imagePreview}
                    alt="Report Preview"
                    className="w-full max-h-96 object-contain bg-slate-50"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ❌
                  </button>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAnalyze}
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90"
                  >
                    🔍 Analyze Report
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="h-12"
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {!isPending && analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status */}
              <div
                className={`p-6 rounded-2xl border-2 ${getStatusColor(analysis.overallStatus)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold mb-1">Overall Status</p>
                    <p className="text-2xl font-bold">
                      {analysis.overallStatus?.replace("_", " ")}
                    </p>
                  </div>
                  <div className="text-5xl">
                    {analysis.overallStatus === "NORMAL"
                      ? "✅"
                      : analysis.overallStatus === "ATTENTION_NEEDED"
                        ? "⚠️"
                        : "🚨"}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                  📋 Summary
                </h3>
                <p className="text-slate-700">{analysis.summary}</p>
              </div>

              {/* Key Findings */}
              {analysis.keyFindings?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    🔍 Key Findings
                  </h3>
                  <div className="space-y-3">
                    {analysis.keyFindings.map((finding: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-slate-800">
                            {finding.test}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              finding.status === "NORMAL"
                                ? "bg-green-100 text-green-700"
                                : finding.status === "HIGH"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {finding.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          <strong>Value:</strong> {finding.value} |{" "}
                          <strong>Normal:</strong> {finding.normalRange}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          💡 {finding.meaning}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Abnormal Values */}
              {analysis.abnormalValues?.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                  <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    ⚠️ Areas of Concern
                  </h3>
                  <div className="space-y-3">
                    {analysis.abnormalValues.map((abnormal: any, i: number) => (
                      <div key={i} className="p-3 bg-white rounded-lg">
                        <p className="font-bold text-red-700">
                          {abnormal.test}: {abnormal.value}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {abnormal.concern}
                        </p>
                        <p className="text-sm text-emerald-700 mt-2">
                          ✓ {abnormal.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    💡 Recommendations
                  </h3>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg"
                      >
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyze Another */}
              <Button
                onClick={handleReset}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90"
              >
                📄 Analyze Another Report
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReportAnalyzer;
