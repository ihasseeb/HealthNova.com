import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHealthProfile,
  getHealthProfile,
  updateHealthProfile,
} from "../services/healthProfileService";
import { toast } from "sonner";

// Get Health Profile Hook
export const useGetHealthProfile = () => {
  return useQuery({
    queryKey: ["healthProfile"],
    queryFn: getHealthProfile,
    retry: false,
  });
};

// Create Health Profile Hook
export const useCreateHealthProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHealthProfile,
    onSuccess: () => {
      toast.success("Health profile created successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["healthProfile"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create profile";
      toast.error(message);
    },
  });
};

// Update Health Profile Hook
export const useUpdateHealthProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHealthProfile,
    onSuccess: () => {
      toast.success("Health profile updated! ✨");
      queryClient.invalidateQueries({ queryKey: ["healthProfile"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });
};
