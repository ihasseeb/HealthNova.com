import { Router } from "express";
import {
  createOrGetChatRoom,
  getMyChatRooms,
  sendMessage,
  getRoomMessages,
} from "../controllers/chat.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createChatRoomSchema,
  sendMessageSchema,
} from "../validators/chat.validator";

const router = Router();

router.use(authenticate);

router.post("/room", validate(createChatRoomSchema), createOrGetChatRoom);
router.get("/rooms", getMyChatRooms);
router.post("/message", validate(sendMessageSchema), sendMessage);
router.get("/room/:roomId/messages", getRoomMessages);

export default router;
