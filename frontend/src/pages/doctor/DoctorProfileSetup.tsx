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
import { UserCog, ShieldCheck } from "lucide-react";

interface DoctorProfile {
  specialization?: string;
  licenseNumber?: string;
  experience?: number | string;
  qualifications?: string[];
  consultationFee?: number | string;
  bio?: string;
  hospital?: string;
  address?: string;
  languages?: string[];
}

interface DoctorFormData {
  specialization: string;
  licenseNumber: string;
  experience: string;
  qualifications: string;
  consultationFee: string;
  bio: string;
  hospital: string;
  address: string;
  languages: string;
}

interface CreateDoctorPayload {
  specialization: string;
  licenseNumber: string;
  experience: number;
  qualifications: string[];
  consultationFee: number;
  bio: string;
  hospital?: string;
  address?: string;
  languages: string[];
}

const DoctorProfileSetup: React.FC = () => {
  const { data, isLoading } = useGetDoctorProfile();
  const createProfile = useCreateDoctorProfile();
  const updateProfile = useUpdateDoctorProfile();
  const doctor = data?.data?.profile as DoctorProfile | undefined;

  const [formData, setFormData] = useState<DoctorFormData>({
    specialization: doctor?.specialization || "",
    licenseNumber: doctor?.licenseNumber || "",
    experience: String(doctor?.experience ?? ""),
    qualifications: doctor?.qualifications?.join(", ") || "",
    consultationFee: String(doctor?.consultationFee ?? ""),
    bio: doctor?.bio || "",
    hospital: doctor?.hospital || "",
    address: doctor?.address || "",
    languages: doctor?.languages?.join(", ") || "English",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      specialization: formData.specialization,
      licenseNumber: formData.licenseNumber,
      experience: Number(formData.experience),
      qualifications: formData.qualifications.split(",").map((s) => s.trim()),
      consultationFee: Number(formData.consultationFee),
      bio: formData.bio,
      hospital: formData.hospital || undefined,
      address: formData.address || undefined,
      languages: formData.languages.split(",").map((s) => s.trim()),
    };

    if (doctor) updateProfile.mutate(payload);
    else createProfile.mutate(payload);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 flex items-center gap-5">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
            <UserCog size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {doctor ? "Profile Settings" : "Doctor Registration"}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {doctor
                ? "Update your clinical details"
                : "Provide credentials for admin verification"}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-200/60 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Specialization *
              </Label>
              <Input
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                placeholder="e.g. Cardiologist"
                required
                className="h-12 bg-slate-50/50 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Medical License No. *
              </Label>
              <Input
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                placeholder="MED-987654"
                required
                className="h-12 bg-slate-50/50 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Experience (Years) *
              </Label>
              <Input
                type="number"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                required
                className="h-12 bg-slate-50/50 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Consultation Fee ($) *
              </Label>
              <Input
                type="number"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({ ...formData, consultationFee: e.target.value })
                }
                required
                className="h-12 bg-slate-50/50 rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Qualifications *
              </Label>
              <Input
                value={formData.qualifications}
                onChange={(e) =>
                  setFormData({ ...formData, qualifications: e.target.value })
                }
                placeholder="MBBS, MD (Comma separated)"
                required
                className="h-12 bg-slate-50/50 rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Professional Bio *
              </Label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Describe your expertise..."
                required
                className="w-full min-h-[120px] p-4 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hospital / Clinic
              </Label>
              <Input
                value={formData.hospital}
                onChange={(e) =>
                  setFormData({ ...formData, hospital: e.target.value })
                }
                placeholder="City General Hospital"
                className="h-12 bg-slate-50/50 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Languages
              </Label>
              <Input
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                placeholder="English, Urdu"
                className="h-12 bg-slate-50/50 rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createProfile.isPending || updateProfile.isPending}
            className="w-full h-14 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg"
          >
            {createProfile.isPending || updateProfile.isPending
              ? "Processing..."
              : doctor
                ? "Save Changes"
                : "Submit Credentials"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default DoctorProfileSetup;
