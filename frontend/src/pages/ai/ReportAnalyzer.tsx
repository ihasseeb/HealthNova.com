import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useAnalyzeReportImage } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";
import { toast } from "sonner";
import {
  FileText,
  ImagePlus,
  X,
  RefreshCcw,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

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
    if (!file.type.startsWith("image/")) {
      toast.error("Upload a valid image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size limit is 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setImage(base64String.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!image) return toast.error("Upload an image first");
    analyzeImage({ image, reportType });
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center border border-cyan-100">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Vision Report AI
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Upload lab results for intelligent OCR analysis
              </p>
            </div>
          </div>
        </div>

        {isPending && (
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
            <AILoadingScreen
              emoji="🔍"
              title="Scanning Medical Report..."
              description="Extracting clinical data and generating a comprehensive summary."
              steps={[
                { icon: "📸", text: "Processing image via Vision Model" },
                { icon: "📊", text: "Identifying key biomarkers" },
                { icon: "🧠", text: "Formulating insights" },
              ]}
            />
          </div>
        )}

        {!isPending && !analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200/60"
          >
            <div className="max-w-md mx-auto mb-8">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                Select Report Category
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full h-12 px-4 border border-slate-200 bg-slate-50 rounded-xl outline-none focus:border-slate-400 font-semibold text-slate-700 text-center text-sm appearance-none cursor-pointer"
              >
                {[
                  "Blood Test",
                  "X-Ray",
                  "MRI",
                  "CT Scan",
                  "Prescription",
                  "General",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {!imagePreview ? (
              <label className="block cursor-pointer group">
                <div className="border-2 border-dashed border-slate-300 rounded-[2rem] p-16 text-center hover:border-slate-900 hover:bg-slate-50 transition-colors">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:text-slate-900 group-hover:scale-110 transition-all">
                    <ImagePlus size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Tap to Upload Image
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">
                    JPEG, PNG or WEBP (Max 10MB)
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
              <div className="space-y-6">
                <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-[500px] object-contain"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 p-2.5 rounded-full hover:bg-white shadow-lg hover:scale-110 transition-transform"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>
                </div>
                <Button
                  onClick={handleAnalyze}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-xl shadow-slate-900/20"
                >
                  Extract & Analyze Data
                </Button>
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {!isPending && analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60 text-center">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 bg-slate-50">
                  {analysis.overallStatus === "NORMAL" ? (
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  ) : analysis.overallStatus === "ATTENTION_NEEDED" ? (
                    <AlertTriangle size={40} className="text-amber-500" />
                  ) : (
                    <Activity size={40} className="text-red-500" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Analysis Complete
                </h2>
                <p className="text-slate-600 font-medium max-w-2xl mx-auto">
                  {analysis.summary}
                </p>
              </div>

              {analysis.keyFindings?.length > 0 && (
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">
                    Biomarker Results
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                        <tr>
                          <th className="p-4 rounded-l-xl">Test Name</th>
                          <th className="p-4">Value</th>
                          <th className="p-4">Normal Range</th>
                          <th className="p-4 rounded-r-xl">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {analysis.keyFindings.map((finding: any, i: number) => (
                          <tr key={i}>
                            <td className="p-4 font-semibold text-slate-800">
                              {finding.test}
                            </td>
                            <td className="p-4 font-bold font-mono">
                              {finding.value}
                            </td>
                            <td className="p-4 text-slate-500">
                              {finding.normalRange}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${finding.status === "NORMAL" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
                              >
                                {finding.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full h-14 border-slate-200 text-slate-700 font-bold rounded-xl bg-white hover:bg-slate-50"
              >
                <RefreshCcw size={18} className="mr-2" /> Upload Another
                Document
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReportAnalyzer;
