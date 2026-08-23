import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  setDoctorAvailability,
  getDoctorAvailability,
  BookAppointmentInput,
  SetAvailabilityInput,
} from "../services/appointmentService";
import { toast } from "sonner";

// Patient: Book Appointment Hook
export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookAppointmentInput) => bookAppointment(data),
    onSuccess: (res) => {
      toast.success(res.message || "Appointment booked successfully! 📅");
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    },
  });
};

// Patient: Get Appointments
export const useGetPatientAppointments = () => {
  return useQuery({
    queryKey: ["patientAppointments"],
    queryFn: getPatientAppointments,
  });
};

// Patient: Cancel Hook
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => cancelAppointment(appointmentId),
    onSuccess: (res) => {
      toast.success(res.message || "Appointment cancelled.");
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel");
    },
  });
};

// Doctor: Get Appointments
export const useGetDoctorAppointments = () => {
  return useQuery({
    queryKey: ["doctorAppointments"],
    queryFn: getDoctorAppointments,
  });
};

// Doctor: Update Status Hook
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: { status: string; notes?: string };
    }) => updateAppointmentStatus(appointmentId, data),
    onSuccess: (res) => {
      toast.success(res.message || "Appointment status updated!");
      queryClient.invalidateQueries({ queryKey: ["doctorAppointments"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

// Doctor: Set Availability Hook
export const useSetDoctorAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetAvailabilityInput) => setDoctorAvailability(data),
    onSuccess: (res) => {
      toast.success(res.message || "Working schedule saved! 🕒");
      queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save schedule");
    },
  });
};

// Public: Get Doctor Availability
export const useGetDoctorAvailability = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctorAvailability", doctorId],
    queryFn: () => getDoctorAvailability(doctorId),
    enabled: !!doctorId,
  });
};
