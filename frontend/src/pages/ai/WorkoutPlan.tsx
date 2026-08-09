import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useGenerateWorkoutPlan, useWorkoutPlans } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";

const WorkoutPlan = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [location, setLocation] = useState("HOME");
  const [experience, setExperience] = useState("BEGINNER");

  const {
    mutate: generatePlan,
    isPending,
    data: result,
  } = useGenerateWorkoutPlan();
  const { data: historyData } = useWorkoutPlans();

  const plans = historyData?.data?.plans || [];
  const currentPlan = result?.data;

  const handleGenerate = () => {
    generatePlan({ location, experience });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-4 md:space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-4xl md:text-5xl flex-shrink-0">💪</span>
              <div className="min-w-0">
                <h1 className="text-xl md:text-3xl font-bold leading-tight">
                  AI Workout Plan
                </h1>
                <p className="text-white/90 text-xs md:text-base mt-1">
                  Personalized 7-day routine
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              size="sm"
              className="bg-white text-emerald-600 hover:bg-slate-50 flex-shrink-0 text-xs md:text-sm"
            >
              {showHistory ? "🏋️ New" : "📊 History"}
            </Button>
          </div>
        </div>

        {!showHistory ? (
          <>
            {isPending && (
              <AILoadingScreen
                emoji="💪"
                title="Building Your Workout..."
                description="AI is crafting a personalized 7-day routine"
                steps={[
                  { icon: "📊", text: "Analyzing fitness level" },
                  { icon: "🎯", text: "Setting goals" },
                  { icon: "🏋️", text: "Selecting exercises" },
                  { icon: "📅", text: "Creating schedule" },
                  { icon: "✨", text: "Adding safety notes" },
                ]}
                tip="Consistency beats intensity!"
              />
            )}

            {!isPending && !currentPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 md:p-8 shadow-lg"
              >
                <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 text-center">
                  🎯 Customize Your Workout
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="space-y-2 md:space-y-3">
                    <Label className="text-sm md:text-lg font-semibold">
                      Location
                    </Label>
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {["HOME", "GYM"].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setLocation(loc)}
                          className={`p-3 md:p-4 rounded-xl border-2 transition ${
                            location === loc
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="text-2xl md:text-3xl mb-1">
                            {loc === "HOME" ? "🏠" : "🏋️"}
                          </div>
                          <span className="text-xs md:text-base">{loc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Label className="text-sm md:text-lg font-semibold">
                      Experience
                    </Label>
                    <div className="space-y-2">
                      {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((exp) => (
                        <button
                          key={exp}
                          onClick={() => setExperience(exp)}
                          className={`w-full p-2 md:p-3 rounded-xl border-2 transition text-left text-sm md:text-base ${
                            experience === exp
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                              : "border-slate-200"
                          }`}
                        >
                          {exp === "BEGINNER" && "🌱 Beginner"}
                          {exp === "INTERMEDIATE" && "🔥 Intermediate"}
                          {exp === "ADVANCED" && "⚡ Advanced"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-sm md:text-lg font-semibold shadow-xl shadow-emerald-200"
                >
                  ✨ Generate AI Workout Plan
                </Button>
                <p className="text-xs text-slate-500 text-center mt-3 md:mt-4">
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
                <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg md:text-2xl font-bold text-slate-800">
                        {currentPlan.planName}
                      </h2>
                      <p className="text-xs md:text-base text-slate-500 mt-1">
                        {currentPlan.duration} • {currentPlan.daysPerWeek}{" "}
                        days/week
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-slate-500">Burn</p>
                      <p className="text-sm md:text-xl font-bold text-orange-600">
                        {currentPlan.estimatedCaloriesBurn}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 md:p-4 shadow-lg overflow-x-auto">
                  <div className="flex gap-2 min-w-max">
                    {currentPlan.weeklySchedule?.map((day: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold text-xs md:text-base transition whitespace-nowrap ${
                          selectedDay === i
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <div>{day.day}</div>
                        <div className="text-[10px] md:text-xs opacity-75 mt-0.5 md:mt-1">
                          {day.focus}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3 md:space-y-4"
                  >
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 md:p-6 text-white shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-xs md:text-sm">
                            Focus
                          </p>
                          <p className="text-lg md:text-2xl font-bold">
                            {currentPlan.weeklySchedule[selectedDay]?.focus}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/80 text-xs md:text-sm">
                            Duration
                          </p>
                          <p className="text-base md:text-xl font-bold">
                            {currentPlan.weeklySchedule[selectedDay]?.duration}
                          </p>
                        </div>
                      </div>
                    </div>

                    {currentPlan.weeklySchedule[selectedDay]?.exercises
                      ?.length > 0 && (
                      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                        <h3 className="text-base md:text-xl font-bold text-slate-800 mb-3 md:mb-4">
                          💪 Exercises
                        </h3>
                        <div className="space-y-3 md:space-y-4">
                          {currentPlan.weeklySchedule[
                            selectedDay
                          ]?.exercises?.map((exercise: any, i: number) => (
                            <div
                              key={i}
                              className="p-3 md:p-4 bg-slate-50 rounded-xl border-2 border-slate-100"
                            >
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <h4 className="text-sm md:text-lg font-bold text-slate-800 flex-1">
                                  {i + 1}. {exercise.name}
                                </h4>
                                <div className="flex flex-col gap-1 text-xs flex-shrink-0">
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold text-center">
                                    {exercise.sets} sets
                                  </span>
                                  <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full font-semibold text-center">
                                    {exercise.reps}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs md:text-sm text-slate-600 mb-2">
                                {exercise.instructions}
                              </p>
                              <p className="text-xs text-slate-500">
                                ⏱️ Rest: {exercise.rest}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {currentPlan.weeklySchedule[selectedDay]?.exercises
                      ?.length === 0 && (
                      <div className="bg-purple-50 rounded-2xl p-8 md:p-12 text-center border-2 border-purple-200">
                        <div className="text-5xl md:text-6xl mb-3">😴</div>
                        <h3 className="text-xl md:text-2xl font-bold text-purple-700">
                          Rest Day
                        </h3>
                        <p className="text-purple-600 mt-2 text-sm md:text-base">
                          Recover and prepare!
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <Button
                  onClick={() => generatePlan({ location, experience })}
                  className="w-full h-12 md:h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-sm md:text-lg"
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
                    {plan.planName}
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

export default WorkoutPlan;
