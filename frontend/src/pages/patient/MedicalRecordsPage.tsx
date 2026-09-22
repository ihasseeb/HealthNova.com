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
import {
  FileBox,
  UploadCloud,
  Trash2,
  ExternalLink,
  Filter,
} from "lucide-react";

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setValue("fileType", file.name.split(".").pop() || "pdf");
    setValue("fileSize", file.size);

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
    { value: "", label: "All Documents" },
    { value: "LAB_REPORT", label: "Lab Reports" },
    { value: "XRAY", label: "X-Rays / Imaging" },
    { value: "MRI", label: "MRI / CT Scans" },
    { value: "PRESCRIPTION", label: "Prescriptions" },
    { value: "VACCINATION", label: "Vaccinations" },
    { value: "GENERAL", label: "General Docs" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center border border-primary-100">
              <FileBox size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Medical Records Vault
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Centralized cloud storage for your diagnostic & clinical
                documents
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="w-full md:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold h-12"
          >
            {showUploadForm ? "Close Form" : "Upload Document"}
          </Button>
        </div>

        {/* Upload Form Card */}
        {showUploadForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 space-y-6"
          >
            <h3 className="font-bold text-lg text-slate-900">
              Upload Clinical Document
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Title *
                </Label>
                <Input
                  placeholder="e.g. Blood Test Result - July"
                  {...register("title")}
                  className="h-12 bg-slate-50/50 rounded-xl"
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Category *
                </Label>
                <select
                  {...register("category")}
                  className="w-full h-12 px-4 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                >
                  <option value="LAB_REPORT">Lab Report</option>
                  <option value="XRAY">X-Ray</option>
                  <option value="MRI">MRI / CT Scan</option>
                  <option value="PRESCRIPTION">Prescription</option>
                  <option value="VACCINATION">Vaccination</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Notes / Description
                </Label>
                <textarea
                  placeholder="Additional context or doctor notes..."
                  {...register("description")}
                  className="w-full min-h-[90px] p-4 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">
                  Select File *
                </Label>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  className="h-12 bg-slate-50/50 rounded-xl cursor-pointer pt-2"
                />
                {errors.fileUrl && (
                  <p className="text-xs text-red-500">Please attach a file</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={uploadMutation.isPending}
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl"
            >
              {uploadMutation.isPending ? "Uploading..." : "Save to Vault"}
            </Button>
          </motion.form>
        )}

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.value
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        {records.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-200/60">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FileBox size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Vault Empty</h3>
            <p className="text-slate-500 text-sm mt-1">
              No documents found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {records.map((rec: any) => (
              <motion.div
                key={rec.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-100">
                      <FileBox size={20} />
                    </div>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {rec.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">
                    {rec.description || "No description provided"}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 text-[10px]">
                    {new Date(rec.createdAt).toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </span>

                  <div className="flex items-center gap-3">
                    <a
                      href={rec.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-600 hover:text-primary-700 flex items-center gap-1 font-bold"
                    >
                      View <ExternalLink size={12} />
                    </a>
                    <button
                      onClick={() => deleteMutation.mutate(rec.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <Trash2 size={14} />
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
