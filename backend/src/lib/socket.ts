import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyAccessToken } from "../utils/jwt";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", process.env.FRONTEND_URL || ""],
      credentials: true,
    },
  });

  // Middleware: Authenticate socket connection
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = verifyAccessToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    console.log(`✅ User connected: ${user.email}`);

    // Join user to their personal room
    socket.join(`user:${user.userId}`);

    // Join a chat room
    socket.on("join_room", (roomId: string) => {
      socket.join(`room:${roomId}`);
      console.log(`User ${user.email} joined room ${roomId}`);
    });

    // Leave a chat room
    socket.on("leave_room", (roomId: string) => {
      socket.leave(`room:${roomId}`);
    });

    // Typing indicator
    socket.on("typing", ({ roomId, isTyping }) => {
      socket.to(`room:${roomId}`).emit("user_typing", {
        userId: user.userId,
        isTyping,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${user.email}`);
    });
  });

  console.log("✅ Socket.io initialized");
  return io;
};

// Emit to specific room
export const emitToRoom = (roomId: string, event: string, data: any) => {
  if (io) {
    io.to(`room:${roomId}`).emit(event, data);
  }
};

// Emit to specific user
export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export { io };
