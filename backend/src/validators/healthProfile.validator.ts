import { z } from "zod";

// Enums matching Prisma
const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
const ActivityLevelEnum = z.enum([
  "SEDENTARY",
  "LIGHT",
  "MODERATE",
  "ACTIVE",
  "VERY_ACTIVE",
]);
const HealthGoalEnum = z.enum([
  "WEIGHT_LOSS",
  "WEIGHT_GAIN",
  "MAINTAIN",
  "MUSCLE_GAIN",
  "IMPROVE_HEALTH",
]);
const DietPreferenceEnum = z.enum([
  "VEG",
  "NON_VEG",
  "VEGAN",
  "KETO",
  "PALEO",
  "MEDITERRANEAN",
]);

// Create Health Profile Schema
export const createHealthProfileSchema = z.object({
  age: z
    .number()
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  gender: GenderEnum,
  height: z
    .number()
    .min(30, "Height must be at least 30 cm")
    .max(300, "Height must be less than 300 cm"),
  weight: z
    .number()
    .min(1, "Weight must be at least 1 kg")
    .max(500, "Weight must be less than 500 kg"),
  bloodGroup: z.string().optional(),
  activityLevel: ActivityLevelEnum.default("MODERATE"),
  goal: HealthGoalEnum.default("MAINTAIN"),
  dietaryPreference: DietPreferenceEnum.default("NON_VEG"),
  allergies: z.array(z.string()).optional().default([]),
  medicalConditions: z.array(z.string()).optional().default([]),
  currentMedications: z.array(z.string()).optional().default([]),
  targetWeight: z.number().optional(),
});

// Update Health Profile Schema (all optional)
export const updateHealthProfileSchema = createHealthProfileSchema.partial();

// TypeScript types
export type CreateHealthProfileInput = z.infer<
  typeof createHealthProfileSchema
>;
export type UpdateHealthProfileInput = z.infer<
  typeof updateHealthProfileSchema
>;
