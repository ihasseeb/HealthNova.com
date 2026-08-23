import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadMedicalRecord,
  getMyMedicalRecords,
  deleteMedicalRecord,
  shareMedicalRecord,
  getSharedRecordsForDoctor,
} from "../services/medicalRecordService";
import {
  UploadRecordFormData,
  ShareRecordFormData,
} from "../schemas/medicalRecordSchema";
import { toast } from "sonner";

// Upload Record Hook
export const useUploadMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadRecordFormData) => uploadMedicalRecord(data),
    onSuccess: (res) => {
      toast.success(res.message || "Medical record uploaded! 📄");
      queryClient.invalidateQueries({ queryKey: ["myMedicalRecords"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });
};

// Get My Records Hook
export const useGetMyMedicalRecords = (category?: string) => {
  return useQuery({
    queryKey: ["myMedicalRecords", category],
    queryFn: () => getMyMedicalRecords(category),
  });
};

// Delete Record Hook
export const useDeleteMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) => deleteMedicalRecord(recordId),
    onSuccess: (res) => {
      toast.success(res.message || "Record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myMedicalRecords"] });
    },
  });
};

// Share Record Hook
export const useShareMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recordId,
      data,
    }: {
      recordId: string;
      data: ShareRecordFormData;
    }) => shareMedicalRecord(recordId, data),
    onSuccess: (res) => {
      toast.success(res.message || "Record shared with doctor! 🤝");
      queryClient.invalidateQueries({ queryKey: ["myMedicalRecords"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Sharing failed");
    },
  });
};

// Doctor: Get Shared Records Hook
export const useGetSharedRecordsForDoctor = () => {
  return useQuery({
    queryKey: ["sharedRecordsDoctor"],
    queryFn: getSharedRecordsForDoctor,
  });
};
