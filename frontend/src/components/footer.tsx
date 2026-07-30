import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1 — Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-xl">
              💚
            </div>
            <div>
              <span className="text-xl font-bold text-white">HealthNova</span>
              <span className="text-xs text-emerald-400 font-semibold ml-1">
                AI
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Your AI-powered health companion. Get personalized insights, expert
            consultations, and 24/7 wellness support.
          </p>

          {/* Social Icons */}
          {/* <div className="flex gap-3 pt-2">
            <a
              href="#"
              className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition text-lg"
            >
              📘
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition text-lg"
            >
              🐦
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition text-lg"
            >
              📸
            </a>
            <a
              href="#"
              className="w-9 h-9 bg-slate-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition text-lg"
            >
              💼
            </a>
          </div> */}
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/"
                className="hover:text-emerald-400 transition duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/doctors"
                className="hover:text-emerald-400 transition duration-200"
              >
                Doctors
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-emerald-400 transition duration-200"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="hover:text-emerald-400 transition duration-200"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-emerald-400 transition duration-200"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 — Services */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Services
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="#"
                className="hover:text-emerald-400 transition duration-200"
              >
                🧠 AI Symptom Checker
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-emerald-400 transition duration-200"
              >
                🥗 Diet Plans
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-emerald-400 transition duration-200"
              >
                💪 Workout Plans
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-emerald-400 transition duration-200"
              >
                📊 Health Tracking
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-emerald-400 transition duration-200"
              >
                👨‍⚕️ Consultations
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 — Contact */}
        <div>
          <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400">📧</span>
              <span>ihaseeb0085@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400">📞</span>
              <span>+92 342 0085940</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400">📍</span>
              <span>Islamabad, Pakistan</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
          <p>© 2026 HealthNova AI. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Built with 💚 by{" "}
            <span className="text-emerald-400 font-semibold">Haseebi</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
