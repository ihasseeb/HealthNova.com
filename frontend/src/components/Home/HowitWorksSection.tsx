import { motion, type Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.2 },
  }),
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      icon: "👥",
      title: "Create Account",
      description: "Sign up in seconds and set up your health profile.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      number: "2",
      icon: "🧠",
      title: "Get AI Analysis",
      description: "Our AI analyzes your data and provides insights.",
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      number: "3",
      icon: "✅",
      title: "Live Healthier",
      description: "Follow your personalized plan and track progress.",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <section className="px-8 lg:px-16 py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800">
            How It{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Get started in just three simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative bg-white rounded-2xl p-8 shadow-xl cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className={`absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl`}
              >
                {step.number}
              </motion.div>
              <div className="pt-6">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
