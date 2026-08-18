import { z } from "zod";

// Enums matching Prisma
const AppointmentTypeEnum = z.enum(["IN_PERSON", "VIDEO_CALL", "PHONE_CALL"]);
const AppointmentStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

// Book Appointment Schema
export const bookAppointmentSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID"),

  appointmentDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),

  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),

  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),

  type: AppointmentTypeEnum.default("IN_PERSON"),

  reason: z
    .string()
    .min(10, "Reason must be at least 10 characters")
    .max(500, "Reason too long"),

  notes: z.string().max(1000).optional(),
});

// Update Appointment Status Schema (for doctor)
export const updateAppointmentSchema = z.object({
  status: AppointmentStatusEnum,
  notes: z.string().max(1000).optional(),
});

// Set Availability Schema (for doctor)
export const setAvailabilitySchema = z.object({
  slots: z.array(
    z.object({
      dayOfWeek: z
        .number()
        .int()
        .min(0, "Day must be 0-6")
        .max(6, "Day must be 0-6"),

      startTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time"),

      endTime: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time"),
    }),
  ),
});

// TypeScript types
export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>;
