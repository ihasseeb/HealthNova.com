import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createAppointmentPayment,
  createSubscriptionPayment,
  getPaymentHistory,
  getMySubscription,
} from "../services/paymentService";
import {
  AppointmentPaymentFormData,
  SubscriptionFormData,
} from "../schemas/paymentSchema";
import { toast } from "sonner";

// Appointment Checkout Redirect Hook
export const usePayAppointment = () => {
  return useMutation({
    mutationFn: (data: AppointmentPaymentFormData) =>
      createAppointmentPayment(data),
    onSuccess: (res) => {
      if (res.data?.url) {
        toast.loading("Redirecting to secure Stripe Checkout... 💳");
        window.location.href = res.data.url; // Redirect to Stripe
      } else {
        toast.error("Failed to generate checkout link");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to initialize payment",
      );
    },
  });
};

// Subscription Checkout Redirect Hook
export const useSubscribe = () => {
  return useMutation({
    mutationFn: (data: SubscriptionFormData) => createSubscriptionPayment(data),
    onSuccess: (res) => {
      if (res.data?.url) {
        toast.loading("Redirecting to Stripe Checkout... 💳");
        window.location.href = res.data.url; // Redirect to Stripe
      } else {
        toast.error("Failed to generate checkout link");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to start subscription",
      );
    },
  });
};

// Get Payment History Hook
export const useGetPaymentHistory = () => {
  return useQuery({
    queryKey: ["paymentHistory"],
    queryFn: getPaymentHistory,
  });
};

// Get My Subscription Status Hook
export const useGetMySubscription = () => {
  return useQuery({
    queryKey: ["mySubscription"],
    queryFn: getMySubscription,
  });
};
