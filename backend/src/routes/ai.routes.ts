import { Router } from "express";
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
} from "../controllers/ai.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middlewares";
import {
  symptomCheckSchema,
  workoutPlanSchema,
  chatSchema,
  analyzeReportSchema,
  healthTipsSchema,
} from "../validators/ai.validator";

const router = Router();

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

export default router;
