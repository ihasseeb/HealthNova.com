import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  createPrescriptionSchema,
  CreatePrescriptionFormData,
} from "../../schemas/prescriptionSchema";
import { useCreatePrescription } from "../../hooks/usePrescription";
import { useNavigate } from "react-router-dom";

const CreatePrescription = () => {
  const navigate = useNavigate();
  const { mutate: issuePrescription, isPending } = useCreatePrescription();

  // React Hook Form with Zod Resolver
  const {
    register,
    control,
    handleSubmit,
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

  // Dynamic Array for Medicines
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const onSubmit = (data: CreatePrescriptionFormData) => {
    issuePrescription(data, {
      onSuccess: () => {
        navigate("/doctor/dashboard");
      },
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
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span>📋</span> Issue Digital Prescription
          </h1>
          <p className="text-white/90 text-sm mt-1">
            Fill out patient diagnosis and medicine schedule
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-emerald-100 space-y-6"
        >
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
                placeholder="Describe patient's condition/symptoms..."
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
              <div
                key={field.id}
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
                      placeholder="e.g. Paracetamol"
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
                      placeholder="e.g. 500mg"
                      {...register(`medicines.${index}.dosage` as const)}
                      className="h-9 text-xs mt-1"
                    />
                    {errors.medicines?.[index]?.dosage && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {errors.medicines[index]?.dosage?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs">Frequency *</Label>
                    <Input
                      placeholder="e.g. Twice daily"
                      {...register(`medicines.${index}.frequency` as const)}
                      className="h-9 text-xs mt-1"
                    />
                    {errors.medicines?.[index]?.frequency && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {errors.medicines[index]?.frequency?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs">Duration *</Label>
                    <Input
                      placeholder="e.g. 5 Days"
                      {...register(`medicines.${index}.duration` as const)}
                      className="h-9 text-xs mt-1"
                    />
                    {errors.medicines?.[index]?.duration && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {errors.medicines[index]?.duration?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Instructions (Optional)</Label>
                  <Input
                    placeholder="e.g. Take after meal"
                    {...register(`medicines.${index}.instructions` as const)}
                    className="h-9 text-xs mt-1"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="pt-4 border-t border-slate-200">
            <Label>Additional Doctor Notes</Label>
            <textarea
              placeholder="Any special diet or rest recommendations..."
              {...register("notes")}
              className="w-full min-h-[70px] p-3 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold"
          >
            {isPending ? "Issuing..." : "📋 Send Prescription to Patient"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePrescription;
