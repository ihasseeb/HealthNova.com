import { motion } from "framer-motion";

interface AILoadingScreenProps {
  emoji: string;
  title: string;
  description: string;
  steps: Array<{ icon: string; text: string }>;
  tip?: string;
}

const AILoadingScreen = ({
  emoji,
  title,
  description,
  steps,
  tip,
}: AILoadingScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-12 shadow-lg text-center"
    >
      {/* Animated Emoji */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity },
        }}
        className="text-8xl mb-6 inline-block"
      >
        {emoji}
      </motion.div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-slate-800 mb-3">{title}</h2>

      {/* Description */}
      <p className="text-slate-600 mb-8 max-w-md mx-auto">{description}</p>

      {/* Progress Steps */}
      <div className="max-w-md mx-auto space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.6 }}
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

      {/* Optional Tip */}
      {tip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200 max-w-md mx-auto"
        >
          <p className="text-sm text-yellow-800">
            💡 <strong>Did you know?</strong> {tip}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AILoadingScreen;
