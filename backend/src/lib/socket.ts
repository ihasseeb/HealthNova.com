import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyAccessToken } from "../utils/jwt";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        process.env.FRONTEND_URL || "",
      ].filter(Boolean),
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
    console.log(`✅ User connected: ${user.email} (Socket: ${socket.id})`);

    // 1. Join Personal Room
    socket.join(`user:${user.userId}`);

    // ==========================================
    // 💬 CHAT EVENTS
    // ==========================================
    socket.on("join_room", (roomId: string) => {
      socket.join(`room:${roomId}`);
    });

    socket.on("leave_room", (roomId: string) => {
      socket.leave(`room:${roomId}`);
    });

    socket.on("typing", ({ roomId, isTyping }) => {
      socket.to(`room:${roomId}`).emit("user_typing", {
        userId: user.userId,
        isTyping,
      });
    });

    // ==========================================
    // 📹 VIDEO CONSULTATION (WebRTC) EVENTS
    // ==========================================

    // Doctor or Patient joins the video room for a specific appointment
    socket.on("join_video_room", (appointmentId: string) => {
      socket.join(`video:${appointmentId}`);
      console.log(`📹 User ${user.email} joined video room: ${appointmentId}`);
      // Notify others in the room that someone joined
      socket
        .to(`video:${appointmentId}`)
        .emit("user_joined_video", { userId: user.userId });
    });

    // Send WebRTC Offer
    socket.on("webrtc_offer", (data: { appointmentId: string; offer: any }) => {
      socket.to(`video:${data.appointmentId}`).emit("webrtc_offer", {
        offer: data.offer,
        from: user.userId,
      });
    });

    // Send WebRTC Answer
    socket.on(
      "webrtc_answer",
      (data: { appointmentId: string; answer: any }) => {
        socket.to(`video:${data.appointmentId}`).emit("webrtc_answer", {
          answer: data.answer,
          from: user.userId,
        });
      },
    );

    // Send ICE Candidates (Network routing info)
    socket.on(
      "webrtc_ice_candidate",
      (data: { appointmentId: string; candidate: any }) => {
        socket.to(`video:${data.appointmentId}`).emit("webrtc_ice_candidate", {
          candidate: data.candidate,
          from: user.userId,
        });
      },
    );

    // End Video Call
    socket.on("end_video_call", (appointmentId: string) => {
      socket.to(`video:${appointmentId}`).emit("video_call_ended");
      socket.leave(`video:${appointmentId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${user.email}`);
    });
  });

  console.log("✅ Socket.io initialized (Chat & WebRTC Ready)");
  return io;
};

// Utility to Emit to specific room from Express Controllers
export const emitToRoom = (roomId: string, event: string, data: any) => {
  if (io) {
    io.to(`room:${roomId}`).emit(event, data);
  }
};

// Utility to Emit to specific user
export const emitToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

export { io };
