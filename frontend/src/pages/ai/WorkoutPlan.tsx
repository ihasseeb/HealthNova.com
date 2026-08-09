import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useGenerateWorkoutPlan, useWorkoutPlans } from "../../hooks/useAi";

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

  // Loading Screen Component
  const LoadingScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-12 shadow-lg text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-8xl mb-6 inline-block"
      >
        💪
      </motion.div>

      <h2 className="text-3xl font-bold text-slate-800 mb-3">
        Creating Your Workout Plan...
      </h2>

      <p className="text-slate-600 mb-8 max-w-md mx-auto">
        Our AI is analyzing your profile and creating a personalized 7-day
        workout routine
      </p>

      {/* Progress Steps */}
      <div className="max-w-md mx-auto space-y-3">
        {[
          { icon: "📊", text: "Analyzing your fitness profile", delay: 0 },
          { icon: "🎯", text: "Setting your goals & preferences", delay: 1 },
          { icon: "🏋️", text: "Designing exercises for you", delay: 2 },
          { icon: "📅", text: "Creating 7-day schedule", delay: 3 },
          { icon: "✨", text: "Finalizing your plan", delay: 4 },
        ].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay * 0.8 }}
            className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl"
          >
            <span className="text-2xl">{step.icon}</span>
            <span className="text-slate-700 flex-1 text-left">{step.text}</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
            />
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200 max-w-md mx-auto"
      >
        <p className="text-sm text-yellow-800">
          💡 <strong>Did you know?</strong> Consistent exercise improves mental
          health, boosts energy, and helps you sleep better!
        </p>
      </motion.div>
    </motion.div>
  );

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
                <span className="text-5xl">💪</span>
                AI Workout Plan
              </h1>
              <p className="text-white/90">
                Personalized 7-day workout routine
              </p>
            </div>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-white text-emerald-600 hover:bg-slate-50"
            >
              {showHistory ? "🏋️ New Plan" : "📊 History"}
            </Button>
          </div>
        </div>

        {!showHistory ? (
          <>
            {/* LOADING STATE - Show loading screen while generating */}
            {isPending && <LoadingScreen />}

            {/* FORM - Show when not loading AND no result yet */}
            {!isPending && !currentPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                  🎯 Customize Your Workout
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Location */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">
                      Workout Location
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["HOME", "GYM"].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setLocation(loc)}
                          className={`p-4 rounded-xl border-2 transition ${
                            location === loc
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="text-3xl mb-1">
                            {loc === "HOME" ? "🏠" : "🏋️"}
                          </div>
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">
                      Experience Level
                    </Label>
                    <div className="space-y-2">
                      {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((exp) => (
                        <button
                          key={exp}
                          onClick={() => setExperience(exp)}
                          className={`w-full p-3 rounded-xl border-2 transition text-left ${
                            experience === exp
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                              : "border-slate-200 hover:border-slate-300"
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
                  disabled={isPending}
                  className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-lg font-semibold shadow-xl shadow-emerald-200"
                >
                  ✨ Generate AI Workout Plan
                </Button>
                <p className="text-xs text-slate-500 text-center mt-4">
                  Takes 10-20 seconds
                </p>
              </motion.div>
            )}

            {/* RESULT - Show workout plan */}
            {!isPending && currentPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Plan Header */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        {currentPlan.planName}
                      </h2>
                      <p className="text-slate-500 mt-1">
                        {currentPlan.duration} • {currentPlan.daysPerWeek}{" "}
                        days/week
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Calories Burn</p>
                      <p className="text-xl font-bold text-orange-600">
                        {currentPlan.estimatedCaloriesBurn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Day Selector */}
                <div className="bg-white rounded-2xl p-4 shadow-lg overflow-x-auto">
                  <div className="flex gap-2 min-w-max">
                    {currentPlan.weeklySchedule?.map((day: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(i)}
                        className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
                          selectedDay === i
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <div>{day.day}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {day.focus}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Day Details */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Day Overview */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm">Focus</p>
                          <p className="text-2xl font-bold">
                            {currentPlan.weeklySchedule[selectedDay]?.focus}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/80 text-sm">Duration</p>
                          <p className="text-xl font-bold">
                            {currentPlan.weeklySchedule[selectedDay]?.duration}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Warmup */}
                    {currentPlan.weeklySchedule[selectedDay]?.warmup?.length >
                      0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                          🔥 Warmup
                        </h3>
                        <div className="space-y-2">
                          {currentPlan.weeklySchedule[selectedDay]?.warmup?.map(
                            (item: string, i: number) => (
                              <div
                                key={i}
                                className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400"
                              >
                                {item}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Exercises */}
                    {currentPlan.weeklySchedule[selectedDay]?.exercises
                      ?.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                          💪 Exercises
                        </h3>
                        <div className="space-y-4">
                          {currentPlan.weeklySchedule[
                            selectedDay
                          ]?.exercises?.map((exercise: any, i: number) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 hover:border-emerald-300 transition"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg font-bold text-slate-800">
                                  {i + 1}. {exercise.name}
                                </h4>
                                <div className="flex gap-2 text-sm">
                                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                                    {exercise.sets} sets
                                  </span>
                                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full font-semibold">
                                    {exercise.reps}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">
                                {exercise.instructions}
                              </p>
                              <p className="text-xs text-slate-500">
                                ⏱️ Rest: {exercise.rest}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cooldown */}
                    {currentPlan.weeklySchedule[selectedDay]?.cooldown?.length >
                      0 && (
                      <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                          🧘 Cooldown
                        </h3>
                        <div className="space-y-2">
                          {currentPlan.weeklySchedule[
                            selectedDay
                          ]?.cooldown?.map((item: string, i: number) => (
                            <div
                              key={i}
                              className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rest Day */}
                    {currentPlan.weeklySchedule[selectedDay]?.exercises
                      ?.length === 0 && (
                      <div className="bg-purple-50 rounded-2xl p-12 text-center border-2 border-purple-200">
                        <div className="text-6xl mb-3">😴</div>
                        <h3 className="text-2xl font-bold text-purple-700">
                          Rest Day
                        </h3>
                        <p className="text-purple-600 mt-2">
                          Recover and prepare for tomorrow!
                        </p>
                      </div>
                    )}
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

                {/* Safety Notes */}
                {currentPlan.safetyNotes?.length > 0 && (
                  <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                    <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                      ⚠️ Safety Notes
                    </h3>
                    <div className="space-y-2">
                      {currentPlan.safetyNotes?.map(
                        (note: string, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-red-600">🚨</span>
                            <span>{note}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Nutrition Advice */}
                {currentPlan.nutritionAdvice && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      🍎 Nutrition Advice
                    </h3>
                    <p>{currentPlan.nutritionAdvice}</p>
                  </div>
                )}

                {/* Regenerate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isPending}
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
              📊 Past Workout Plans
            </h2>
            {plans.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-slate-500">No workout plans yet</p>
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
                        {plan.planName}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {plan.duration} • {plan.daysPerWeek} days/week
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WorkoutPlan;
