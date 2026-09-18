import prisma from "../lib/prisma";
import axios from "axios";
import { AppError } from "../utils/AppError";
import type { CreateMoodLogInput } from "../validators/mentalHealths.validator";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
const aiApi = axios.create({ baseURL: AI_SERVICE_URL });
const prismaClient = prisma as any;

export const logMoodService = async (
  userId: string,
  data: CreateMoodLogInput,
) => {
  try {
    // 1. Send data to Flask AI for therapeutic analysis
    const aiResponse = await aiApi.post("/api/health/mental-health", data);

    if (!aiResponse.data.success) {
      throw new AppError("AI mental health analysis failed", 500);
    }

    const aiData = aiResponse.data.data;

    // 2. Save everything to Database
    const moodLog = await prismaClient.moodLog.create({
      data: {
        userId,
        moodScore: data.moodScore,
        emotions: data.emotions,
        journalText: data.journalText || null,
        aiAnalysis: aiData.aiAnalysis,
        severity: aiData.severity,
      },
    });

    return {
      moodLog,
      aiFeedback: aiData,
    };
  } catch (error: any) {
    throw new AppError(error.message || "Failed to log mood", 500);
  }
};

export const getMoodHistoryService = async (userId: string) => {
  const history = await prismaClient.moodLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30, // Last 30 days
  });
  return history;
};
