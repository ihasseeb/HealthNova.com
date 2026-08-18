import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import healthProfileRoutes from "./routes/healthProfile.routes";
import aiRoutes from "./routes/ai.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import doctorRoutes from "./routes/doctor.routes";
import adminRoutes from "./routes/admin.routes";
import appointmentRoutes from "./routes/appointment.routes";
import prescriptionRoutes from "./routes/prescription.routes";
import chatRoutes from "./routes/chat.routes";
import paymentRoutes from "./routes/payment.routes";
import notificationRoutes from "./routes/notification.routes";
import medicalRecordRoutes from "./routes/medicalRecord.Routes";
const app: Application = express();

// CORS - Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://healthnovaai.up.railway.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.includes("*")
      ) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Test Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🚀 HealthNova AI Backend is running!",
    version: "1.0.0",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/health-profile", healthProfileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin/doctors", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
