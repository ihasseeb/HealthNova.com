import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+92 342 0085940",
    age: "25",
    gender: "Male",
    weight: "70",
    height: "175",
    bloodGroup: "O+",
    address: "Islamabad, Pakistan",
  });

  const handleSave = () => {
    toast.success("Profile updated successfully! ✨");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />

          <div className="relative flex items-center gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-5xl border-4 border-white/30"
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </motion.div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
              <p className="text-white/90 mb-1">{user?.email}</p>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase">
                {user?.role}
              </span>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-emerald-600 hover:bg-slate-50"
            >
              {isEditing ? "❌ Cancel" : "✏️ Edit Profile"}
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">👤 Full Name</Label>
              <Input
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">📧 Email</Label>
              <Input
                disabled={!isEditing}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">📞 Phone</Label>
              <Input
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">🎂 Age</Label>
              <Input
                disabled={!isEditing}
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">⚧ Gender</Label>
              <Input
                disabled={!isEditing}
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                🩸 Blood Group
              </Label>
              <Input
                disabled={!isEditing}
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                ⚖️ Weight (kg)
              </Label>
              <Input
                disabled={!isEditing}
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">
                📏 Height (cm)
              </Label>
              <Input
                disabled={!isEditing}
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-slate-700 font-medium">📍 Address</Label>
              <Input
                disabled={!isEditing}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="h-11"
              />
            </div>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 mt-8 pt-6 border-t"
            >
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-11 px-8"
              >
                💾 Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="h-11 px-8"
              >
                Cancel
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Health Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-2">💪</div>
            <p className="text-3xl font-bold text-emerald-600">22.9</p>
            <p className="text-sm text-slate-500">BMI Score</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-3xl font-bold text-cyan-600">15</p>
            <p className="text-sm text-slate-500">Consultations</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-3xl font-bold text-teal-600">8</p>
            <p className="text-sm text-slate-500">Health Reports</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
