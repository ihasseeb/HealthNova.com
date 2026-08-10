import api from "./api";

// ================================
// SYMPTOM CHECKER
// ================================

export const symptomCheck = async (data: {
  symptoms: string;
  duration?: string;
}) => {
  const response = await api.post("ai/symptom-check", data);
  return response.data;
};

export const getSymptomHistory = async () => {
  const response = await api.get("ai/symptom-history");
  return response.data;
};

// ================================
// DIET PLAN
// ================================
export const generateDietPlan = async () => {
  const response = await api.post("ai/diet-plan");
  return response.data;
};

export const getDietPlan = async () => {
  const response = await api.get("ai/diet-plans");
  return response.data;
};

// ================================
// WORKOUT PLAN
// ================================
export const generateWorkoutPlan = async (data: {
  location?: string;
  experience?: string;
}) => {
  const response = await api.post("/ai/workout-plan", data);
  return response.data;
};

export const getWorkoutPlans = async () => {
  const response = await api.get("/ai/workout-plans");
  return response.data;
};

// ================================
// CHAT
// ================================
export const sendChatMessage = async (data: { message: string }) => {
  const response = await api.post("/ai/chat", data);
  return response.data;
};

export const getChatHistory = async () => {
  const response = await api.get("/ai/chat-history");
  return response.data;
};

export const clearChatHistory = async () => {
  const response = await api.delete("/ai/chat-history");
  return response.data;
};

// ================================
// REPORT ANALYZER
// ================================
export const analyzeReport = async (data: {
  reportType?: string;
  reportText: string;
}) => {
  const response = await api.post("/ai/analyze-report", data);
  return response.data;
};

export const getReportHistory = async () => {
  const response = await api.get("/ai/report-history");
  return response.data;
};

// ================================
// HEALTH TIPS
// ================================
export const getHealthTips = async (data: { category?: string }) => {
  const response = await api.post("/ai/health-tips", data);
  return response.data;
};

// ANALYZE REPORT IMAGE
export const analyzeReportImage = async (data: {
  image: string;
  reportType?: string;
}) => {
  const response = await api.post("/ai/analyze-report-image", data);
  return response.data;
};
