import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  useGetDoctorProfile,
  useCreateDoctorProfile,
  useUpdateDoctorProfile,
} from "../../hooks/useDoctor";

const DoctorProfileSetup = () => {
  const { data, isLoading } = useGetDoctorProfile();
  const createProfile = useCreateDoctorProfile();
  const updateProfile = useUpdateDoctorProfile();

  const doctor = data?.data?.profile;

  const [formData, setFormData] = useState({
    specialization: doctor?.specialization || "",
    licenseNumber: doctor?.licenseNumber || "",
    experience: doctor?.experience || 0,
    qualifications: doctor?.qualifications?.join(", ") || "",
    consultationFee: doctor?.consultationFee || 0,
    bio: doctor?.bio || "",
    hospital: doctor?.hospital || "",
    address: doctor?.address || "",
    languages: doctor?.languages?.join(", ") || "English, Urdu",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      experience: Number(formData.experience),
      qualifications: formData.qualifications
        .split(",")
        .map((s: string) => s.trim()),
      consultationFee: Number(formData.consultationFee),
      bio: formData.bio,
      hospital: formData.hospital || undefined,
      address: formData.address || undefined,
      languages: formData.languages.split(",").map((s: string) => s.trim()),
    };

    if (doctor) {
      updateProfile.mutate(payload);
    } else {
      createProfile.mutate(payload);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">👨‍⚕️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            👨‍⚕️{" "}
            {doctor ? "Doctor Profile Settings" : "Doctor Profile Registration"}
          </h1>
          <p className="text-white/90 text-sm md:text-base">
            {doctor
              ? "Manage your professional medical details"
              : "Provide your medical credentials to get verified by Admin"}
          </p>
          {doctor && (
            <div className="mt-4 inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
              Status:{" "}
              {doctor.isVerified ? "✅ Verified" : "⏳ Pending Admin Approval"}
            </div>
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-lg space-y-6 border border-emerald-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label>Specialization *</Label>
              <Input
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                placeholder="e.g. Cardiologist"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Medical License Number *</Label>
              <Input
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                placeholder="e.g. MED-987654"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Years of Experience *</Label>
              <Input
                type="number"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Consultation Fee ($) *</Label>
              <Input
                type="number"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    consultationFee: Number(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Qualifications (comma separated) *</Label>
              <Input
                value={formData.qualifications}
                onChange={(e) =>
                  setFormData({ ...formData, qualifications: e.target.value })
                }
                placeholder="e.g. MBBS, MD, FCPS"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Professional Bio *</Label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full min-h-[100px] p-3 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Describe your background and medical expertise..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Hospital / Clinic Name</Label>
              <Input
                value={formData.hospital}
                onChange={(e) =>
                  setFormData({ ...formData, hospital: e.target.value })
                }
                placeholder="e.g. City General Hospital"
              />
            </div>

            <div className="space-y-2">
              <Label>Languages Spoken</Label>
              <Input
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                placeholder="e.g. English, Urdu"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createProfile.isPending || updateProfile.isPending}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold"
          >
            {createProfile.isPending || updateProfile.isPending
              ? "Saving..."
              : doctor
                ? "Update Profile"
                : "Submit for Verification"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default DoctorProfileSetup;
