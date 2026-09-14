import { Request, Response, NextFunction } from "express";
import {
  symptomCheckService,
  getSymptomHistoryService,
  dietPlanService,
  getDietPlansService,
  workoutPlanService,
  getWorkoutPlansService,
  chatService,
  getChatHistoryService,
  clearChatHistoryService,
  analyzeReportService,
  getReportHistoryService,
  healthTipsService,
  analyzeReportImageService,
} from "../services/ai.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { N8nService } from "../services/n8n.service";

//n8n Service Example Usage
export const getAiTriage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { symptoms, age } = req.body;
    const patientName =
      (req.user as { name?: string } | undefined)?.name || "Patient";

    // Call n8n Workflow
    const aiResponse = await N8nService.triggerAiTriage({
      patientName,
      symptoms,
      age,
    });

    return res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    next(error);
  }
};

// ================================
// SYMPTOM CHECKER
// ================================
export const symptomCheck = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await symptomCheckService(userId, req.body);
    return successResponse(res, 200, "Symptoms analyzed successfully", result);
  },
);

export const getSymptomHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const history = await getSymptomHistoryService(userId);
    return successResponse(res, 200, "History fetched", { history });
  },
);

// ================================
// DIET PLAN
// ================================
export const generateDietPlan = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await dietPlanService(userId);
    return successResponse(
      res,
      200,
      "Diet plan generated successfully",
      result,
    );
  },
);

export const getDietPlans = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const plans = await getDietPlansService(userId);
    return successResponse(res, 200, "Diet plans fetched", { plans });
  },
);

// ================================
// WORKOUT PLAN
// ================================
export const generateWorkoutPlan = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await workoutPlanService(userId, req.body);
    return successResponse(
      res,
      200,
      "Workout plan generated successfully",
      result,
    );
  },
);

export const getWorkoutPlans = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const plans = await getWorkoutPlansService(userId);
    return successResponse(res, 200, "Workout plans fetched", { plans });
  },
);

// ================================
// CHAT
// ================================
export const chat = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await chatService(userId, req.body);
  return successResponse(res, 200, "Chat response generated", result);
});

export const getChatHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const messages = await getChatHistoryService(userId);
    return successResponse(res, 200, "Chat history fetched", { messages });
  },
);

export const clearChatHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await clearChatHistoryService(userId);
    return successResponse(res, 200, result.message);
  },
);

// ================================
// REPORT ANALYZER
// ================================
export const analyzeReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await analyzeReportService(userId, req.body);
    return successResponse(res, 200, "Report analyzed successfully", result);
  },
);

export const getReportHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const reports = await getReportHistoryService(userId);
    return successResponse(res, 200, "Reports fetched", { reports });
  },
);

// ================================
// HEALTH TIPS
// ================================
export const getHealthTips = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await healthTipsService(userId, req.body);
    return successResponse(res, 200, "Health tips generated", result);
  },
);

// ================================
// ANALYZE REPORT IMAGE
// ================================
export const analyzeReportImage = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await analyzeReportImageService(userId, req.body);
    return successResponse(
      res,
      200,
      "Report image analyzed successfully",
      result,
    );
  },
);
