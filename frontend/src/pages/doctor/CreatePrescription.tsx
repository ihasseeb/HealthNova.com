import { useState, useRef } from "react";
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
import { Mic, Square, Loader2, Sparkles } from "lucide-react";

const CreatePrescription = () => {
  const navigate = useNavigate();
  const { mutate: issuePrescription, isPending: isSaving } =
    useCreatePrescription();
  const { mutateAsync: processAudio, isPending: isAnalyzing } =
    useVoiceScribe();

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // React Hook Form Setup
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

  // 🎙️ START RECORDING
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = handleAudioStop;
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started. Speak now! 🎙️");
    } catch (err) {
      toast.error("Microphone access denied!");
    }
  };

  // ⏹️ STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // ⚙️ PROCESS AUDIO WITH AI
  const handleAudioStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    toast.loading("AI is transcribing and structuring your speech... 🧠", {
      id: "ai-scribe",
    });

    try {
      // Send audio blob to our new API
      const res = await processAudio(audioBlob);

      const { transcript, prescription } = res.data;
      toast.success("Prescription auto-filled successfully! ✨", {
        id: "ai-scribe",
      });

      // 💉 Auto-fill form fields using React Hook Form's setValue
      setValue("diagnosis", prescription.diagnosis || transcript);
      setValue("notes", prescription.notes || "");

      if (prescription.medicines && prescription.medicines.length > 0) {
        // Replace existing medicines with AI generated ones
        replace(prescription.medicines);
      }
    } catch (error) {
      toast.error("Failed to process audio", { id: "ai-scribe" });
    }
  };

  const onSubmit = (data: CreatePrescriptionFormData) => {
    issuePrescription(data, {
      onSuccess: () => navigate("/doctor/dashboard"),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span>📋</span> Issue Prescription
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Type manually or let AI Scribe listen to you
            </p>
          </div>

          {/* 🎙️ AI VOICE SCRIBE BUTTON */}
          <div className="relative">
            {isAnalyzing && (
              <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping" />
            )}
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
              className={`rounded-full w-14 h-14 md:w-auto md:h-12 flex items-center gap-2 shadow-lg transition-all ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : isAnalyzing
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isRecording ? (
                <>
                  <Square size={18} className="fill-current" />
                  <span className="hidden md:inline">Stop & Analyze</span>
                </>
              ) : isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span className="hidden md:inline">Processing...</span>
                </>
              ) : (
                <>
                  <Mic size={18} />
                  <span className="hidden md:inline">AI Voice Scribe</span>{" "}
                  <Sparkles size={16} className="text-amber-300" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-emerald-100 space-y-6 relative"
        >
          {/* Overlay while analyzing */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center"
              >
                <div className="bg-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-indigo-700 border border-indigo-100">
                  <Loader2 className="animate-spin" size={24} /> Generating
                  Prescription...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Patient ID & Diagnosis */}
          <div className="space-y-4">
            <div>
              <Label>Patient ID *</Label>
              <Input
                placeholder="Enter Patient UUID"
                {...register("patientId")}
                className="mt-1"
              />
              {errors.patientId && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.patientId.message}
                </p>
              )}
            </div>

            <div>
              <Label>Diagnosis *</Label>
              <textarea
                placeholder="Describe patient's condition... (Or use AI Voice Scribe)"
                {...register("diagnosis")}
                className="w-full min-h-[90px] p-3 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 mt-1"
              />
              {errors.diagnosis && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.diagnosis.message}
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Medicines Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                💊 Prescribed Medicines
              </h3>
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
                className="border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs"
              >
                + Add Medicine
              </Button>
            </div>

            {errors.medicines?.root && (
              <p className="text-xs text-red-500">
                {errors.medicines.root.message}
              </p>
            )}

            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-slate-500">
                    Medicine #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Medicine Name *</Label>
                    <Input
                      {...register(`medicines.${index}.medicineName` as const)}
                      className="h-9 text-xs mt-1"
                    />
                    {errors.medicines?.[index]?.medicineName && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {errors.medicines[index]?.medicineName?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs">Dosage *</Label>
                    <Input
                      {...register(`medicines.${index}.dosage` as const)}
                      className="h-9 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Frequency *</Label>
                    <Input
                      {...register(`medicines.${index}.frequency` as const)}
                      className="h-9 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Duration *</Label>
                    <Input
                      {...register(`medicines.${index}.duration` as const)}
                      className="h-9 text-xs mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Instructions (Optional)</Label>
                  <Input
                    {...register(`medicines.${index}.instructions` as const)}
                    className="h-9 text-xs mt-1"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Notes */}
          <div className="pt-4 border-t border-slate-200">
            <Label>Additional Doctor Notes</Label>
            <textarea
              {...register("notes")}
              className="w-full min-h-[70px] p-3 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving || isAnalyzing}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold"
          >
            {isSaving ? "Issuing..." : "📋 Send Prescription to Patient"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePrescription;
