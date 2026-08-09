import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useGenerateDietPlan, useDietPlans } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";

const DietPlan = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  const {
    mutate: generatePlan,
    isPending,
    data: result,
  } = useGenerateDietPlan();
  const { data: historyData } = useDietPlans();

  const plans = historyData?.data?.plans || [];
  const currentPlan = result?.data;

  const handleGenerate = () => {
    generatePlan();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-4 md:space-y-6"
      >
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-4xl md:text-5xl flex-shrink-0">🥗</span>
              <div className="min-w-0">
                <h1 className="text-xl md:text-3xl font-bold leading-tight">
                  AI Diet Plan
                </h1>
                <p className="text-white/90 text-xs md:text-base mt-1">
                  Personalized 7-day meal plan
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              size="sm"
              className="bg-white text-emerald-600 hover:bg-slate-50 flex-shrink-0 text-xs md:text-sm"
            >
              {showHistory ? "🍽️ New" : "📊 History"}
            </Button>
          </div>
        </div>

        {!showHistory ? (
          <>
            {isPending && (
              <AILoadingScreen
                emoji="🥗"
                title="Creating Your Diet Plan..."
                description="AI is designing a 7-day meal plan based on your goals"
                steps={[
                  { icon: "📊", text: "Analyzing your profile" },
                  { icon: "🎯", text: "Setting nutrition goals" },
                  { icon: "🍎", text: "Selecting foods" },
                  { icon: "📅", text: "Planning 7 days" },
                  { icon: "✨", text: "Finalizing" },
                ]}
                tip="Balanced diet with variety keeps you healthy!"
              />
            )}

            {!isPending && !currentPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 md:p-12 shadow-lg text-center"
              >
                <div className="text-6xl md:text-8xl mb-4 md:mb-6">🥗</div>
                <h2 className="text-xl md:text-3xl font-bold text-slate-800 mb-2 md:mb-3">
                  Generate Your Diet Plan
                </h2>
                <p className="text-slate-600 text-sm md:text-base mb-6 md:mb-8 max-w-xl mx-auto">
                  AI will create a 7-day meal plan based on your profile, goals,
                  and preferences.
                </p>
                <Button
                  onClick={handleGenerate}
                  className="h-12 md:h-14 px-6 md:px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-sm md:text-lg font-semibold shadow-xl shadow-emerald-200 w-full sm:w-auto"
                >
                  ✨ Generate AI Diet Plan
                </Button>
                <p className="text-xs text-slate-500 mt-3 md:mt-4">
                  Takes 10-20 seconds
                </p>
              </motion.div>
            )}

            {!isPending && currentPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 md:space-y-6"
              >
                {/* Stats - 2 cols on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-white rounded-2xl p-3 md:p-6 shadow-lg text-center">
                    <div className="text-2xl md:text-4xl mb-1 md:mb-2">🔥</div>
                    <p className="text-xl md:text-3xl font-bold text-emerald-600">
                      {currentPlan.dailyCalories}
                    </p>
                    <p className="text-xs md:text-sm text-slate-500">
                      Calories
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-3 md:p-6 shadow-lg text-center">
                    <div className="text-2xl md:text-4xl mb-1 md:mb-2">🥩</div>
                    <p className="text-lg md:text-2xl font-bold text-teal-600">
                      {currentPlan.macros?.protein}
                    </p>
                    <p className="text-xs md:text-sm text-slate-500">Protein</p>
                  </div>
                  <div className="bg-white rounded-2xl p-3 md:p-6 shadow-lg text-center">
                    <div className="text-2xl md:text-4xl mb-1 md:mb-2">🌾</div>
                    <p className="text-lg md:text-2xl font-bold text-orange-600">
                      {currentPlan.macros?.carbs}
                    </p>
                    <p className="text-xs md:text-sm text-slate-500">Carbs</p>
                  </div>
                  <div className="bg-white rounded-2xl p-3 md:p-6 shadow-lg text-center">
                    <div className="text-2xl md:text-4xl mb-1 md:mb-2">💧</div>
                    <p className="text-lg md:text-2xl font-bold text-cyan-600">
                      {currentPlan.waterIntake}
                    </p>
                    <p className="text-xs md:text-sm text-slate-500">Water</p>
                  </div>
                </div>

                {/* Day Selector - Scrollable */}
                <div className="bg-white rounded-2xl p-3 md:p-4 shadow-lg overflow-x-auto">
                  <div className="flex gap-2 min-w-max">
                    {currentPlan.weeklyPlan?.map((day: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-xs md:text-base transition ${
                          selectedDay === i
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meals Grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                  >
                    {[
                      {
                        key: "breakfast",
                        icon: "🌅",
                        label: "Breakfast",
                        color: "emerald",
                      },
                      {
                        key: "lunch",
                        icon: "☀️",
                        label: "Lunch",
                        color: "orange",
                      },
                      {
                        key: "dinner",
                        icon: "🌙",
                        label: "Dinner",
                        color: "purple",
                      },
                    ].map((meal) => (
                      <div
                        key={meal.key}
                        className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base md:text-xl font-bold text-slate-800 flex items-center gap-2">
                            {meal.icon} {meal.label}
                          </h3>
                          <span
                            className={`text-xs md:text-sm font-bold text-${meal.color}-600`}
                          >
                            {
                              currentPlan.weeklyPlan[selectedDay]?.meals?.[
                                meal.key
                              ]?.calories
                            }{" "}
                            kcal
                          </span>
                        </div>
                        <p className="font-semibold text-slate-700 mb-2 md:mb-3 text-sm md:text-base">
                          {
                            currentPlan.weeklyPlan[selectedDay]?.meals?.[
                              meal.key
                            ]?.name
                          }
                        </p>
                        <ul className="space-y-1">
                          {currentPlan.weeklyPlan[selectedDay]?.meals?.[
                            meal.key
                          ]?.items?.map((item: string, i: number) => (
                            <li
                              key={i}
                              className="text-xs md:text-sm text-slate-600"
                            >
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Snacks */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                      <h3 className="text-base md:text-xl font-bold text-slate-800 flex items-center gap-2 mb-3">
                        🍿 Snacks
                      </h3>
                      {currentPlan.weeklyPlan[selectedDay]?.meals?.snacks?.map(
                        (snack: any, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-2 border-b border-slate-100 last:border-0"
                          >
                            <span className="text-xs md:text-sm text-slate-700">
                              {snack.name}
                            </span>
                            <span className="text-xs font-bold text-cyan-600">
                              {snack.calories}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Tips */}
                {currentPlan.tips?.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                    <h3 className="text-base md:text-xl font-bold text-slate-800 mb-3 md:mb-4">
                      💡 Tips
                    </h3>
                    <div className="space-y-2">
                      {currentPlan.tips?.map((tip: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg text-sm md:text-base"
                        >
                          <span className="text-emerald-600 font-bold flex-shrink-0">
                            ✓
                          </span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-sm md:text-lg"
                >
                  🔄 Generate New Plan
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 md:space-y-4"
          >
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              📊 Past Plans
            </h2>
            {plans.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-lg">
                <p className="text-3xl md:text-4xl mb-3">📭</p>
                <p className="text-slate-500 text-sm md:text-base">
                  No plans yet
                </p>
              </div>
            ) : (
              plans.map((plan: any) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-lg"
                >
                  <p className="text-xs md:text-sm text-slate-500">
                    {new Date(plan.createdAt).toLocaleString()}
                  </p>
                  <p className="text-lg md:text-xl font-bold text-slate-800 mt-1">
                    {plan.dailyCalories} kcal
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DietPlan;
