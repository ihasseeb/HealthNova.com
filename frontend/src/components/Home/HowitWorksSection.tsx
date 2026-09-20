import { motion, type Variants } from "framer-motion";
import { UserPlus, BrainCircuit, Activity } from "lucide-react";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: <UserPlus size={32} strokeWidth={1.5} />,
      title: "Create Profile",
      description:
        "Sign up securely and input your basic health metrics (BMI, allergies, goals).",
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      number: "02",
      icon: <BrainCircuit size={32} strokeWidth={1.5} />,
      title: "AI Analysis",
      description:
        "Our intelligence engine instantly processes your symptoms or medical reports.",
      color: "text-accent-600",
      bg: "bg-accent-50",
    },
    {
      number: "03",
      icon: <Activity size={32} strokeWidth={1.5} />,
      title: "Get Treated",
      description:
        "Follow customized diet plans or book a live video consult with verified doctors.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <section className="px-4 md:px-8 lg:px-16 py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative Line connecting steps (Desktop only) */}
      <div className="hidden md:block absolute top-[60%] left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How HealthNova Works
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg font-medium">
            Three simple steps to unlock a personalized healthcare experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/50 hover:shadow-xl transition-all duration-300"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-6 left-8 bg-slate-900 text-white text-sm font-bold py-1.5 px-4 rounded-full shadow-lg">
                Step {step.number}
              </div>

              <div
                className={`w-16 h-16 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center mt-4 mb-6`}
              >
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
