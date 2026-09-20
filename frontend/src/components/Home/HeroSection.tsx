import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { HeartPulse, Footprints, Flame, Activity } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-4 md:px-8 lg:px-16 py-12 md:py-20 lg:py-24 bg-background">
      {/* Premium Background Glows */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:block absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, -40, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="hidden lg:block absolute top-40 -right-32 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* LEFT CONTENT: Copy & Call to Actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Tagline Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              The #1 AI Health Platform
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
            >
              Where Health Meets <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                Machine Intelligence.
              </span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-lg font-medium"
          >
            Experience personalized AI-driven diagnostics, custom diet plans,
            expert remote consultations, and continuous wellness tracking —
            unified in one intelligent ecosystem.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full h-14 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1">
                Start Your Journey
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-base hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Explore Features
            </Button>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/60"
          >
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
                50k+
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                Active Users
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
                500+
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                Specialists
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
                4.9/5
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
                App Rating
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT CONTENT: App UI Preview (Glassmorphism Card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative w-full max-w-lg mx-auto lg:max-w-none lg:pl-10"
        >
          {/* Main Floating Glass Card */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass-card rounded-[2rem] p-6 md:p-8 relative z-10"
          >
            {/* Health Score Header */}
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 shadow-sm border border-primary-200/50">
                  <Activity size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Health Score
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Live AI Assessment
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-primary-50 border border-primary-200/50 text-primary-700 text-xs font-bold rounded-full">
                Excellent 🎯
              </div>
            </div>

            {/* Score Display */}
            <div className="flex flex-col items-center justify-center mb-8">
              <span className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 tracking-tighter">
                94
              </span>
              <span className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">
                Out of 100
              </span>
            </div>

            {/* Metric Rows */}
            <div className="space-y-3">
              {[
                {
                  icon: <HeartPulse size={18} />,
                  label: "Heart Rate",
                  value: "72 BPM",
                  color: "text-rose-500",
                  bg: "bg-rose-50",
                },
                {
                  icon: <Footprints size={18} />,
                  label: "Daily Steps",
                  value: "8,432",
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
                {
                  icon: <Flame size={18} />,
                  label: "Calories Burned",
                  value: "1,850 kcal",
                  color: "text-orange-500",
                  bg: "bg-orange-50",
                },
              ].map((metric, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-white hover:shadow-sm transition-all cursor-default group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${metric.bg} ${metric.color}`}
                    >
                      {metric.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {metric.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating UI Elements (Decorative) */}
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-6 top-10 glass-card p-4 rounded-2xl z-20 flex items-center gap-3 hidden md:flex"
          >
            <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
              🤖
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">AI Diagnosis</p>
              <p className="text-[10px] text-slate-500 font-medium">
                Completed successfully
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
