// src/routes/ai.routes.ts (ya aapka existing AI controller)
import { Router, Request, Response } from "express";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";
import { AppError } from "../utils/AppError";

import {
  symptomCheck,
  getSymptomHistory,
  generateDietPlan,
  getDietPlans,
  generateWorkoutPlan,
  getWorkoutPlans,
  chat,
  getChatHistory,
  clearChatHistory,
  analyzeReport,
  getReportHistory,
  getHealthTips,
  analyzeReportImage,
  handlePreConsultation,
} from "../controllers/ai.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  symptomCheckSchema,
  workoutPlanSchema,
  chatSchema,
  analyzeReportSchema,
  healthTipsSchema,
} from "../validators/ai.validator";

const upload = multer();
const router = Router();

// 🟢 1. TEST ROUTE SABSE UPAR (Bina Auth Ke)
router.post("/triage-test", async (req: Request, res: Response) => {
  try {
    const { patientName, symptoms } = req.body;

    const n8nResponse = await fetch(
      "https://haseebkhan0085.app.n8n.cloud/webhook/health-query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: patientName || "Test Patient",
          symptoms: symptoms || "Mild head pain",
        }),
      },
    );

    const data = await n8nResponse.json();

    return res.status(200).json({
      success: true,
      source: "n8n_healthnova_agent",
      data: data,
    });
  } catch (error: any) {
    console.error("n8n Trigger Error:", error);
    return res.status(500).json({
      success: false,
      message: "n8n AI Service Error",
      error: error.message,
    });
  }
});
// Route directly in ai.routes.ts for simplicity
router.post("/voice-scribe", upload.single("audio"), async (req, res, next) => {
  try {
    if (!req.file) throw new AppError("No audio file uploaded", 400);

    // Create FormData to send to Flask
    const form = new FormData();
    form.append("audio", req.file.buffer, {
      filename: req.file.originalname || "audio.webm",
      contentType: req.file.mimetype,
    });

    // Call Flask AI Service
    const AI_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
    const aiResponse = await axios.post(
      `${AI_URL}/api/health/voice-scribe`,
      form,
      {
        headers: { ...form.getHeaders() },
        timeout: 60000,
      },
    );

    res.status(200).json(aiResponse.data);
  } catch (error) {
    next(error);
  }
});

// All routes require authentication
router.use(authenticate);

// SYMPTOM CHECKER
router.post("/symptom-check", validate(symptomCheckSchema), symptomCheck);
router.get("/symptom-history", getSymptomHistory);

// DIET PLAN
router.post("/diet-plan", generateDietPlan);
router.get("/diet-plans", getDietPlans);

// WORKOUT PLAN
router.post("/workout-plan", validate(workoutPlanSchema), generateWorkoutPlan);
router.get("/workout-plans", getWorkoutPlans);

// CHAT
router.post("/chat", validate(chatSchema), chat);
router.get("/chat-history", getChatHistory);
router.delete("/chat-history", clearChatHistory);

// REPORT ANALYZER
router.post("/analyze-report", validate(analyzeReportSchema), analyzeReport);
router.get("/report-history", getReportHistory);

// HEALTH TIPS
router.post("/health-tips", validate(healthTipsSchema), getHealthTips);

// ANALYZE REPORT IMAGE
router.post("/analyze-report-image", analyzeReportImage);

// PRE-CONSULTATION HPI
router.post("/pre-consultation", handlePreConsultation);
export default router;
