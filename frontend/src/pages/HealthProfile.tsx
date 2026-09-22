import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  useGetHealthProfile,
  useCreateHealthProfile,
  useUpdateHealthProfile,
} from "../hooks/useHealthProfile";
import {
  User,
  Activity,
  Edit2,
  CheckCircle2,
  Ruler,
  Weight,
  Target,
} from "lucide-react";

const HealthProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading } = useGetHealthProfile();
  const { mutate: createProfile, isPending: isCreating } =
    useCreateHealthProfile();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateHealthProfile();

  const profile = data?.data?.profile;

  const [formData, setFormData] = useState({
    age: "",
    gender: "MALE",
    height: "",
    weight: "",
    bloodGroup: "",
    activityLevel: "MODERATE",
    goal: "MAINTAIN",
    dietaryPreference: "NON_VEG",
    allergies: "",
    medicalConditions: "",
    targetWeight: "",
  });

  const handleEdit = () => {
    if (profile) {
      setFormData({
        age: profile.age?.toString() || "",
        gender: profile.gender || "MALE",
        height: profile.height?.toString() || "",
        weight: profile.weight?.toString() || "",
        bloodGroup: profile.bloodGroup || "",
        activityLevel: profile.activityLevel || "MODERATE",
        goal: profile.goal || "MAINTAIN",
        dietaryPreference: profile.dietaryPreference || "NON_VEG",
        allergies: profile.allergies?.join(", ") || "",
        medicalConditions: profile.medicalConditions?.join(", ") || "",
        targetWeight: profile.targetWeight?.toString() || "",
      });
      setIsEditing(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      age: parseInt(formData.age),
      gender: formData.gender as any,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      bloodGroup: formData.bloodGroup || undefined,
      activityLevel: formData.activityLevel as any,
      goal: formData.goal as any,
      dietaryPreference: formData.dietaryPreference as any,
      allergies: formData.allergies
        ? formData.allergies.split(",").map((s) => s.trim())
        : [],
      medicalConditions: formData.medicalConditions
        ? formData.medicalConditions.split(",").map((s) => s.trim())
        : [],
      targetWeight: formData.targetWeight
        ? parseFloat(formData.targetWeight)
        : undefined,
    };

    if (profile) {
      updateProfile(payload, { onSuccess: () => setIsEditing(false) });
    } else {
      createProfile(payload);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5)
      return { text: "Underweight", color: "text-blue-600", bg: "bg-blue-50" };
    if (bmi < 25)
      return { text: "Normal", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (bmi < 30)
      return {
        text: "Overweight",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    return { text: "Obese", color: "text-red-600", bg: "bg-red-50" };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // View Mode
  if (profile && !isEditing) {
    const bmiCategory = getBMICategory(profile.bmi || 0);

    return (
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                <User size={28} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Clinical Profile
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  Your core health metrics and medical history
                </p>
              </div>
            </div>
            <Button
              onClick={handleEdit}
              className="w-full md:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold"
            >
              <Edit2 size={16} className="mr-2" /> Edit Profile
            </Button>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BMI Card */}
            <div
              className={`p-8 rounded-[2rem] border shadow-sm flex flex-col items-center justify-center ${bmiCategory.bg} border-white`}
            >
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                BMI Score
              </p>
              <p
                className={`text-6xl font-extrabold tracking-tighter ${bmiCategory.color}`}
              >
                {profile.bmi}
              </p>
              <div
                className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${bmiCategory.color} bg-white/50 backdrop-blur-md`}
              >
                {bmiCategory.text}
              </div>
            </div>

            {/* Metrics */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                  <Ruler size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Height</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {profile.height} cm
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                  <Weight size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Weight</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {profile.weight} kg
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                  <Target size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Target Weight
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {profile.targetWeight || "-"} kg
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Blood Group
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {profile.bloodGroup || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-primary-500" />{" "}
                Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-500">
                    Activity Level
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {profile.activityLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-medium text-slate-500">
                    Health Goal
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {profile.goal.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-slate-500">
                    Dietary Preference
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {profile.dietaryPreference.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Allergies
                </h3>
                {profile.allergies?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((a: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No known allergies</p>
                )}
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Medical Conditions
                </h3>
                {profile.medicalConditions?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.medicalConditions.map((c: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-bold"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No medical conditions reported
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Setup / Edit Form
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {profile ? "Update Health Profile" : "Complete Your Profile"}
          </h1>
          <p className="text-sm text-slate-500 mb-8 font-medium">
            Accurate data helps our AI provide safe and personalized health
            advice.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Age *
                </Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  required
                  className="h-12 bg-slate-50/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Gender *
                </Label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  required
                  className="w-full h-12 px-4 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Height (cm) *
                </Label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  required
                  className="h-12 bg-slate-50/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Weight (kg) *
                </Label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  required
                  className="h-12 bg-slate-50/50 rounded-xl"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Allergies (comma separated)
                </Label>
                <Input
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  placeholder="Peanuts, Penicillin..."
                  className="h-12 bg-slate-50/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Medical Conditions
                </Label>
                <Input
                  value={formData.medicalConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalConditions: e.target.value,
                    })
                  }
                  placeholder="Asthma, Diabetes..."
                  className="h-12 bg-slate-50/50 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
              >
                {isCreating || isUpdating ? "Saving..." : "Save Profile"}
              </Button>
              {profile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-12 rounded-xl font-bold"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthProfile;
