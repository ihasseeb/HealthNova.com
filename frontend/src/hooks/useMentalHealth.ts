import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  logMood,
  getMoodHistory,
  MoodLogInput,
} from "../services/mentalHealthService";
import { toast } from "sonner";

export const useLogMood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MoodLogInput) => logMood(data),
    onSuccess: () => {
      toast.success("Mood logged successfully! 🧠");
      queryClient.invalidateQueries({ queryKey: ["moodHistory"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to log mood");
    },
  });
};

export const useGetMoodHistory = () => {
  return useQuery({
    queryKey: ["moodHistory"],
    queryFn: getMoodHistory,
  });
};
