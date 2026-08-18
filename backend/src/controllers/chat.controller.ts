import { Request, Response } from "express";
import {
  createOrGetChatRoomService,
  getUserChatRoomsService,
  sendMessageService,
  getRoomMessagesService,
} from "../services/chat.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Create/Get Chat Room
export const createOrGetChatRoom = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const room = await createOrGetChatRoomService(userId, req.body);
    return successResponse(res, 200, "Chat room ready", { room });
  },
);

// Get My Chat Rooms
export const getMyChatRooms = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const rooms = await getUserChatRoomsService(userId);
    return successResponse(res, 200, "Rooms fetched", { rooms });
  },
);

// Send Message (via REST - Socket.io will emit)
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const message = await sendMessageService(userId, req.body);
  return successResponse(res, 201, "Message sent", { message });
});

// Get Room Messages
export const getRoomMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { roomId } = req.params;
    const messages = await getRoomMessagesService(userId, roomId);
    return successResponse(res, 200, "Messages fetched", { messages });
  },
);
