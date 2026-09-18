import { Request, Response } from "express";
import {
  logMoodService,
  getMoodHistoryService,
} from "../services/mentalHealth.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Log Mood & Journal Entry
export const logMood = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await logMoodService(userId, req.body);
  return successResponse(res, 201, "Mood logged successfully", result);
});

// Get Mood History for Charts
export const getMoodHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const history = await getMoodHistoryService(userId);
    return successResponse(res, 200, "Mood history fetched", { history });
  },
);
