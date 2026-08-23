import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDashboardStats,
  getPendingDoctors,
  verifyDoctor,
  getAllUsers,
} from "../services/adminService";
import { toast } from "sonner";

// Get Platform Stats Hook
export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: getDashboardStats,
  });
};

// Get Pending Doctors Hook
export const useGetPendingDoctors = () => {
  return useQuery({
    queryKey: ["pendingDoctors"],
    queryFn: getPendingDoctors,
  });
};

// Verify Doctor Hook
export const useVerifyDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (doctorId: string) => verifyDoctor(doctorId),
    onSuccess: (res) => {
      toast.success(res.message || "Doctor verified successfully! ✅");
      queryClient.invalidateQueries({ queryKey: ["pendingDoctors"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Verification failed");
    },
  });
};

// Get All Users Hook
export const useGetAllUsers = (params?: { role?: string; page?: number }) => {
  return useQuery({
    queryKey: ["allUsers", params],
    queryFn: () => getAllUsers(params),
  });
};
