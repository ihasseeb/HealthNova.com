import { z } from "zod";

export const createDoctorProfileSchema = z.object({
  specialization: z.string().min(3, "Specialization required").max(100),

  licenseNumber: z.string().min(5, "License number required").max(50),

  experience: z.number().int().min(0, "Experience cannot be negative").max(70),

  qualifications: z
    .array(z.string())
    .min(1, "At least one qualification required"),

  consultationFee: z.number().min(0, "Fee cannot be negative"),

  bio: z.string().min(20, "Bio must be at least 20 characters").max(1000),

  // Optional fields
  profileImage: z.string().url("Invalid URL").optional(),
  languages: z.array(z.string()).optional(),
  hospital: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
});

// Update schema (all optional)
export const updateDoctorProfileSchema = createDoctorProfileSchema.partial();

// TypeScript types
export type CreateDoctorProfileInput = z.infer<
  typeof createDoctorProfileSchema
>;
export type UpdateDoctorProfileInput = z.infer<
  typeof updateDoctorProfileSchema
>;
