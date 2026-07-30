import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    appointments: true,
    healthTips: false,
    marketing: false,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "English",
    units: "Metric",
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success("Setting updated!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            ⚙️ Settings
          </h1>
          <p className="text-slate-500">
            Manage your preferences and account settings
          </p>
        </div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            🔔 Notifications
          </h2>

          <div className="space-y-4">
            {[
              {
                key: "email",
                label: "Email Notifications",
                desc: "Receive updates via email",
              },
              {
                key: "push",
                label: "Push Notifications",
                desc: "Get instant push alerts",
              },
              {
                key: "appointments",
                label: "Appointment Reminders",
                desc: "Never miss appointments",
              },
              {
                key: "healthTips",
                label: "Daily Health Tips",
                desc: "Get daily wellness tips",
              },
              {
                key: "marketing",
                label: "Marketing Emails",
                desc: "Promotional content",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    toggleNotification(item.key as keyof typeof notifications)
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications]
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  }`}
                >
                  <motion.div
                    animate={{
                      x: notifications[item.key as keyof typeof notifications]
                        ? 28
                        : 2,
                    }}
                    transition={{ type: "spring", stiffness: 500 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            🎨 Preferences
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="font-semibold text-slate-800 mb-3">Theme</p>
              <div className="flex gap-2">
                {["light", "dark", "auto"].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setPreferences({ ...preferences, theme })}
                    className={`px-4 py-2 rounded-lg capitalize transition ${
                      preferences.theme === theme
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "🔄"}{" "}
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="font-semibold text-slate-800 mb-3">Language</p>
              <div className="flex gap-2 flex-wrap">
                {["English", "Urdu", "Arabic"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() =>
                      setPreferences({ ...preferences, language: lang })
                    }
                    className={`px-4 py-2 rounded-lg transition ${
                      preferences.language === lang
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="font-semibold text-slate-800 mb-3">
                Measurement Units
              </p>
              <div className="flex gap-2">
                {["Metric", "Imperial"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() =>
                      setPreferences({ ...preferences, units: unit })
                    }
                    className={`px-4 py-2 rounded-lg transition ${
                      preferences.units === unit
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {unit === "Metric"
                      ? "📏 Metric (kg, cm)"
                      : "📐 Imperial (lb, ft)"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">🔐 Security</h2>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-12 hover:bg-emerald-50"
            >
              🔑 Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-12 hover:bg-emerald-50"
            >
              📱 Two-Factor Authentication
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-12 hover:bg-emerald-50"
            >
              🖥️ Active Sessions
            </Button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-red-50 rounded-2xl p-8 shadow-lg border-2 border-red-100"
        >
          <h2 className="text-xl font-bold text-red-700 mb-2">
            ⚠️ Danger Zone
          </h2>
          <p className="text-sm text-red-600 mb-4">
            These actions cannot be undone.
          </p>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-12 border-red-200 text-red-600 hover:bg-red-100"
            >
              📥 Export My Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-12 border-red-200 text-red-600 hover:bg-red-100"
            >
              🗑️ Delete Account
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
