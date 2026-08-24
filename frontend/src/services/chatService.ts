import { io, Socket } from "socket.io-client";
import api from "./api";
import { SendMessageFormData, CreateRoomFormData } from "../schemas/chatSchema";

let socket: Socket | null = null;

// Initialize Socket.io Connection with JWT Token
// Double check your socket url!
export const connectSocket = (token: string) => {
  if (!socket) {
    // Railway par VITE_API_URL ka "api" hata kar root url socket ko dena hota hai
    const url =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000";
    socket = io(url, {
      auth: { token },
      transports: ["websocket"],
    });
    // ...

    socket.on("connect", () => {
      console.log("⚡ Connected to Socket.io Server:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.io Disconnected");
    });
  }
  return socket;
};

// Get Active Socket Instance
export const getSocket = () => socket;

// Disconnect Socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// REST API: Create or Get Room
export const createOrGetRoom = async (data: CreateRoomFormData) => {
  const response = await api.post("/chat/room", data);
  return response.data;
};

// REST API: Get My Chat Rooms
export const getMyRooms = async () => {
  const response = await api.get("/chat/rooms");
  return response.data;
};

// REST API: Get Messages in Room
export const getRoomMessages = async (roomId: string) => {
  const response = await api.get(`/chat/room/${roomId}/messages`);
  return response.data;
};

// REST API: Send Message (Saves to DB & Triggers Socket Emit in Backend)
export const sendChatMessage = async (data: SendMessageFormData) => {
  const response = await api.post("/chat/message", data);
  return response.data;
};
