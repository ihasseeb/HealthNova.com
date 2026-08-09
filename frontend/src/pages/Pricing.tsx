import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "3 AI symptom checks per month",
        "Basic health profile",
        "Community support",
        "Access to health tips",
        "Limited chat messages (10/day)",
      ],
      notIncluded: [
        "Personalized diet plans",
        "Workout plans",
        "Report analyzer",
        "Priority support",
      ],
      buttonText: "Get Started Free",
      popular: false,
      icon: "🌱",
    },
    {
      name: "Pro",
      price: "9.99",
      period: "per month",
      description: "Best for regular health tracking",
      features: [
        "Unlimited symptom checks",
        "Personalized diet plans",
        "Custom workout routines",
        "Unlimited AI chat",
        "5 report analyses per month",
        "Priority email support",
        "Health progress tracking",
      ],
      notIncluded: ["24/7 doctor consultation", "Family accounts"],
      buttonText: "Start Pro Trial",
      popular: true,
      icon: "⭐",
    },
    {
      name: "Premium",
      price: "19.99",
      period: "per month",
      description: "Complete health companion",
      features: [
        "Everything in Pro",
        "Unlimited report analyses",
        "24/7 doctor consultation",
        "Family accounts (up to 5)",
        "Custom meal plans",
        "Personal health coach",
        "Priority phone support",
        "Advanced health insights",
      ],
      notIncluded: [],
      buttonText: "Go Premium",
      popular: false,
      icon: "💎",
    },
  ];

  const handleSubscribe = (planName: string) => {
    if (planName === "Free") {
      toast.success("You're already on the Free plan! 🎉");
    } else {
      toast.success(`${planName} plan selected! Payment coming soon 💚`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-6xl mb-4"
          >
            💰
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the perfect plan for your health journey. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -8 }}
              className={`relative rounded-2xl p-8 shadow-lg transition ${
                plan.popular
                  ? "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-2xl scale-105 border-4 border-emerald-300"
                  : "bg-white border border-emerald-100 hover:shadow-2xl hover:border-emerald-300"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 text-xs font-bold px-4 py-1 rounded-full">
                  ⭐ MOST POPULAR
                </div>
              )}

              {/* Icon */}
              <div className="text-5xl mb-4 text-center">{plan.icon}</div>

              {/* Plan Name */}
              <h3
                className={`text-2xl font-bold text-center mb-2 ${
                  plan.popular ? "text-white" : "text-slate-800"
                }`}
              >
                {plan.name}
              </h3>

              {/* Description */}
              <p
                className={`text-center text-sm mb-6 ${
                  plan.popular ? "text-white/80" : "text-slate-500"
                }`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="text-center mb-6">
                <span
                  className={`text-5xl font-bold ${
                    plan.popular ? "text-white" : "text-emerald-600"
                  }`}
                >
                  ${plan.price}
                </span>
                <span
                  className={`text-sm ${
                    plan.popular ? "text-white/80" : "text-slate-500"
                  }`}
                >
                  /{plan.period}
                </span>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span
                      className={`text-lg ${
                        plan.popular ? "text-white" : "text-emerald-600"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-white/90" : "text-slate-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, j) => (
                  <div key={j} className="flex items-start gap-2 opacity-50">
                    <span
                      className={`text-lg ${
                        plan.popular ? "text-white" : "text-slate-400"
                      }`}
                    >
                      ✗
                    </span>
                    <span
                      className={`text-sm line-through ${
                        plan.popular ? "text-white/60" : "text-slate-400"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <Button
                onClick={() => handleSubscribe(plan.name)}
                className={`w-full h-12 font-semibold ${
                  plan.popular
                    ? "bg-white text-emerald-600 hover:bg-slate-50"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90"
                }`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            ❓ Frequently Asked Questions
          </h2>

          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-bold text-slate-800 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-slate-600 text-sm">
                Yes! You can cancel your subscription anytime. No questions
                asked.
              </p>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-bold text-slate-800 mb-2">
                Is my data secure?
              </h3>
              <p className="text-slate-600 text-sm">
                Absolutely! We use bank-level encryption to protect your health
                data.
              </p>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-bold text-slate-800 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-slate-600 text-sm">
                Yes, we offer a 30-day money-back guarantee on all paid plans.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">
                Can I upgrade later?
              </h3>
              <p className="text-slate-600 text-sm">
                Of course! You can upgrade or downgrade your plan at any time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white text-center shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2">Still have questions? 🤔</h2>
          <p className="text-white/90 mb-4">
            Our team is here to help you choose the right plan
          </p>
          <Button className="bg-white text-emerald-600 hover:bg-slate-50">
            💬 Contact Support
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Pricing;
