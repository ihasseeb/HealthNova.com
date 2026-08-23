import { z } from "zod";

// Single Medicine Schema
export const medicineSchema = z.object({
  medicineName: z
    .string()
    .min(2, "Medicine name must be at least 2 characters"),
  dosage: z.string().min(1, "Dosage is required (e.g. 500mg)"),
  frequency: z.string().min(1, "Frequency is required (e.g. 2x a day)"),
  duration: z.string().min(1, "Duration is required (e.g. 5 days)"),
  instructions: z.string().optional(),
});

// Create Prescription Schema
export const createPrescriptionSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  appointmentId: z.string().optional(),
  diagnosis: z
    .string()
    .min(5, "Diagnosis must be at least 5 characters")
    .max(1000, "Diagnosis too long"),
  notes: z.string().optional(),
  validUntil: z.string().optional(),
  medicines: z
    .array(medicineSchema)
    .min(1, "At least one medicine must be prescribed"),
});

// Types inferred from Zod Schemas
export type MedicineFormData = z.infer<typeof medicineSchema>;
export type CreatePrescriptionFormData = z.infer<
  typeof createPrescriptionSchema
>;
