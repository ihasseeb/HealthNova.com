import { z } from "zod";

// Create/Get Chat Room
export const createChatRoomSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID"),
});

// Send Message
export const sendMessageSchema = z.object({
  roomId: z.string().uuid("Invalid room ID"),
  content: z.string().min(1, "Message cannot be empty").max(2000),
  messageType: z.enum(["TEXT", "IMAGE", "FILE"]).default("TEXT"),
  attachmentUrl: z.string().url().optional(),
});

export type CreateChatRoomInput = z.infer<typeof createChatRoomSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
