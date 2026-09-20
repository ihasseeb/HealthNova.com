import { motion, type Variants } from "framer-motion";
import {
  Brain,
  Stethoscope,
  Salad,
  HeartPulse,
  ShieldCheck,
  Clock,
} from "lucide-react";

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
      icon: <Brain size={24} strokeWidth={1.5} />,
      title: "AI Symptom Checker",
      description:
        "Get instant clinical analysis of your symptoms powered by our advanced medical LLM.",
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      icon: <Stethoscope size={24} strokeWidth={1.5} />,
      title: "Expert Consultations",
      description:
        "Connect with certified doctors via secure WebRTC video calls or real-time chat.",
      color: "text-accent-600",
      bg: "bg-accent-50",
    },
    {
      icon: <Salad size={24} strokeWidth={1.5} />,
      title: "Personalized Diet",
      description:
        "Custom meal plans engineered by AI to match your specific health goals and BMI.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: <HeartPulse size={24} strokeWidth={1.5} />,
      title: "Health Vault",
      description:
        "A centralized EMR timeline to store, manage, and share your complete medical history.",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      icon: <ShieldCheck size={24} strokeWidth={1.5} />,
      title: "Bank-Level Security",
      description:
        "Your sensitive health data is encrypted and protected by enterprise-grade Arcjet WAF.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: <Clock size={24} strokeWidth={1.5} />,
      title: "24/7 Availability",
      description:
        "Access your AI health assistant and medical records anytime, anywhere in the world.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <section className="px-4 md:px-8 lg:px-16 py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto">
            Everything you need for a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              healthier tomorrow.
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg font-medium">
            A complete ecosystem combining human medical expertise with
            cutting-edge artificial intelligence.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group p-8 bg-white rounded-[2rem] border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary-200 transition-all duration-300 cursor-default"
            >
              <div
                className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
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
