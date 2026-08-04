import { z } from "zod";

// Symptom Check Schema
export const symptomCheckSchema = z.object({
  symptoms: z
    .string()
    .min(10, "Please describe symptoms in detail")
    .max(1000, "Symptoms description too long"),
  duration: z.string().optional(),
});

// Workout Plan Schema
export const workoutPlanSchema = z.object({
  location: z.enum(["HOME", "GYM"]).optional(),
  experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
});

// Chat Schema
export const chatSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message too long"),
});

// Analyze Report Schema
export const analyzeReportSchema = z.object({
  reportType: z.string().optional(),
  reportText: z
    .string()
    .min(20, "Report text too short")
    .max(10000, "Report text too long"),
});

// Health Tips Schema
export const healthTipsSchema = z.object({
  category: z
    .enum(["GENERAL", "DIET", "FITNESS", "MENTAL", "SLEEP"])
    .optional(),
});

// TypeScript types
export type SymptomCheckInput = z.infer<typeof symptomCheckSchema>;
export type WorkoutPlanInput = z.infer<typeof workoutPlanSchema>;
export type ChatInput = z.infer<typeof chatSchema>;
export type AnalyzeReportInput = z.infer<typeof analyzeReportSchema>;
export type HealthTipsInput = z.infer<typeof healthTipsSchema>;
