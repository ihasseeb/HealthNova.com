import { z } from "zod";

// Mark Notification Read Schema
export const markNotificationReadSchema = z.object({
  notificationId: z.string().min(1, "Notification ID is required"),
});

export type MarkNotificationReadInput = z.infer<
  typeof markNotificationReadSchema
>;
