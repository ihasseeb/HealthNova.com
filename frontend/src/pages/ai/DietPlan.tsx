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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
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
                <span className="text-5xl">🥗</span>
                AI Diet Plan
              </h1>
              <p className="text-white/90">
                Personalized 7-day meal plan based on your goals
              </p>
            </div>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-white text-emerald-600 hover:bg-slate-50"
            >
              {showHistory ? "🍽️ New Plan" : "📊 History"}
            </Button>
          </div>
        </div>

        {!showHistory ? (
          <>
            {/* LOADING STATE */}
            {isPending && (
              <AILoadingScreen
                emoji="🥗"
                title="Creating Your Diet Plan..."
                description="Our AI is designing a personalized 7-day meal plan based on your goals and preferences"
                steps={[
                  { icon: "📊", text: "Analyzing your health profile" },
                  { icon: "🎯", text: "Setting nutritional goals" },
                  { icon: "🍎", text: "Selecting balanced foods" },
                  { icon: "📅", text: "Planning 7-day schedule" },
                  { icon: "✨", text: "Finalizing your plan" },
                ]}
                tip="A balanced diet with variety keeps you healthier and prevents boredom!"
              />
            )}

            {/* GENERATE BUTTON - When not loading and no result */}
            {!isPending && !currentPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-12 shadow-lg text-center"
              >
                <div className="text-8xl mb-6">🥗</div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                  Generate Your Personalized Diet Plan
                </h2>
                <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                  AI will create a 7-day meal plan based on your health profile,
                  goals, dietary preferences, and allergies.
                </p>
                <Button
                  onClick={handleGenerate}
                  className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-lg font-semibold shadow-xl shadow-emerald-200"
                >
                  ✨ Generate AI Diet Plan
                </Button>
                <p className="text-xs text-slate-500 mt-4">
                  Takes 10-20 seconds
                </p>
              </motion.div>
            )}

            {/* DIET PLAN DISPLAY */}
            {!isPending && currentPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg text-center"
                  >
                    <div className="text-4xl mb-2">🔥</div>
                    <p className="text-3xl font-bold text-emerald-600">
                      {currentPlan.dailyCalories}
                    </p>
                    <p className="text-sm text-slate-500">Daily Calories</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg text-center"
                  >
                    <div className="text-4xl mb-2">🥩</div>
                    <p className="text-2xl font-bold text-teal-600">
                      {currentPlan.macros?.protein}
                    </p>
                    <p className="text-sm text-slate-500">Protein</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-lg text-center"
                  >
                    <div className="text-4xl mb-2">🌾</div>
                    <p className="text-2xl font-bold text-orange-600">
                      {currentPlan.macros?.carbs}
                    </p>
                    <p className="text-sm text-slate-500">Carbs</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 shadow-lg text-center"
                  >
                    <div className="text-4xl mb-2">💧</div>
                    <p className="text-2xl font-bold text-cyan-600">
                      {currentPlan.waterIntake}
                    </p>
                    <p className="text-sm text-slate-500">Water/day</p>
                  </motion.div>
                </div>

                {/* Day Selector */}
                <div className="bg-white rounded-2xl p-4 shadow-lg overflow-x-auto">
                  <div className="flex gap-2 min-w-max">
                    {currentPlan.weeklyPlan?.map((day: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`px-6 py-3 rounded-xl font-semibold transition ${
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

                {/* Selected Day Meals */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {/* Breakfast */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          🌅 Breakfast
                        </h3>
                        <span className="text-sm font-bold text-emerald-600">
                          {
                            currentPlan.weeklyPlan[selectedDay]?.meals
                              ?.breakfast?.calories
                          }{" "}
                          kcal
                        </span>
                      </div>
                      <p className="font-semibold text-slate-700 mb-3">
                        {
                          currentPlan.weeklyPlan[selectedDay]?.meals?.breakfast
                            ?.name
                        }
                      </p>
                      <ul className="space-y-1">
                        {currentPlan.weeklyPlan[
                          selectedDay
                        ]?.meals?.breakfast?.items?.map(
                          (item: string, i: number) => (
                            <li key={i} className="text-sm text-slate-600">
                              • {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Lunch */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          ☀️ Lunch
                        </h3>
                        <span className="text-sm font-bold text-orange-600">
                          {
                            currentPlan.weeklyPlan[selectedDay]?.meals?.lunch
                              ?.calories
                          }{" "}
                          kcal
                        </span>
                      </div>
                      <p className="font-semibold text-slate-700 mb-3">
                        {
                          currentPlan.weeklyPlan[selectedDay]?.meals?.lunch
                            ?.name
                        }
                      </p>
                      <ul className="space-y-1">
                        {currentPlan.weeklyPlan[
                          selectedDay
                        ]?.meals?.lunch?.items?.map(
                          (item: string, i: number) => (
                            <li key={i} className="text-sm text-slate-600">
                              • {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Dinner */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          🌙 Dinner
                        </h3>
                        <span className="text-sm font-bold text-purple-600">
                          {
                            currentPlan.weeklyPlan[selectedDay]?.meals?.dinner
                              ?.calories
                          }{" "}
                          kcal
                        </span>
                      </div>
                      <p className="font-semibold text-slate-700 mb-3">
                        {
                          currentPlan.weeklyPlan[selectedDay]?.meals?.dinner
                            ?.name
                        }
                      </p>
                      <ul className="space-y-1">
                        {currentPlan.weeklyPlan[
                          selectedDay
                        ]?.meals?.dinner?.items?.map(
                          (item: string, i: number) => (
                            <li key={i} className="text-sm text-slate-600">
                              • {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Snacks */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-3">
                        🍿 Snacks
                      </h3>
                      {currentPlan.weeklyPlan[selectedDay]?.meals?.snacks?.map(
                        (snack: any, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-2 border-b border-slate-100 last:border-0"
                          >
                            <span className="text-sm text-slate-700">
                              {snack.name}
                            </span>
                            <span className="text-xs font-bold text-cyan-600">
                              {snack.calories} kcal
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Tips */}
                {currentPlan.tips?.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      💡 Tips
                    </h3>
                    <div className="space-y-2">
                      {currentPlan.tips?.map((tip: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg"
                        >
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Foods To Avoid */}
                {currentPlan.foodsToAvoid?.length > 0 && (
                  <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                    <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                      🚫 Foods to Avoid
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentPlan.foodsToAvoid?.map(
                        (food: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                          >
                            {food}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Regenerate Button */}
                <Button
                  onClick={handleGenerate}
                  className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-lg"
                >
                  🔄 Generate New Plan
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          /* History Section */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-slate-800">
              📊 Past Diet Plans
            </h2>
            {plans.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-slate-500">No diet plans yet</p>
              </div>
            ) : (
              plans.map((plan: any, i: number) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-slate-500">
                        {new Date(plan.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xl font-bold text-slate-800 mt-1">
                        {plan.dailyCalories} kcal Plan
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Protein</p>
                      <p className="text-sm font-bold text-emerald-600">
                        {plan.macros?.protein}
                      </p>
                    </div>
                  </div>
                  {plan.tips && plan.tips.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-lg mt-3">
                      <p className="text-xs font-semibold text-slate-600 mb-1">
                        Top Tip:
                      </p>
                      <p className="text-sm">{plan.tips[0]}</p>
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

export default DietPlan;
