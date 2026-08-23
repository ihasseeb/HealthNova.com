import api from "./api";
import {
  AppointmentPaymentFormData,
  SubscriptionFormData,
} from "../schemas/paymentSchema";

// Create Stripe Checkout Session for Appointment
export const createAppointmentPayment = async (
  data: AppointmentPaymentFormData,
) => {
  const response = await api.post("/payments/appointment", data);
  return response.data; // returns { url, sessionId }
};

// Create Stripe Checkout Session for Subscription
export const createSubscriptionPayment = async (data: SubscriptionFormData) => {
  const response = await api.post("/payments/subscribe", data);
  return response.data; // returns { url, sessionId }
};

// Get User's Payment History
export const getPaymentHistory = async () => {
  const response = await api.get("/payments/history");
  return response.data;
};

// Get User's Active Subscription
export const getMySubscription = async () => {
  const response = await api.get("/payments/subscription");
  return response.data;
};
