import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  uploadRecordSchema,
  UploadRecordFormData,
} from "../../schemas/medicalRecordSchema";
import {
  useGetMyMedicalRecords,
  useUploadMedicalRecord,
  useDeleteMedicalRecord,
} from "../../hooks/useMedicalRecord";
import { toast } from "sonner";

const MedicalRecordsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);

  const { data, isLoading } = useGetMyMedicalRecords(selectedCategory);
  const uploadMutation = useUploadMedicalRecord();
  const deleteMutation = useDeleteMedicalRecord();

  const records = data?.data?.records || [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UploadRecordFormData>({
    resolver: zodResolver(uploadRecordSchema),
    defaultValues: {
      title: "",
      category: "GENERAL",
      description: "",
      fileUrl: "",
      fileType: "pdf",
      fileSize: 1024,
    },
  });

  // Handle Mock File Upload / Link Simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    // Set file metadata in Form
    setValue("fileType", file.name.split(".").pop() || "pdf");
    setValue("fileSize", file.size);

    // Mock Cloudinary URL for local simulation
    const mockUrl = URL.createObjectURL(file);
    setValue("fileUrl", mockUrl);
    toast.info("File attached successfully!");
  };

  const onSubmit = (formData: UploadRecordFormData) => {
    uploadMutation.mutate(formData, {
      onSuccess: () => {
        reset();
        setShowUploadForm(false);
      },
    });
  };

  const categories = [
    { value: "", label: "All Records" },
    { value: "LAB_REPORT", label: "🧪 Lab Reports" },
    { value: "XRAY", label: "🦴 X-Rays" },
    { value: "MRI", label: "🧠 MRI / CT" },
    { value: "PRESCRIPTION", label: "📋 Prescriptions" },
    { value: "VACCINATION", label: "💉 Vaccinations" },
    { value: "GENERAL", label: "📁 General" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">📁</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3">
              <span>📁</span> Medical Records Vault
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Store, view, and organize your health documents securely
            </p>
          </div>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-white text-emerald-600 hover:bg-slate-50 text-xs md:text-sm font-semibold"
          >
            {showUploadForm ? "❌ Close" : "📤 Upload Record"}
          </Button>
        </div>

        {/* Upload Form Modal/Card */}
        {showUploadForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 space-y-4"
          >
            <h3 className="font-bold text-lg text-slate-800">
              📤 Upload Document
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Document Title *</Label>
                <Input
                  placeholder="e.g. Blood Test Report July 2026"
                  {...register("title")}
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Category *</Label>
                <select
                  {...register("category")}
                  className="w-full h-10 px-3 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 mt-1"
                >
                  <option value="LAB_REPORT">🧪 Lab Report</option>
                  <option value="XRAY">🦴 X-Ray</option>
                  <option value="MRI">🧠 MRI / CT Scan</option>
                  <option value="PRESCRIPTION">📋 Prescription</option>
                  <option value="VACCINATION">💉 Vaccination</option>
                  <option value="GENERAL">📁 General</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Label>Description / Notes</Label>
                <textarea
                  placeholder="Additional notes about this report..."
                  {...register("description")}
                  className="w-full min-h-[70px] p-3 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Choose File *</Label>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-1 cursor-pointer"
                />
                {errors.fileUrl && (
                  <p className="text-xs text-red-500 mt-1">
                    Please select a valid file
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={uploadMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {uploadMutation.isPending ? "Uploading..." : "Save to Vault"}
            </Button>
          </motion.form>
        )}

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.value
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-white text-slate-600 hover:bg-emerald-50 border border-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Medical Records Grid */}
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow border border-emerald-100">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="text-xl font-bold text-slate-800">
              No Records Found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              You haven't uploaded any documents in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((rec: any) => (
              <motion.div
                key={rec.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-5 shadow border border-emerald-100 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">
                      {rec.category === "XRAY"
                        ? "🦴"
                        : rec.category === "LAB_REPORT"
                          ? "🧪"
                          : rec.category === "PRESCRIPTION"
                            ? "📋"
                            : "📄"}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {rec.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base line-clamp-1">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {rec.description || "No additional notes"}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    <a
                      href={rec.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      View 🔗
                    </a>
                    <button
                      onClick={() => deleteMutation.mutate(rec.id)}
                      className="text-xs text-red-500 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MedicalRecordsPage;
