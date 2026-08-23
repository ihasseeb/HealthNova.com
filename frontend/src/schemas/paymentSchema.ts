import { z } from "zod";

// Appointment Payment Schema
export const appointmentPaymentSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
});

// Subscription Plan Schema
export const subscriptionSchema = z.object({
  plan: z.enum(["PRO", "PREMIUM"], {
    message: "Please select a valid plan (PRO or PREMIUM)",
  }),
});

export type AppointmentPaymentFormData = z.infer<
  typeof appointmentPaymentSchema
>;
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
