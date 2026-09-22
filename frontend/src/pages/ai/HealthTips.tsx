import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useHealthTips } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";
import {
  Lightbulb,
  Target,
  Zap,
  Quote,
  Ban,
  BellRing,
  RefreshCcw,
} from "lucide-react";

const HealthTips = () => {
  const [category, setCategory] = useState("GENERAL");
  const { mutate: generateTips, isPending, data: result } = useHealthTips();

  const tips = result?.data;

  // Auto-generate on mount
  useEffect(() => {
    generateTips({ category: "GENERAL" });
  }, []);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    generateTips({ category: newCategory });
  };

  const categories = [
    { value: "GENERAL", label: "General" },
    { value: "DIET", label: "Diet & Nutrition" },
    { value: "FITNESS", label: "Fitness" },
    { value: "MENTAL", label: "Mental Health" },
    { value: "SLEEP", label: "Sleep & Recovery" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center border border-yellow-100">
              <Lightbulb size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                AI Health Tips
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Personalized daily wellness advice
              </p>
            </div>
          </div>
        </div>

        {/* Category Selector (Modern Pills) */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200/60 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max p-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                disabled={isPending}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  category === cat.value
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isPending && (
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60 mt-6">
            <AILoadingScreen
              emoji="💡"
              title="Curating Insights..."
              description="AI is filtering the best health advice tailored to your medical profile."
              steps={[
                { icon: "🔍", text: "Analyzing your profile data" },
                { icon: "🎯", text: "Selecting relevant topics" },
                { icon: "📝", text: "Formulating daily action plan" },
              ]}
            />
          </div>
        )}

        {/* Tips Display */}
        <AnimatePresence mode="wait">
          {!isPending && tips && (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Daily Tip - Hero Card */}
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-6">
                    <Target size={14} className="text-primary-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Focus of the Day
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight leading-tight">
                    {tips.dailyTip?.title}
                  </h2>
                  <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed font-medium max-w-2xl">
                    {tips.dailyTip?.description}
                  </p>

                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 inline-block w-full">
                    <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">
                      Actionable Step
                    </p>
                    <p className="font-semibold text-lg">
                      {tips.dailyTip?.actionable}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 flex items-start gap-2">
                      <Zap
                        size={16}
                        className="text-yellow-400 shrink-0 mt-0.5"
                      />
                      {tips.dailyTip?.benefit}
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Goals */}
                {tips.weeklyGoals?.length > 0 && (
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60 h-full">
                    <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <Target size={20} className="text-primary-600" /> Weekly
                      Objectives
                    </h3>
                    <div className="space-y-4">
                      {tips.weeklyGoals.map((goal: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden group"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-l-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                          <h4 className="font-bold text-slate-800 text-sm mb-1">
                            {goal.goal}
                          </h4>
                          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                            {goal.description}
                          </p>
                          <div className="inline-block bg-white px-2.5 py-1 rounded-md border border-slate-200">
                            <p className="text-[10px] font-bold text-primary-700 uppercase">
                              Target: {goal.target}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Today's Focus Mini-card */}
                  {tips.todaysFocus && (
                    <div className="bg-primary-50 rounded-[2rem] p-6 border border-primary-100">
                      <h3 className="text-sm font-bold text-primary-800 uppercase tracking-wider mb-2">
                        Area: {tips.todaysFocus.area}
                      </h3>
                      <p className="text-slate-700 text-sm font-medium mb-1">
                        <strong className="text-primary-900">Why:</strong>{" "}
                        {tips.todaysFocus.why}
                      </p>
                      <p className="text-slate-600 text-sm">
                        <strong className="text-primary-900">How:</strong>{" "}
                        {tips.todaysFocus.how}
                      </p>
                    </div>
                  )}

                  {/* Motivational Quote */}
                  {tips.motivationalQuote && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60 text-center relative">
                      <Quote
                        className="absolute top-4 left-4 text-slate-100"
                        size={40}
                      />
                      <p className="text-lg font-bold italic text-slate-700 relative z-10 leading-relaxed">
                        "{tips.motivationalQuote}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Tips */}
                {tips.quickTips?.length > 0 && (
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Zap size={20} className="text-yellow-500" /> Quick Bytes
                    </h3>
                    <div className="space-y-3">
                      {tips.quickTips.map((tip: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <span className="text-primary-500 font-bold text-sm bg-white w-6 h-6 flex items-center justify-center rounded-full shrink-0 border border-slate-200">
                            {i + 1}
                          </span>
                          <span className="text-slate-600 text-sm font-medium pt-0.5">
                            {tip}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Avoid Today */}
                  {tips.avoidToday?.length > 0 && (
                    <div className="bg-red-50/50 rounded-[2rem] p-6 border border-red-100">
                      <h3 className="text-base font-bold text-red-800 mb-4 flex items-center gap-2">
                        <Ban size={18} /> Avoid Today
                      </h3>
                      <div className="space-y-2">
                        {tips.avoidToday.map((item: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-red-700 font-medium"
                          >
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reminders */}
                  {tips.reminders?.length > 0 && (
                    <div className="bg-blue-50/50 rounded-[2rem] p-6 border border-blue-100">
                      <h3 className="text-base font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <BellRing size={18} /> Reminders
                      </h3>
                      <div className="space-y-2">
                        {tips.reminders.map((reminder: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-blue-700 font-medium"
                          >
                            <span className="shrink-0 mt-0.5">•</span>
                            <span>{reminder}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Refresh Button */}
              <Button
                onClick={() => generateTips({ category })}
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white text-base font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 mt-4"
              >
                <RefreshCcw size={18} className="mr-2" /> Generate New Tips
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HealthTips;
