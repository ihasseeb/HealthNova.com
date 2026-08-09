import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useHealthTips } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";

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
    { value: "GENERAL", label: "🌟 General", color: "emerald" },
    { value: "DIET", label: "🥗 Diet", color: "orange" },
    { value: "FITNESS", label: "💪 Fitness", color: "blue" },
    { value: "MENTAL", label: "🧠 Mental", color: "purple" },
    { value: "SLEEP", label: "😴 Sleep", color: "indigo" },
  ];

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
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-5xl inline-block"
              >
                💡
              </motion.span>
              Health Tips
            </h1>
            <p className="text-white/90">
              Personalized daily wellness advice powered by AI
            </p>
          </div>
        </div>

        {/* Category Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-lg overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                disabled={isPending}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  category === cat.value
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isPending && (
          <AILoadingScreen
            emoji="💡"
            title="Getting Your Health Tips..."
            description="Our AI is preparing personalized health advice based on your profile"
            steps={[
              { icon: "📊", text: "Analyzing your profile" },
              { icon: "🎯", text: "Selecting relevant tips" },
              { icon: "💡", text: "Crafting daily advice" },
              { icon: "🎁", text: "Preparing your wellness plan" },
              { icon: "✨", text: "Finalizing tips" },
            ]}
            tip="Small daily changes lead to big health improvements!"
          />
        )}

        {/* Tips Display */}
        <AnimatePresence mode="wait">
          {!isPending && tips && (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Daily Tip - Hero Card */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-4xl">🎯</span>
                    <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                      TODAY'S TIP
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3">
                    {tips.dailyTip?.title}
                  </h2>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {tips.dailyTip?.description}
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4">
                    <p className="text-sm text-white/80 mb-1">
                      🎯 Take Action:
                    </p>
                    <p className="font-semibold text-lg">
                      {tips.dailyTip?.actionable}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 text-white/90">
                    <span className="text-2xl">✨</span>
                    <div>
                      <p className="text-sm font-semibold">Why it works:</p>
                      <p className="text-sm">{tips.dailyTip?.benefit}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Today's Focus */}
              {tips.todaysFocus && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                    🌟 Today's Focus: {tips.todaysFocus.area}
                  </h3>
                  <p className="text-slate-600 mb-3">
                    <strong>Why:</strong> {tips.todaysFocus.why}
                  </p>
                  <p className="text-slate-700">
                    <strong>How:</strong> {tips.todaysFocus.how}
                  </p>
                </motion.div>
              )}

              {/* Weekly Goals */}
              {tips.weeklyGoals?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    📅 Weekly Goals
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {tips.weeklyGoals.map((goal: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl border border-emerald-200"
                      >
                        <h4 className="font-bold text-slate-800 mb-2">
                          🎯 {goal.goal}
                        </h4>
                        <p className="text-sm text-slate-600 mb-2">
                          {goal.description}
                        </p>
                        <div className="bg-white px-3 py-1 rounded-full inline-block">
                          <p className="text-xs font-semibold text-emerald-700">
                            Target: {goal.target}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Tips */}
              {tips.quickTips?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    ⚡ Quick Tips
                  </h3>
                  <div className="space-y-2">
                    {tips.quickTips.map((tip: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg"
                      >
                        <span className="text-emerald-600 font-bold text-lg">
                          {i + 1}.
                        </span>
                        <span className="text-slate-700">{tip}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Motivational Quote */}
              {tips.motivationalQuote && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-xl text-center"
                >
                  <div className="text-6xl mb-4">💫</div>
                  <p className="text-2xl font-bold italic leading-relaxed">
                    "{tips.motivationalQuote}"
                  </p>
                </motion.div>
              )}

              {/* Avoid Today */}
              {tips.avoidToday?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-red-50 rounded-2xl p-6 border-2 border-red-200"
                >
                  <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                    🚫 Avoid Today
                  </h3>
                  <div className="space-y-2">
                    {tips.avoidToday.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-red-600">❌</span>
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reminders */}
              {tips.reminders?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200"
                >
                  <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                    🔔 Reminders
                  </h3>
                  <div className="space-y-2">
                    {tips.reminders.map((reminder: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-blue-600">📌</span>
                        <span className="text-slate-700">{reminder}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Refresh Button */}
              <Button
                onClick={() => generateTips({ category })}
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-lg"
              >
                🔄 Get New Tips
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HealthTips;
