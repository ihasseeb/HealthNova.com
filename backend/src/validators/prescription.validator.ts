import { z } from "zod";

// Medicine Schema (nested)
const medicineSchema = z.object({
  medicineName: z.string().min(2, "Medicine name required").max(100),

  dosage: z.string().min(1, "Dosage required").max(50),

  frequency: z.string().min(1, "Frequency required").max(100),

  duration: z.string().min(1, "Duration required").max(50),

  instructions: z.string().max(500).optional(),
});

// Create Prescription Schema
export const createPrescriptionSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  appointmentId: z.string().uuid("Invalid appointment ID").optional(),

  diagnosis: z.string().min(10, "Diagnosis must be detailed").max(2000),

  notes: z.string().max(2000).optional(),
  validUntil: z.string().optional(),

  medicines: z.array(medicineSchema).min(1, "At least one medicine required"),
});

// Update Prescription Schema
export const updatePrescriptionSchema = z.object({
  diagnosis: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
});

// Types
export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
export type UpdatePrescriptionInput = z.infer<typeof updatePrescriptionSchema>;
