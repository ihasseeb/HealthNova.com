import { z } from "zod";

// Create / Open Chat Room Schema
export const createRoomSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
});

// Send Message Schema
export const sendMessageSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message is too long (max 2000 chars)"),
  messageType: z.enum(["TEXT", "IMAGE", "FILE"]).default("TEXT"),
  attachmentUrl: z.string().url("Invalid URL").optional(),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
