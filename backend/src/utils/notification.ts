import prisma from "../lib/prisma";
import { emitToUser } from "../lib/socket";

// Create and emit notification
export const createNotification = async (data: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) => {
  // Save to database
  const notification = await ((prisma as any).notification as any).create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || "GENERAL",
      link: data.link,
    },
  });

  // Emit real-time via Socket.io
  emitToUser(data.userId, "new_notification", notification);

  return notification;
};

// Pre-built notification types
export const notifyAppointmentBooked = async (
  patientId: string,
  doctorName: string,
  date: string,
) => {
  return createNotification({
    userId: patientId,
    title: "Appointment Booked! 📅",
    message: `Your appointment with Dr. ${doctorName} on ${date} has been booked.`,
    type: "APPOINTMENT",
    link: "/appointments",
  });
};

export const notifyAppointmentConfirmed = async (
  patientId: string,
  doctorName: string,
) => {
  return createNotification({
    userId: patientId,
    title: "Appointment Confirmed! ✅",
    message: `Dr. ${doctorName} has confirmed your appointment.`,
    type: "APPOINTMENT",
    link: "/appointments",
  });
};

export const notifyNewAppointment = async (
  doctorUserId: string,
  patientName: string,
  date: string,
) => {
  return createNotification({
    userId: doctorUserId,
    title: "New Appointment! 🔔",
    message: `${patientName} booked an appointment on ${date}.`,
    type: "APPOINTMENT",
    link: "/doctor/appointments",
  });
};

export const notifyPaymentSuccess = async (userId: string, amount: number) => {
  return createNotification({
    userId,
    title: "Payment Successful! 💰",
    message: `Your payment of $${amount} has been processed successfully.`,
    type: "PAYMENT",
    link: "/payments",
  });
};

export const notifyNewMessage = async (userId: string, senderName: string) => {
  return createNotification({
    userId,
    title: "New Message! 💬",
    message: `${senderName} sent you a message.`,
    type: "CHAT",
    link: "/chat",
  });
};

export const notifyPrescription = async (
  patientId: string,
  doctorName: string,
) => {
  return createNotification({
    userId: patientId,
    title: "New Prescription! 💊",
    message: `Dr. ${doctorName} has issued a new prescription for you.`,
    type: "GENERAL",
    link: "/prescriptions",
  });
};

export const notifyDoctorVerified = async (doctorUserId: string) => {
  return createNotification({
    userId: doctorUserId,
    title: "Profile Verified! 🎉",
    message:
      "Congratulations! Your doctor profile has been verified. You can now accept appointments.",
    type: "SYSTEM",
    link: "/doctor/dashboard",
  });
};
