import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "🚀 HealthNova AI Backend is running!",
    version: "1.0.0",
  });
});

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

export default app;
