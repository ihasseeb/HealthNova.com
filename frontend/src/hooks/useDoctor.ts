import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctorProfile,
  createDoctorProfile,
  updateDoctorProfile,
  DoctorProfileInput,
} from "../services/doctorService";
import { toast } from "sonner";

// Get Profile Hook
export const useGetDoctorProfile = () => {
  return useQuery({
    queryKey: ["doctorProfile"],
    queryFn: getDoctorProfile,
    retry: false,
  });
};

// Create Profile Hook
export const useCreateDoctorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DoctorProfileInput) => createDoctorProfile(data),
    onSuccess: (res) => {
      toast.success(
        res.message || "Doctor profile submitted for verification! 👨‍⚕️",
      );
      queryClient.invalidateQueries({ queryKey: ["doctorProfile"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create profile");
    },
  });
};

// Update Profile Hook
export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DoctorProfileInput>) =>
      updateDoctorProfile(data),
    onSuccess: (res) => {
      toast.success(res.message || "Profile updated successfully! ✨");
      queryClient.invalidateQueries({ queryKey: ["doctorProfile"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
};
