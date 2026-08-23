import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getPrescriptionById,
} from "../services/prescriptionService";
import { CreatePrescriptionFormData } from "../schemas/prescriptionSchema";
import { toast } from "sonner";

// Doctor: Create Prescription Hook
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePrescriptionFormData) => createPrescription(data),
    onSuccess: (res) => {
      toast.success(res.message || "Prescription issued successfully! 📋");
      queryClient.invalidateQueries({ queryKey: ["doctorPrescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["patientPrescriptions"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create prescription",
      );
    },
  });
};

// Doctor: Get Prescriptions
export const useGetDoctorPrescriptions = () => {
  return useQuery({
    queryKey: ["doctorPrescriptions"],
    queryFn: getDoctorPrescriptions,
  });
};

// Patient: Get Prescriptions
export const useGetPatientPrescriptions = () => {
  return useQuery({
    queryKey: ["patientPrescriptions"],
    queryFn: getPatientPrescriptions,
  });
};

// Single Prescription View Hook
export const useGetPrescriptionById = (prescriptionId: string) => {
  return useQuery({
    queryKey: ["prescription", prescriptionId],
    queryFn: () => getPrescriptionById(prescriptionId),
    enabled: !!prescriptionId,
  });
};
