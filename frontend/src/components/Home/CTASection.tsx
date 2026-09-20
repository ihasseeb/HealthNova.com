import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="px-4 md:px-8 lg:px-16 py-20 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 md:p-16 lg:p-20 text-center shadow-2xl"
        >
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to take control of <br className="hidden md:block" /> your
              health?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Join the ecosystem that is reshaping the future of digital
              healthcare. Fast, secure, and powered by next-gen AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto h-14 px-10 text-base bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                  Start Your Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-10 text-base bg-transparent border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 font-bold rounded-xl transition-colors"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
