import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { useLogMood, useGetMoodHistory } from "../../hooks/useMentalHealth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AILoadingScreen from "../../components/AILoadingScreen";

const MOODS = [
  { score: 1, emoji: "😫", label: "Awful" },
  { score: 2, emoji: "🙁", label: "Bad" },
  { score: 3, emoji: "😐", label: "Okay" },
  { score: 4, emoji: "🙂", label: "Good" },
  { score: 5, emoji: "🤩", label: "Awesome" },
];

const EMOTIONS_LIST = [
  "Happy",
  "Anxious",
  "Stressed",
  "Calm",
  "Tired",
  "Energetic",
  "Sad",
  "Angry",
  "Grateful",
  "Overwhelmed",
];

const MentalHealth = () => {
  const [moodScore, setMoodScore] = useState<number>(3);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [journal, setJournal] = useState("");
  const [aiFeedback, setAiFeedback] = useState<any>(null);

  const { mutate: logMood, isPending } = useLogMood();
  const { data: historyData, isLoading } = useGetMoodHistory();

  const history = historyData?.data?.history || [];

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmotions.length === 0) return;

    logMood(
      { moodScore, emotions: selectedEmotions, journalText: journal },
      {
        onSuccess: (res) => {
          setAiFeedback(res.data?.aiFeedback);
          setMoodScore(3);
          setSelectedEmotions([]);
          setJournal("");
        },
      },
    );
  };

  // Prepare chart data (reverse to show chronological order)
  const chartData = [...history].reverse().map((log: any) => ({
    date: new Date(log.createdAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    score: log.moodScore,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">🧠</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header - Calming Purple Theme */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
              <span>🧠</span> Mental Health & Mood Tracker
            </h1>
            <p className="text-white/90 text-sm mt-2">
              Track your emotional well-being and get AI therapeutic guidance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Form */}
          <div className="space-y-6">
            {isPending ? (
              <AILoadingScreen
                emoji="🧠"
                title="AI Therapist is thinking..."
                description="Analyzing your journal entry and preparing compassionate guidance."
                steps={[
                  { icon: "📖", text: "Reading journal" },
                  { icon: "🤔", text: "Analyzing emotions" },
                  { icon: "💡", text: "Formulating coping strategies" },
                ]}
              />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 space-y-6"
              >
                {/* 1. Mood Score */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-4">
                    How are you feeling today?
                  </h3>
                  <div className="flex justify-between gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m.score}
                        type="button"
                        onClick={() => setMoodScore(m.score)}
                        className={`flex flex-col items-center p-2 md:p-3 rounded-2xl transition-all ${
                          moodScore === m.score
                            ? "bg-indigo-100 border-2 border-indigo-500 scale-110 shadow-md"
                            : "bg-slate-50 border-2 border-transparent hover:bg-slate-100 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                        }`}
                      >
                        <span className="text-3xl md:text-4xl mb-1">
                          {m.emoji}
                        </span>
                        <span className="text-[10px] md:text-xs font-semibold text-slate-600">
                          {m.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Emotions */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">
                    What emotions describe your mood? (Select at least 1) *
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {EMOTIONS_LIST.map((emo) => (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => toggleEmotion(emo)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                          selectedEmotions.includes(emo)
                            ? "bg-indigo-500 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Journal */}
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">
                    Daily Journal (Optional)
                  </h3>
                  <textarea
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    placeholder="Why do you feel this way? Write your thoughts..."
                    className="w-full min-h-[100px] p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={selectedEmotions.length === 0}
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 font-semibold shadow-lg"
                >
                  ✨ Save & Get AI Feedback
                </Button>
              </form>
            )}

            {/* AI Feedback Display */}
            <AnimatePresence>
              {aiFeedback && !isPending && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-indigo-50 rounded-2xl p-6 shadow-lg border-2 border-indigo-200"
                >
                  <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
                    🤖 AI Therapist Notes
                  </h3>
                  <p className="text-sm text-slate-700 italic mb-4 leading-relaxed">
                    "{aiFeedback.aiAnalysis}"
                  </p>

                  <div className="bg-white p-4 rounded-xl space-y-2 mb-4">
                    <h4 className="font-bold text-sm text-slate-800">
                      Coping Strategies:
                    </h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {aiFeedback.copingStrategies?.map(
                        (s: string, i: number) => (
                          <li key={i}>🌱 {s}</li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                    <p className="text-xs font-bold text-purple-800 uppercase mb-1">
                      Daily Affirmation
                    </p>
                    <p className="text-sm text-purple-900 font-medium">
                      "{aiFeedback.affirmation}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Charts & History */}
          <div className="space-y-6">
            {/* Chart Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
              <h3 className="font-bold text-slate-800 mb-4">📈 Mood Trend</h3>
              {chartData.length < 2 ? (
                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">
                  Log more days to see your trend chart
                </div>
              ) : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="date"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        strokeWidth={4}
                        dot={{ r: 4, fill: "#6366f1" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* History List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
              <h3 className="font-bold text-slate-800 mb-4">🕰️ Recent Logs</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {history.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    No logs yet.
                  </p>
                ) : (
                  history.map((log: any) => {
                    const moodEmoji = MOODS.find(
                      (m) => m.score === log.moodScore,
                    )?.emoji;
                    return (
                      <div
                        key={log.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{moodEmoji}</span>
                            <span className="text-xs text-slate-500 font-semibold">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {log.severity === "HIGH" && (
                            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full">
                              HIGH STRESS
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {log.emotions.map((e: string, i: number) => (
                            <span
                              key={i}
                              className="text-[10px] bg-white border px-2 py-0.5 rounded-full text-slate-600"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                        {log.journalText && (
                          <p className="text-xs text-slate-600 italic line-clamp-2">
                            "{log.journalText}"
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MentalHealth;
