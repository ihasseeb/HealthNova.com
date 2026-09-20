import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetHealthTimeline } from "../../hooks/useMedicalRecord";

const HealthTimelinePage = () => {
  const { data, isLoading } = useGetHealthTimeline();
  const [filter, setFilter] = useState<string>("ALL");

  const timeline: any[] = data?.data?.timeline || [];

  // Filter logic
  const filteredTimeline =
    filter === "ALL"
      ? timeline
      : timeline.filter((event) => event.type === filter);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "APPOINTMENT":
        return {
          icon: "🩺",
          label: "Consultation",
          bg: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "PRESCRIPTION":
        return {
          icon: "💊",
          label: "Prescription",
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "SYMPTOM_CHECK":
        return {
          icon: "🔍",
          label: "AI Symptom Check",
          bg: "bg-teal-100 text-teal-800 border-teal-200",
        };
      case "HEALTH_REPORT":
        return {
          icon: "📄",
          label: "Health Report",
          bg: "bg-cyan-100 text-cyan-800 border-cyan-200",
        };
      case "MOOD_LOG":
        return {
          icon: "🧠",
          label: "Mood Log",
          bg: "bg-purple-100 text-purple-800 border-purple-200",
        };
      default:
        return {
          icon: "📌",
          label: "Event",
          bg: "bg-slate-100 text-slate-800 border-slate-200",
        };
    }
  };

  const filterButtons = [
    { key: "ALL", label: "🌟 All Events" },
    { key: "APPOINTMENT", label: "🩺 Consultations" },
    { key: "PRESCRIPTION", label: "💊 Prescriptions" },
    { key: "SYMPTOM_CHECK", label: "🔍 AI Checks" },
    { key: "HEALTH_REPORT", label: "📄 Reports" },
    { key: "MOOD_LOG", label: "🧠 Mood Logs" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">📈</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
            <span>📈</span> EMR Medical History Timeline
          </h1>
          <p className="text-white/90 text-sm mt-1">
            Your unified chronological health journey & clinical records
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filter === btn.key
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-100"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Vertical Timeline */}
        {filteredTimeline.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow border border-emerald-100">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="text-xl font-bold text-slate-800">
              No History Recorded
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              No events found for this filter category.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-8 border-l-2 border-emerald-300 space-y-6 ml-2 md:ml-4">
            <AnimatePresence>
              {filteredTimeline.map((event, index) => {
                const badge = getEventBadge(event.type);

                return (
                  <motion.div
                    key={event.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative bg-white rounded-2xl p-5 shadow-sm border border-emerald-100 hover:shadow-md transition"
                  >
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[31px] md:-left-[39px] top-6 w-6 h-6 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center shadow-md">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                    </div>

                    {/* Card Top Header */}
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{badge.icon}</span>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base">
                          {event.title}
                        </h3>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Date */}
                    <p className="text-[11px] text-slate-400 font-medium mb-3">
                      🗓️{" "}
                      {new Date(event.date).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>

                    {/* Description */}
                    <div className="bg-slate-50 p-3 rounded-xl text-xs md:text-sm text-slate-600 leading-relaxed">
                      {event.description}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HealthTimelinePage;
