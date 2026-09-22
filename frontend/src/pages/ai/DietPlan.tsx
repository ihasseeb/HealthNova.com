import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useGenerateDietPlan, useDietPlans } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";
import {
  Salad,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Calendar,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100">
              <Salad size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                AI Diet Plan
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Personalized 7-day nutritional guide
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="outline"
            className="w-full md:w-auto rounded-xl font-semibold border-slate-200 text-slate-700"
          >
            {showHistory ? "← Create New" : "View History"}
          </Button>
        </div>

        {!showHistory ? (
          <>
            {/* LOADING STATE */}
            {isPending && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60 mt-6">
                <AILoadingScreen
                  emoji="🥗"
                  title="Crafting Your Meal Plan..."
                  description="AI is balancing your macros and calculating optimal caloric intake."
                  steps={[
                    { icon: "📊", text: "Analyzing health profile" },
                    { icon: "🎯", text: "Setting nutritional goals" },
                    { icon: "🥑", text: "Selecting optimal foods" },
                    { icon: "📅", text: "Structuring 7-day schedule" },
                  ]}
                />
              </div>
            )}

            {/* GENERATE CTA - If no plan yet */}
            {!isPending && !currentPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-10 md:p-16 shadow-sm border border-slate-200/60 text-center flex flex-col items-center justify-center mt-6 min-h-[400px]"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-6 border border-slate-100">
                  <Salad size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                  Ready to optimize your nutrition?
                </h2>
                <p className="text-slate-500 text-sm md:text-base mb-8 max-w-lg font-medium leading-relaxed">
                  Our AI will generate a complete 7-day meal plan tailored to
                  your BMI, health goals, dietary preferences, and known
                  allergies.
                </p>
                <Button
                  onClick={handleGenerate}
                  className="h-14 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg transition-transform hover:-translate-y-1 w-full sm:w-auto"
                >
                  Generate Diet Plan
                </Button>
                <p className="text-xs text-slate-400 font-medium mt-4">
                  Takes about 15-20 seconds
                </p>
              </motion.div>
            )}

            {/* DIET PLAN DISPLAY */}
            {!isPending && currentPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 mt-6"
              >
                {/* Top Macro Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Daily Calories",
                      value: currentPlan.dailyCalories,
                      icon: <Flame size={24} />,
                      color: "text-orange-600",
                      bg: "bg-orange-50",
                    },
                    {
                      label: "Protein Target",
                      value: currentPlan.macros?.protein,
                      icon: <Beef size={24} />,
                      color: "text-rose-600",
                      bg: "bg-rose-50",
                    },
                    {
                      label: "Carb Target",
                      value: currentPlan.macros?.carbs,
                      icon: <Wheat size={24} />,
                      color: "text-amber-600",
                      bg: "bg-amber-50",
                    },
                    {
                      label: "Water Intake",
                      value: currentPlan.waterIntake,
                      icon: <Droplets size={24} />,
                      color: "text-cyan-600",
                      bg: "bg-cyan-50",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 hover:border-slate-300 transition-colors flex flex-col items-center text-center"
                    >
                      <div
                        className={`p-3 rounded-xl ${stat.bg} ${stat.color} mb-3`}
                      >
                        {stat.icon}
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900">
                        {stat.value}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Day Selector Pills */}
                <div className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-200/60 overflow-x-auto flex gap-2 hide-scrollbar">
                  {currentPlan.weeklyPlan?.map((day: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                        selectedDay === i
                          ? "bg-slate-900 text-white shadow-md"
                          : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>

                {/* Meals Grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {/* Breakfast, Lunch, Dinner Mapper */}
                    {[
                      { key: "breakfast", label: "Breakfast", time: "Morning" },
                      { key: "lunch", label: "Lunch", time: "Afternoon" },
                      { key: "dinner", label: "Dinner", time: "Evening" },
                    ].map((meal) => {
                      const mealData =
                        currentPlan.weeklyPlan[selectedDay]?.meals?.[meal.key];
                      return (
                        <div
                          key={meal.key}
                          className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">
                                {meal.label}
                              </h3>
                              <p className="text-xs font-medium text-slate-500">
                                {meal.time}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
                              {mealData?.calories} kcal
                            </span>
                          </div>

                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                            <p className="font-bold text-sm text-slate-800 leading-snug">
                              {mealData?.name}
                            </p>
                          </div>

                          <ul className="space-y-2">
                            {mealData?.items?.map((item: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-slate-600 font-medium"
                              >
                                <span className="text-primary-500 mt-0.5">
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}

                    {/* Snacks Section */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        Snacks
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mb-4">
                        Between meals
                      </p>

                      <div className="space-y-3">
                        {currentPlan.weeklyPlan[
                          selectedDay
                        ]?.meals?.snacks?.map((snack: any, i: number) => (
                          <div
                            key={i}
                            className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100"
                          >
                            <span className="text-sm font-bold text-slate-700">
                              {snack.name}
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-md shadow-sm">
                              {snack.calories} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Tips & Warnings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.tips?.length > 0 && (
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60">
                      <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-500" />{" "}
                        Nutritional Tips
                      </h3>
                      <div className="space-y-3">
                        {currentPlan.tips.map((tip: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-600 font-medium"
                          >
                            <CheckCircle2
                              size={16}
                              className="text-emerald-500 shrink-0 mt-0.5"
                            />
                            <span className="leading-snug">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentPlan.foodsToAvoid?.length > 0 && (
                    <div className="bg-red-50/50 rounded-[2rem] p-6 border border-red-100">
                      <h3 className="text-base font-bold text-red-800 mb-4 flex items-center gap-2">
                        <AlertCircle size={18} /> Foods to Avoid
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentPlan.foodsToAvoid.map(
                          (food: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-white border border-red-200 text-red-700 rounded-lg text-xs font-bold shadow-sm"
                            >
                              {food}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isPending}
                  className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg transition-transform hover:-translate-y-1"
                >
                  <RotateCcw size={18} className="mr-2" /> Generate New Plan
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          /* History View (Minimalist) */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 mt-6"
          >
            {plans.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-200/60">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  No History Found
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Generate a diet plan to see it here.
                </p>
              </div>
            ) : (
              plans.map((plan: any) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60 flex items-center justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {new Date(plan.createdAt).toLocaleDateString(undefined, {
                        dateStyle: "medium",
                      })}
                    </p>
                    <p className="font-bold text-slate-800 text-base">
                      {plan.dailyCalories} kcal Daily Target
                    </p>
                  </div>
                  <div className="hidden sm:flex gap-4 text-xs font-bold text-slate-500">
                    <span className="bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                      P: {plan.macros?.protein}
                    </span>
                    <span className="bg-slate-50 px-3 py-1 rounded-md border border-slate-100">
                      C: {plan.macros?.carbs}
                    </span>
                  </div>
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
