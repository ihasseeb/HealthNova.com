import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import healthProfileRoutes from "./routes/healthProfile.routes";

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
// 404 Handler (must be after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be LAST)
app.use(errorHandler);

export default app;
