import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { morganMiddleware } from "./middlewares/morgan.middleware";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware"; // ← IMPORT THIS

// All Routes
import authRoutes from "./routes/auth.routes";
import healthProfileRoutes from "./routes/healthProfile.routes";
import aiRoutes from "./routes/ai.routes";
import doctorRoutes from "./routes/doctor.routes";
import adminRoutes from "./routes/admin.routes";
import appointmentRoutes from "./routes/appointment.routes";
import prescriptionRoutes from "./routes/prescription.routes";
import paymentRoutes from "./routes/payment.routes";
import notificationRoutes from "./routes/notification.routes";
import medicalRecordRoutes from "./routes/medicalReports.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://welcoming-serenity-production.up.railway.app",
      "https://healthnovaai.up.railway.app",
      process.env.FRONTEND_URL || "",
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Stripe Webhook MUST be before express.json()
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Morgan Request Logger
app.use(morganMiddleware);

// 🛡️ ARCJET FIREWALL & RATE LIMITING (Global Protection)
app.use(arcjetMiddleware); // ← ADD THIS HERE

// Health Checks
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🚀 HealthNova AI Backend is running with Arcjet Protection!",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/health-profile", healthProfileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/doctor", doctorRoutes);
// Mount admin routes under /api/admin so controller paths (e.g. /doctors/pending)
// are reachable as /api/admin/doctors/pending in tests and production.
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
