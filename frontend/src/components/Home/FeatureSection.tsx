import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const FeaturesSection = () => {
  const features = [
    {
      icon: "🧠",
      title: "AI Symptom Checker",
      description:
        "Get instant analysis of your symptoms with our advanced AI.",
      gradient: "from-emerald-400 to-emerald-600",
      bg: "from-emerald-50",
    },
    {
      icon: "👨‍⚕️",
      title: "Expert Consultations",
      description: "Connect with certified doctors and specialists anytime.",
      gradient: "from-teal-400 to-teal-600",
      bg: "from-teal-50",
    },
    {
      icon: "🥗",
      title: "Personalized Diet Plans",
      description: "Custom meal plans crafted by AI based on your goals.",
      gradient: "from-cyan-400 to-cyan-600",
      bg: "from-cyan-50",
    },
    {
      icon: "❤️",
      title: "Health Tracking",
      description: "Monitor vital signs and wellness metrics beautifully.",
      gradient: "from-rose-400 to-pink-600",
      bg: "from-rose-50",
    },
    {
      icon: "🛡️",
      title: "Secure & Private",
      description: "Your health data is encrypted with bank-level security.",
      gradient: "from-amber-400 to-orange-600",
      bg: "from-amber-50",
    },
    {
      icon: "⏰",
      title: "24/7 Availability",
      description: "Access health support anytime, day or night.",
      gradient: "from-purple-400 to-indigo-600",
      bg: "from-purple-50",
    },
  ];

  return (
    <section className="px-8 lg:px-16 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.span>
            <span className="text-sm font-semibold text-teal-700">
              Features
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800">
            Everything You Need,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Discover the powerful features that make HealthNova your perfect
            health companion.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`group p-8 bg-gradient-to-br ${feature.bg} to-white rounded-2xl border border-emerald-100 hover:shadow-2xl transition-all cursor-pointer`}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg text-2xl`}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
