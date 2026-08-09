import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  useGetHealthProfile,
  useCreateHealthProfile,
  useUpdateHealthProfile,
} from "../hooks/useHealthProfile";

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

  // Fill form on edit
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
      updateProfile(payload, {
        onSuccess: () => setIsEditing(false),
      });
    } else {
      createProfile(payload);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { text: "Normal", color: "text-emerald-600" };
    if (bmi < 30) return { text: "Overweight", color: "text-yellow-600" };
    return { text: "Obese", color: "text-red-600" };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">⚕️</div>
      </div>
    );
  }

  // Show form if no profile OR editing
  if (!profile || isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white mb-6 shadow-2xl">
            <h1 className="text-4xl font-bold mb-2">
              {profile
                ? "✏️ Edit Health Profile"
                : "🩺 Setup Your Health Profile"}
            </h1>
            <p className="text-white/90">
              {profile
                ? "Update your health information"
                : "Help us personalize your experience"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 shadow-lg space-y-8"
          >
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                👤 Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age *</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="25"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full h-10 px-3 border rounded-md"
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Height (cm) *</Label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    placeholder="175"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Weight (kg) *</Label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    placeholder="70"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="w-full h-10 px-3 border rounded-md"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Target Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.targetWeight}
                    onChange={(e) =>
                      setFormData({ ...formData, targetWeight: e.target.value })
                    }
                    placeholder="68"
                  />
                </div>
              </div>
            </div>

            {/* Health Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                💪 Health Preferences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Activity Level *</Label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        activityLevel: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 border rounded-md"
                  >
                    <option value="SEDENTARY">Sedentary</option>
                    <option value="LIGHT">Light</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="ACTIVE">Active</option>
                    <option value="VERY_ACTIVE">Very Active</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Goal *</Label>
                  <select
                    value={formData.goal}
                    onChange={(e) =>
                      setFormData({ ...formData, goal: e.target.value })
                    }
                    className="w-full h-10 px-3 border rounded-md"
                  >
                    <option value="WEIGHT_LOSS">Weight Loss</option>
                    <option value="WEIGHT_GAIN">Weight Gain</option>
                    <option value="MAINTAIN">Maintain</option>
                    <option value="MUSCLE_GAIN">Muscle Gain</option>
                    <option value="IMPROVE_HEALTH">Improve Health</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Diet Preference *</Label>
                  <select
                    value={formData.dietaryPreference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dietaryPreference: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 border rounded-md"
                  >
                    <option value="VEG">Vegetarian</option>
                    <option value="NON_VEG">Non-Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="KETO">Keto</option>
                    <option value="PALEO">Paleo</option>
                    <option value="MEDITERRANEAN">Mediterranean</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                🏥 Medical Info
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Allergies (comma separated)</Label>
                  <Input
                    value={formData.allergies}
                    onChange={(e) =>
                      setFormData({ ...formData, allergies: e.target.value })
                    }
                    placeholder="Peanuts, Dust, Pollen"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Medical Conditions (comma separated)</Label>
                  <Input
                    value={formData.medicalConditions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medicalConditions: e.target.value,
                      })
                    }
                    placeholder="Diabetes, Hypertension"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-11 px-8"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : profile
                    ? "💾 Save Changes"
                    : "🎯 Create Profile"}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // View Mode
  const bmiCategory = getBMICategory(profile.bmi || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🩺 Health Profile</h1>
            <p className="text-white/90">Your health snapshot</p>
          </div>
          <Button
            onClick={handleEdit}
            className="bg-white text-emerald-600 hover:bg-slate-50"
          >
            ✏️ Edit Profile
          </Button>
        </div>

        {/* BMI Card */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="col-span-1 text-center">
              <p className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                {profile.bmi}
              </p>
              <p className="text-slate-500 mt-2">BMI</p>
              <p className={`font-bold mt-1 ${bmiCategory.color}`}>
                {bmiCategory.text}
              </p>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <div className="text-3xl mb-1">📏</div>
                <p className="text-2xl font-bold text-slate-800">
                  {profile.height}
                </p>
                <p className="text-sm text-slate-500">Height (cm)</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-xl text-center">
                <div className="text-3xl mb-1">⚖️</div>
                <p className="text-2xl font-bold text-slate-800">
                  {profile.weight}
                </p>
                <p className="text-sm text-slate-500">Weight (kg)</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-xl text-center">
                <div className="text-3xl mb-1">🎯</div>
                <p className="text-2xl font-bold text-slate-800">
                  {profile.targetWeight || "-"}
                </p>
                <p className="text-sm text-slate-500">Target (kg)</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              👤 Basic Info
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Age</span>
                <span className="font-semibold">{profile.age} years</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Gender</span>
                <span className="font-semibold">{profile.gender}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Blood Group</span>
                <span className="font-semibold">
                  {profile.bloodGroup || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              💪 Preferences
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Activity</span>
                <span className="font-semibold">{profile.activityLevel}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Goal</span>
                <span className="font-semibold">
                  {profile.goal.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Diet</span>
                <span className="font-semibold">
                  {profile.dietaryPreference.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              ⚠️ Allergies
            </h2>
            {profile.allergies && profile.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No allergies</p>
            )}
          </div>

          {/* Medical Conditions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              🏥 Medical Conditions
            </h2>
            {profile.medicalConditions &&
            profile.medicalConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.medicalConditions.map(
                  (condition: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                    >
                      {condition}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="text-slate-500">No conditions</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HealthProfile;
