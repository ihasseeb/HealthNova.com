import api from "./api";

export interface MoodLogInput {
  moodScore: number; // 1 to 5
  emotions: string[];
  journalText?: string;
}

export const logMood = async (data: MoodLogInput) => {
  const response = await api.post("/mental-health", data);
  return response.data;
};

export const getMoodHistory = async () => {
  const response = await api.get("/mental-health/history");
  return response.data;
};
