import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center px-8 relative overflow-hidden">
      {/* Animated Blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 -left-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        {/* Big 404 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-6"
        >
          <h1 className="text-[180px] md:text-[240px] font-bold bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
        </motion.div>

        {/* Emoji */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, -10, 10, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🩺
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-slate-800 mb-4"
        >
          Oops! Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-slate-600 text-lg mb-8 max-w-md mx-auto"
        >
          Looks like this page took a sick day. Let's get you back to a healthy
          route!
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="h-14 px-8 text-base bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 shadow-xl shadow-emerald-200">
                🏠 Go Home
              </Button>
            </motion.div>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="h-14 px-8 text-base border-emerald-200 hover:bg-emerald-50"
            >
              ← Go Back
            </Button>
          </motion.div>
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100 max-w-md mx-auto"
        >
          <p className="text-sm text-slate-600">
            💡 <span className="font-semibold">Did you know?</span> Laughter
            really is good for your health!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
