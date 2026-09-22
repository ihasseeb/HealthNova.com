import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useGenerateWorkoutPlan, useWorkoutPlans } from "../../hooks/useAi";
import AILoadingScreen from "../../components/AILoadingScreen";
import {
  Dumbbell,
  Home,
  RotateCcw,
  AlertTriangle,
  Calendar,
  Flame,
} from "lucide-react";

const WorkoutPlan = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showForm, setShowForm] = useState(true);
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
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
              <Dumbbell size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                AI Workout Plan
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Personalized 7-day fitness routine
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowHistory(!showHistory);
              setShowForm(true);
            }}
            variant="outline"
            className="w-full md:w-auto rounded-xl font-semibold border-slate-200 text-slate-700"
          >
            {showHistory ? "← Create New" : "View History"}
          </Button>
        </div>

        {!showHistory ? (
          <>
            {isPending && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60 mt-6">
                <AILoadingScreen
                  emoji="💪"
                  title="Designing Your Routine..."
                  description="AI is structuring exercises based on your fitness level and goal."
                  steps={[
                    { icon: "📊", text: "Analyzing physical metrics" },
                    { icon: "🏋️", text: "Selecting optimal exercises" },
                    { icon: "📅", text: "Structuring weekly volume" },
                  ]}
                />
              </div>
            )}

            {!isPending && showForm && !currentPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200/60 max-w-2xl mx-auto mt-6"
              >
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Customize Parameters
                  </h2>
                  <p className="text-slate-500 text-sm mt-2">
                    Tell the AI where you train and your current level.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      Location
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["HOME", "GYM"].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setLocation(loc)}
                          className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${location === loc ? "border-slate-900 bg-slate-50 text-slate-900 font-bold shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                        >
                          {loc === "HOME" ? (
                            <Home size={20} />
                          ) : (
                            <Dumbbell size={20} />
                          )}{" "}
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                      Experience
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((exp) => (
                        <button
                          key={exp}
                          onClick={() => setExperience(exp)}
                          className={`p-4 rounded-xl border-2 transition-all text-xs sm:text-sm ${experience === exp ? "border-slate-900 bg-slate-50 text-slate-900 font-bold shadow-sm" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  className="w-full h-14 mt-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg transition-transform hover:-translate-y-1"
                >
                  Generate Routine
                </Button>
              </motion.div>
            )}

            {!isPending && currentPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 mt-6"
              >
                {/* Stats Header */}
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {currentPlan.planName}
                    </h2>
                    <div className="flex gap-3 mt-2">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">
                        {currentPlan.duration}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">
                        {currentPlan.daysPerWeek} Days/Week
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-50 px-4 py-3 rounded-xl border border-orange-100 flex items-center gap-3">
                    <Flame className="text-orange-500" size={24} />
                    <div>
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                        Est. Burn
                      </p>
                      <p className="text-lg font-extrabold text-slate-900 leading-none">
                        {currentPlan.estimatedCaloriesBurn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Day Selector */}
                <div className="bg-white rounded-[2rem] p-3 shadow-sm border border-slate-200/60 overflow-x-auto flex gap-2 hide-scrollbar">
                  {currentPlan.weeklySchedule?.map((day: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex flex-col items-center min-w-[100px] ${selectedDay === i ? "bg-slate-900 text-white shadow-md" : "bg-transparent text-slate-500 hover:bg-slate-100"}`}
                    >
                      <span>{day.day}</span>
                      <span
                        className={`text-[10px] mt-1 ${selectedDay === i ? "text-slate-300" : "text-slate-400"}`}
                      >
                        {day.focus}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Day Details */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {currentPlan.weeklySchedule[selectedDay]?.exercises
                      ?.length === 0 ? (
                      <div className="bg-white rounded-[2rem] p-16 shadow-sm border border-slate-200/60 text-center">
                        <div className="text-6xl mb-4">🧘</div>
                        <h3 className="text-2xl font-bold text-slate-900">
                          Active Recovery Day
                        </h3>
                        <p className="text-slate-500 mt-2">
                          Rest is crucial for muscle growth and central nervous
                          system recovery.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60">
                          <h3 className="text-lg font-bold text-slate-900 mb-4">
                            Workout Structure
                          </h3>
                          <div className="space-y-3">
                            {currentPlan.weeklySchedule[
                              selectedDay
                            ]?.exercises?.map((exercise: any, i: number) => (
                              <div
                                key={i}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4"
                              >
                                <div className="flex-1">
                                  <h4 className="font-bold text-slate-800 text-base">
                                    {i + 1}. {exercise.name}
                                  </h4>
                                  <p className="text-sm text-slate-500 mt-1">
                                    {exercise.instructions}
                                  </p>
                                </div>
                                <div className="flex sm:flex-col gap-2 sm:gap-1 shrink-0 text-xs font-bold text-slate-600 bg-white p-3 rounded-lg border border-slate-200 shadow-sm min-w-[120px]">
                                  <div className="flex justify-between w-full">
                                    <span>Sets:</span>{" "}
                                    <span className="text-slate-900">
                                      {exercise.sets}
                                    </span>
                                  </div>
                                  <div className="flex justify-between w-full">
                                    <span>Reps:</span>{" "}
                                    <span className="text-slate-900">
                                      {exercise.reps}
                                    </span>
                                  </div>
                                  <div className="flex justify-between w-full">
                                    <span>Rest:</span>{" "}
                                    <span className="text-slate-900">
                                      {exercise.rest}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Warmup & Cooldown Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60">
                            <h3 className="text-base font-bold text-slate-900 mb-3">
                              🔥 Warmup Protocol
                            </h3>
                            <ul className="space-y-2">
                              {currentPlan.weeklySchedule[
                                selectedDay
                              ]?.warmup?.map((item: string, i: number) => (
                                <li
                                  key={i}
                                  className="text-sm text-slate-600 flex items-start gap-2"
                                >
                                  <span className="text-slate-400">•</span>{" "}
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60">
                            <h3 className="text-base font-bold text-slate-900 mb-3">
                              ❄️ Cooldown Routine
                            </h3>
                            <ul className="space-y-2">
                              {currentPlan.weeklySchedule[
                                selectedDay
                              ]?.cooldown?.map((item: string, i: number) => (
                                <li
                                  key={i}
                                  className="text-sm text-slate-600 flex items-start gap-2"
                                >
                                  <span className="text-slate-400">•</span>{" "}
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Safety & Action */}
                <div className="bg-red-50/50 rounded-[2rem] p-6 border border-red-100 flex items-start gap-4">
                  <AlertTriangle
                    className="text-red-500 shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="font-bold text-red-900 mb-1">
                      Safety Protocols
                    </h3>
                    <p className="text-sm text-red-800/80 mb-3">
                      Maintain proper form over weight to prevent injuries.
                    </p>
                    <ul className="space-y-1 text-sm text-red-700 font-medium">
                      {currentPlan.safetyNotes?.map(
                        (note: string, i: number) => (
                          <li key={i}>- {note}</li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setShowForm(true);
                  }}
                  className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg transition-transform hover:-translate-y-1"
                >
                  <RotateCcw size={18} className="mr-2" /> Adjust Parameters
                </Button>
              </motion.div>
            )}
          </>
        ) : (
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
              </div>
            ) : (
              plans.map((plan: any) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex items-center justify-between hover:border-slate-300"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-bold text-slate-800 text-base">
                      {plan.planName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Est. Burn
                    </p>
                    <p className="font-bold text-orange-600">
                      {plan.estimatedCaloriesBurn}
                    </p>
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

export default WorkoutPlan;
