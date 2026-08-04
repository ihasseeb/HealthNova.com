import { z } from "zod";

export const healthProfileSchema = z.object({
  age: z
    .number({ message: "Age is required" })
    .int("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select gender",
  }),
  height: z
    .number({ message: "Height is required" })
    .min(30, "Height must be at least 30 cm")
    .max(300, "Height must be less than 300 cm"),
  weight: z
    .number({ message: "Weight is required" })
    .min(1, "Weight must be at least 1 kg")
    .max(500, "Weight must be less than 500 kg"),
  bloodGroup: z.string().optional(),
  activityLevel: z.enum([
    "SEDENTARY",
    "LIGHT",
    "MODERATE",
    "ACTIVE",
    "VERY_ACTIVE",
  ]),
  goal: z.enum([
    "WEIGHT_LOSS",
    "WEIGHT_GAIN",
    "MAINTAIN",
    "MUSCLE_GAIN",
    "IMPROVE_HEALTH",
  ]),
  dietaryPreference: z.enum([
    "VEG",
    "NON_VEG",
    "VEGAN",
    "KETO",
    "PALEO",
    "MEDITERRANEAN",
  ]),
  allergies: z.array(z.string()).optional().default([]),
  medicalConditions: z.array(z.string()).optional().default([]),
  currentMedications: z.array(z.string()).optional().default([]),
  targetWeight: z.number().optional(),
});

export type HealthProfileFormData = z.infer<typeof healthProfileSchema>;
