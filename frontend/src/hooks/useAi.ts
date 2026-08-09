import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  symptomCheck,
  getSymptomHistory,
  generateDietPlan,
  getDietPlan,
  generateWorkoutPlan,
  getWorkoutPlans,
  sendChatMessage,
  getChatHistory,
  clearChatHistory,
  analyzeReport,
  getReportHistory,
  getHealthTips,
  analyzeReportImage,
} from "../services/ai-Service";
import { toast } from "sonner";

// ================================
// SYMPTOM CHECKER
// ================================
export const useSymptomCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: symptomCheck,
    onSuccess: () => {
      toast.success("Symptoms analyzed! 🩺");
      queryClient.invalidateQueries({ queryKey: ["symptomHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Analysis failed");
    },
  });
};

export const useSymptomHistory = () => {
  return useQuery({
    queryKey: ["symptomHistory"],
    queryFn: getSymptomHistory,
  });
};

// ================================
// DIET PLAN
// ================================
export const useGenerateDietPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateDietPlan,
    onSuccess: () => {
      toast.success("Diet plan generated! 🥗");
      queryClient.invalidateQueries({ queryKey: ["dietPlans"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Generation failed");
    },
  });
};

export const useDietPlans = () => {
  return useQuery({
    queryKey: ["dietPlans"],
    queryFn: getDietPlan,
  });
};

// ================================
// WORKOUT PLAN
// ================================
export const useGenerateWorkoutPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateWorkoutPlan,
    onSuccess: () => {
      toast.success("Workout plan generated! 💪");
      queryClient.invalidateQueries({ queryKey: ["workoutPlans"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Generation failed");
    },
  });
};

export const useWorkoutPlans = () => {
  return useQuery({
    queryKey: ["workoutPlans"],
    queryFn: getWorkoutPlans,
  });
};

// ================================
// CHAT
// ================================
export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Message failed");
    },
  });
};

export const useChatHistory = () => {
  return useQuery({
    queryKey: ["chatHistory"],
    queryFn: getChatHistory,
  });
};

export const useClearChatHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearChatHistory,
    onSuccess: () => {
      toast.success("Chat cleared!");
      queryClient.invalidateQueries({ queryKey: ["chatHistory"] });
    },
  });
};

// ================================
// REPORT ANALYZER
// ================================
export const useAnalyzeReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeReport,
    onSuccess: () => {
      toast.success("Report analyzed! 📄");
      queryClient.invalidateQueries({ queryKey: ["reportHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Analysis failed");
    },
  });
};

export const useReportHistory = () => {
  return useQuery({
    queryKey: ["reportHistory"],
    queryFn: getReportHistory,
  });
};

// ================================
// HEALTH TIPS
// ================================
export const useHealthTips = () => {
  return useMutation({
    mutationFn: getHealthTips,
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to get tips");
    },
  });
};

// ================================
// ANALYZE REPORT IMAGE
// ================================
export const useAnalyzeReportImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: analyzeReportImage,
    onSuccess: () => {
      toast.success("Report image analyzed! 📄");
      queryClient.invalidateQueries({ queryKey: ["reportHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Analysis failed");
    },
  });
};
