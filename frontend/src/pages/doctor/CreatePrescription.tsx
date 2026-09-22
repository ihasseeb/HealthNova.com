import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  createPrescriptionSchema,
  CreatePrescriptionFormData,
} from "../../schemas/prescriptionSchema";
import { useCreatePrescription } from "../../hooks/usePrescription";
import { useVoiceScribe } from "../../hooks/useAi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FileSignature,
  Mic,
  Square,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";

const CreatePrescription = () => {
  const navigate = useNavigate();
  const { mutate: issuePrescription, isPending: isSaving } =
    useCreatePrescription();
  const { mutateAsync: processAudio, isPending: isAnalyzing } =
    useVoiceScribe();

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatePrescriptionFormData>({
    resolver: zodResolver(createPrescriptionSchema),
    defaultValues: {
      patientId: "",
      diagnosis: "",
      notes: "",
      medicines: [
        {
          medicineName: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "medicines",
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = handleAudioStop;
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started. Speak now! 🎙️");
    } catch {
      toast.error("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const handleAudioStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    toast.loading("AI is transcribing... 🧠", { id: "ai-scribe" });
    try {
      const res = await processAudio(audioBlob);
      const { transcript, prescription } = res.data;
      toast.success("Prescription auto-filled! ✨", { id: "ai-scribe" });
      setValue("diagnosis", prescription.diagnosis || transcript);
      setValue("notes", prescription.notes || "");
      if (prescription.medicines?.length > 0) replace(prescription.medicines);
    } catch {
      toast.error("Failed to process audio", { id: "ai-scribe" });
    }
  };

  const onSubmit = (data: CreatePrescriptionFormData) => {
    issuePrescription(data, { onSuccess: () => navigate("/doctor/dashboard") });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
              <FileSignature size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Issue Prescription
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Manual entry or AI Voice Scribe
              </p>
            </div>
          </div>

          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAnalyzing}
            className={`rounded-xl h-12 px-6 flex items-center gap-2 shadow-sm transition-all font-bold ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse text-white"
                : isAnalyzing
                  ? "bg-amber-100 text-amber-700 pointer-events-none"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            {isRecording ? (
              <>
                <Square size={16} className="fill-current" /> Stop
              </>
            ) : isAnalyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Processing
              </>
            ) : (
              <>
                <Mic size={16} /> AI Scribe{" "}
                <Sparkles size={14} className="text-amber-400 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-200/60 space-y-8 relative"
        >
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-[2rem] flex items-center justify-center"
              >
                <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-slate-800 border border-slate-100">
                  <Loader2
                    className="animate-spin text-primary-500"
                    size={24}
                  />{" "}
                  Generating Rx...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Patient ID *
              </Label>
              <Input
                {...register("patientId")}
                placeholder="UUID"
                className="h-12 bg-slate-50/50 rounded-xl"
              />
              {errors.patientId && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.patientId.message}
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Diagnosis *
              </Label>
              <textarea
                {...register("diagnosis")}
                placeholder="Clinical diagnosis..."
                className="w-full min-h-[100px] p-4 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
              />
              {errors.diagnosis && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.diagnosis.message}
                </p>
              )}
            </div>
          </div>

          {/* Medicines Array */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Medications</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    medicineName: "",
                    dosage: "",
                    frequency: "",
                    duration: "",
                    instructions: "",
                  })
                }
                className="rounded-xl border-slate-200 font-semibold text-xs"
              >
                <Plus size={14} className="mr-1" /> Add Med
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
                    Rx #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">
                      Medicine Name *
                    </Label>
                    <Input
                      {...register(`medicines.${index}.medicineName` as const)}
                      className="h-10 bg-white rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">
                      Dosage *
                    </Label>
                    <Input
                      {...register(`medicines.${index}.dosage` as const)}
                      placeholder="500mg"
                      className="h-10 bg-white rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">
                      Frequency *
                    </Label>
                    <Input
                      {...register(`medicines.${index}.frequency` as const)}
                      placeholder="1x daily"
                      className="h-10 bg-white rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">
                      Duration *
                    </Label>
                    <Input
                      {...register(`medicines.${index}.duration` as const)}
                      placeholder="5 Days"
                      className="h-10 bg-white rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-[10px] font-bold text-slate-500 uppercase">
                      Instructions
                    </Label>
                    <Input
                      {...register(`medicines.${index}.instructions` as const)}
                      placeholder="After meals"
                      className="h-10 bg-white rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Additional Notes
            </Label>
            <textarea
              {...register("notes")}
              className="w-full min-h-[80px] p-4 border border-slate-200 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving || isAnalyzing}
            className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-base shadow-lg shadow-primary-600/20"
          >
            {isSaving ? "Issuing..." : "Submit Prescription"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePrescription;
