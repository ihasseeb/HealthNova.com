import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { emitToRoom } from "../lib/socket";
import type {
  CreateChatRoomInput,
  SendMessageInput,
} from "../validators/chat.validator";

// Create or Get Chat Room
export const createOrGetChatRoomService = async (
  patientId: string,
  data: CreateChatRoomInput,
) => {
  // Verify doctor exists
  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: data.doctorId },
  });

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  if (!doctor.isVerified) {
    throw new AppError("Doctor is not verified", 400);
  }

  // Check if room exists
  let room = await prisma.chatRoom.findUnique({
    where: {
      patientId_doctorId: {
        patientId,
        doctorId: data.doctorId,
      },
    },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  // Create if doesn't exist
  if (!room) {
    room = await prisma.chatRoom.create({
      data: {
        patientId,
        doctorId: data.doctorId,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });
  }

  return room;
};

// Get User's Chat Rooms
export const getUserChatRoomsService = async (userId: string) => {
  // Check if user is doctor
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  let rooms;

  if (doctorProfile) {
    // Doctor's rooms
    rooms = await prisma.chatRoom.findMany({
      where: { doctorId: doctorProfile.id },
      include: {
        patient: {
          select: { id: true, name: true, email: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Last message only
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });
  } else {
    // Patient's rooms
    rooms = await prisma.chatRoom.findMany({
      where: { patientId: userId },
      include: {
        doctor: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });
  }

  return rooms;
};

// Send Message
export const sendMessageService = async (
  senderId: string,
  data: SendMessageInput,
) => {
  // Verify room exists
  const room = await prisma.chatRoom.findUnique({
    where: { id: data.roomId },
  });

  if (!room) {
    throw new AppError("Chat room not found", 404);
  }

  // Verify sender is part of room (patient or doctor)
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: senderId },
  });

  const isPatient = room.patientId === senderId;
  const isDoctor = doctorProfile && room.doctorId === doctorProfile.id;

  if (!isPatient && !isDoctor) {
    throw new AppError("You don't have access to this chat", 403);
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      roomId: data.roomId,
      senderId,
      content: data.content,
      messageType: data.messageType,
      attachmentUrl: data.attachmentUrl,
    },
    include: {
      sender: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Update room's lastMessageAt
  await prisma.chatRoom.update({
    where: { id: data.roomId },
    data: { lastMessageAt: new Date() },
  });

  // Emit real-time to room
  emitToRoom(data.roomId, "new_message", message);

  return message;
};

// Get Messages in Room
export const getRoomMessagesService = async (
  userId: string,
  roomId: string,
) => {
  // Verify access
  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new AppError("Chat room not found", 404);
  }

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  const isPatient = room.patientId === userId;
  const isDoctor = doctorProfile && room.doctorId === doctorProfile.id;

  if (!isPatient && !isDoctor) {
    throw new AppError("Access denied", 403);
  }

  // Get messages
  const messages = await prisma.message.findMany({
    where: { roomId },
    include: {
      sender: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Mark as read (messages sent to this user)
  await prisma.message.updateMany({
    where: {
      roomId,
      senderId: { not: userId },
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return messages;
};
