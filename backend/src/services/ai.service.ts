import axios from "axios";
import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";

// AI Service base URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

interface HealthProfileContext {
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
  activityLevel?: string | null;
  goal?: string | null;
  dietaryPreference?: string | null;
  allergies?: string[] | null;
  medicalConditions?: string[] | null;
  currentMedications?: string[] | null;
  targetWeight?: number | null;
}

interface AIServiceResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface SymptomCheckInput {
  symptoms: string[];
  duration?: string | null;
}

interface SymptomCheckRequest {
  symptoms: string[];
  duration?: string | null;
  age?: number | null;
  gender?: string | null;
  medicalConditions: string[];
  currentMedications: string[];
}

interface SymptomCheckAIResponse {
  severity: string;
  possibleCauses?: string[];
  recommendations?: string[];
  homeRemedies?: string[];
  whenToSeeDoctor?: string | null;
  warningSignsToWatch?: string[];
}

interface DietPlanRequest {
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
  activityLevel?: string | null;
  goal?: string | null;
  dietaryPreference?: string | null;
  allergies?: string[] | null;
  medicalConditions?: string[] | null;
  targetWeight?: number | null;
}

interface DietPlanAIResponse {
  dailyCalories: number;
  macros: Record<string, number>;
  waterIntake?: number | null;
  weeklyPlan: string[];
  tips?: string[];
  foodsToAvoid?: string[];
  supplements?: string[];
}

interface WorkoutPlanInput {
  location?: string;
  experience?: string;
}

interface WorkoutPlanRequest {
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
  activityLevel?: string | null;
  goal?: string | null;
  medicalConditions?: string[] | null;
  location: string;
  experience: string;
}

interface WorkoutPlanAIResponse {
  planName: string;
  duration: string;
  daysPerWeek: number;
  estimatedCaloriesBurn?: number | null;
  weeklySchedule: string[];
  tips?: string[];
  safetyNotes?: string[];
  nutritionAdvice?: string | null;
}

interface ChatInput {
  message: string;
}

interface ChatHistoryMessage {
  role: string;
  content: string;
}

interface ChatMessageRecord {
  role: string;
  content: string;
  createdAt?: Date | string;
}

interface ChatRequest {
  message: string;
  userProfile: HealthProfileContext | null;
  history: ChatHistoryMessage[];
}

interface ChatAIResponse {
  reply: string;
  suggestions?: string[];
  category?: string | null;
  needsDoctor?: boolean;
  urgency?: string | null;
}

// Create axios instance for AI service
const aiApi = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 60000, // 60 seconds (AI takes time)
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// SYMPTOM CHECKER
// ================================
export const symptomCheckService = async (
  userId: string,
  data: SymptomCheckInput,
) => {
  try {
    // 1. Get user's health profile for context
    const profile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    // 2. Handle symptoms (string or array)
    const symptomsText = Array.isArray(data.symptoms)
      ? data.symptoms.join(", ")
      : data.symptoms;

    // 2. Prepare AI request data
    const aiRequest = {
      symptoms: data.symptoms,
      duration: data.duration,
      age: profile?.age,
      gender: profile?.gender,
      medicalConditions: profile?.medicalConditions || [],
      currentMedications: profile?.currentMedications || [],
    };

    // 3. Call Flask AI service
    const aiResponse = await aiApi.post("/api/health/symptom-check", aiRequest);

    if (!aiResponse.data.success) {
      throw new AppError("AI analysis failed", 500);
    }

    const aiData = aiResponse.data.data;

    // 4. Save to database
    const symptomCheck = await prisma.symptomCheck.create({
      data: {
        userId,
        symptoms: symptomsText,

        duration: data.duration || null,
        severity: aiData.severity,
        possibleCauses: aiData.possibleCauses || [],
        recommendations: aiData.recommendations || [],
        homeRemedies: aiData.homeRemedies || [],
        whenToSeeDoctor: aiData.whenToSeeDoctor || null,
        warningSignsToWatch: aiData.warningSignsToWatch || [],
      },
    });

    return {
      id: symptomCheck.id,
      ...aiData,
      createdAt: symptomCheck.createdAt,
    };
  } catch (error: any) {
    if (error.response) {
      throw new AppError(
        error.response.data?.message || "AI service error",
        500,
      );
    }
    throw new AppError(error.message || "Symptom check failed", 500);
  }
};

// Get symptom check history
export const getSymptomHistoryService = async (userId: string) => {
  const history = await prisma.symptomCheck.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20, // Last 20
  });
  return history;
};

// ================================
// DIET PLAN
// ================================
export const dietPlanService = async (userId: string) => {
  try {
    // 1. Get user's health profile
    const profile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError("Please complete your health profile first", 400);
    }

    // 2. Prepare AI request
    const aiRequest = {
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      bmi: profile.bmi,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      dietaryPreference: profile.dietaryPreference,
      allergies: profile.allergies,
      medicalConditions: profile.medicalConditions,
      targetWeight: profile.targetWeight,
    };

    // 3. Call AI service
    const aiResponse = await aiApi.post("/api/health/diet-plan", aiRequest);

    if (!aiResponse.data.success) {
      throw new AppError("AI diet plan generation failed", 500);
    }

    const aiData = aiResponse.data.data;

    // 4. Save to database
    const dietPlan = await prisma.dietPlan.create({
      data: {
        userId,
        dailyCalories: aiData.dailyCalories,
        macros: aiData.macros,
        waterIntake: aiData.waterIntake || null,
        weeklyPlan: aiData.weeklyPlan,
        tips: aiData.tips || [],
        foodsToAvoid: aiData.foodsToAvoid || [],
        supplements: aiData.supplements || [],
      },
    });

    return {
      id: dietPlan.id,
      ...aiData,
      createdAt: dietPlan.createdAt,
    };
  } catch (error: any) {
    if (error.response) {
      throw new AppError(
        error.response.data?.message || "AI service error",
        500,
      );
    }
    throw new AppError(error.message || "Diet plan generation failed", 500);
  }
};

// Get diet plans history
export const getDietPlansService = async (userId: string) => {
  const plans = await prisma.dietPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return plans;
};

// ================================
// WORKOUT PLAN
// ================================
export const workoutPlanService = async (userId: string, data: any) => {
  try {
    const profile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new AppError("Please complete your health profile first", 400);
    }

    const aiRequest = {
      age: profile.age,
      gender: profile.gender,
      height: profile.height,
      weight: profile.weight,
      bmi: profile.bmi,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      medicalConditions: profile.medicalConditions,
      location: data.location || "HOME",
      experience: data.experience || "BEGINNER",
    };

    const aiResponse = await aiApi.post("/api/health/workout-plan", aiRequest);

    if (!aiResponse.data.success) {
      throw new AppError("AI workout plan generation failed", 500);
    }

    const aiData = aiResponse.data.data;

    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        userId,
        planName: aiData.planName,
        duration: aiData.duration,
        daysPerWeek: aiData.daysPerWeek,
        estimatedCaloriesBurn: aiData.estimatedCaloriesBurn || null,
        weeklySchedule: aiData.weeklySchedule,
        tips: aiData.tips || [],
        safetyNotes: aiData.safetyNotes || [],
        nutritionAdvice: aiData.nutritionAdvice || null,
      },
    });

    return {
      id: workoutPlan.id,
      ...aiData,
      createdAt: workoutPlan.createdAt,
    };
  } catch (error: any) {
    if (error.response) {
      throw new AppError(
        error.response.data?.message || "AI service error",
        500,
      );
    }
    throw new AppError(error.message || "Workout plan generation failed", 500);
  }
};

// Get workout plans history
export const getWorkoutPlansService = async (userId: string) => {
  const plans = await prisma.workoutPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return plans;
};

// ================================
// CHAT WITH AI
// ================================
export const chatService = async (userId: string, data: any) => {
  try {
    const profile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    // Get recent chat history for context
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const history = recentMessages
      .reverse()
      .map((msg: { role: any; content: any }) => ({
        role: msg.role,
        content: msg.content,
      }));

    const aiRequest = {
      message: data.message,
      userProfile: profile,
      history,
    };

    const aiResponse = await aiApi.post("/api/health/chat", aiRequest);

    if (!aiResponse.data.success) {
      throw new AppError("AI chat failed", 500);
    }

    const aiData = aiResponse.data.data;

    // Save user message
    await prisma.chatMessage.create({
      data: {
        userId,
        role: "user",
        content: data.message,
      },
    });

    // Save AI response
    const aiMessage = await prisma.chatMessage.create({
      data: {
        userId,
        role: "assistant",
        content: aiData.reply,
        category: aiData.category || null,
      },
    });

    return {
      id: aiMessage.id,
      reply: aiData.reply,
      suggestions: aiData.suggestions || [],
      category: aiData.category,
      needsDoctor: aiData.needsDoctor,
      urgency: aiData.urgency,
      createdAt: aiMessage.createdAt,
    };
  } catch (error: any) {
    if (error.response) {
      throw new AppError(
        error.response.data?.message || "AI service error",
        500,
      );
    }
    throw new AppError(error.message || "Chat failed", 500);
  }
};

// Get chat history
export const getChatHistoryService = async (userId: string) => {
  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
  return messages;
};

// Clear chat history
export const clearChatHistoryService = async (userId: string) => {
  await prisma.chatMessage.deleteMany({
    where: { userId },
  });
  return { message: "Chat history cleared" };
};

// ================================
// REPORT ANALYZER
// ================================
export const analyzeReportService = async (userId: string, data: any) => {
  try {
    const profile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    const aiRequest = {
      reportText: data.reportText,
      reportType: data.reportType || "General",
      userProfile: profile,
    };

    const aiResponse = await aiApi.post(
      "/api/health/analyze-report",
      aiRequest,
    );

    if (!aiResponse.data.success) {
      throw new AppError("AI report analysis failed", 500);
    }

    const aiData = aiResponse.data.data;

    // Save to database
    const report = await prisma.healthReport.create({
      data: {
        userId,
        reportType: data.reportType || "General",
        reportText: data.reportText,
        summary: aiData.summary,
        overallStatus: aiData.overallStatus,
        keyFindings: aiData.keyFindings || [],
        abnormalValues: aiData.abnormalValues || [],
        recommendations: aiData.recommendations || [],
        followUpNeeded: aiData.followUpNeeded || false,
        urgency: aiData.urgency || "LOW",
      },
    });

    return {
      id: report.id,
      ...aiData,
      createdAt: report.createdAt,
    };
  } catch (error: any) {
    if (error.response) {
      throw new AppError(
        error.response.data?.message || "AI service error",
        500,
      );
    }
    throw new AppError(error.message || "Report analysis failed", 500);
  }
};

// Get report history
export const getReportHistoryService = async (userId: string) => {
  const reports = await prisma.healthReport.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return reports;
};

// ================================
// HEALTH TIPS
// ================================
export const healthTipsService = async (userId: string, data: any) => {
  try {
    const profile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    const aiRequest = {
      userProfile: profile,
      category: data.category || "GENERAL",
    };

    const aiResponse = await aiApi.post("/api/health/health-tips", aiRequest);

    if (!aiResponse.data.success) {
      throw new AppError("AI health tips generation failed", 500);
    }

    return aiResponse.data.data;
  } catch (error: any) {
    if (error.response) {
      throw new AppError(
        error.response.data?.message || "AI service error",
        500,
      );
    }
    throw new AppError(error.message || "Health tips failed", 500);
  }
};

// ================================
// ANALYZE REPORT IMAGE
// ================================

export const analyzeReportImageService = async (userId: string, data: any) => {
  try {
    const profile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    const aiRequest = {
      image: data.image,
      reportType: data.reportType || "General",
      userProfile: profile,
    };

    const aiResponse = await aiApi.post(
      "/api/health/analyze-report-image",
      aiRequest,
      { timeout: 120000 }, // 2 min timeout for image
    );

    if (!aiResponse.data.success) {
      throw new AppError("AI image analysis failed", 500);
    }

    const aiData = aiResponse.data.data;

    // Save to database
    const report = await prisma.healthReport.create({
      data: {
        userId,
        reportType: data.reportType || "General",
        reportText: aiData.extractedText || "Image analyzed",
        summary: aiData.summary,
        overallStatus: aiData.overallStatus,
        keyFindings: aiData.keyFindings || [],
        abnormalValues: aiData.abnormalValues || [],
        recommendations: aiData.recommendations || [],
        followUpNeeded: aiData.followUpNeeded || false,
        urgency: aiData.urgency || "LOW",
      },
    });

    return {
      id: report.id,
      ...aiData,
      createdAt: report.createdAt,
    };
  } catch (error: any) {
    if (error.response) {
      throw new AppError(
        error.response.data?.message || "AI service error",
        500,
      );
    }
    throw new AppError(error.message || "Image analysis failed", 500);
  }
};
