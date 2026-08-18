import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import type {
  BookAppointmentInput,
  UpdateAppointmentInput,
  SetAvailabilityInput,
} from "../validators/appointment.validator";
import {
  notifyAppointmentBooked,
  notifyNewAppointment,
} from "../utils/notification";

// ============================================
// PATIENT SERVICES
// ============================================

// Book Appointment
// Book Appointment
export const bookAppointmentService = async (
  patientId: string,
  data: BookAppointmentInput,
) => {
  // 1. Verify doctor exists and is verified
  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: data.doctorId },
  });

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  if (!doctor.isVerified) {
    throw new AppError("Doctor is not verified yet", 400);
  }

  // 2. Check if slot is already booked
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      doctorId: data.doctorId,
      appointmentDate: new Date(data.appointmentDate),
      startTime: data.startTime,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (existingAppointment) {
    throw new AppError("This time slot is already booked", 400);
  }

  // 3. Check if date is in the past
  const appointmentDate = new Date(data.appointmentDate);
  if (appointmentDate < new Date()) {
    throw new AppError("Cannot book appointment in the past", 400);
  }

  // 4. Create appointment
  const appointment = await prisma.appointment.create({
    data: {
      patientId,
      doctorId: data.doctorId,
      appointmentDate: appointmentDate,
      startTime: data.startTime,
      endTime: data.endTime,
      type: data.type,
      reason: data.reason,
      notes: data.notes,
      consultationFee: doctor.consultationFee,
    },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  // 5. Send notifications AFTER appointment created ✅
  await notifyAppointmentBooked(
    patientId,
    appointment.doctor.user.name,
    data.appointmentDate,
  );

  const doctorUser = await prisma.user.findFirst({
    where: { doctorProfile: { id: data.doctorId } },
  });

  if (doctorUser) {
    const patient = await prisma.user.findUnique({
      where: { id: patientId },
    });
    await notifyNewAppointment(
      doctorUser.id,
      patient?.name || "Patient",
      data.appointmentDate,
    );
  }

  return appointment;
};

// Get Patient's Appointments
export const getPatientAppointmentsService = async (patientId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: { patientId },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: { appointmentDate: "desc" },
  });

  return appointments;
};

// Cancel Appointment (by patient)
export const cancelAppointmentService = async (
  patientId: string,
  appointmentId: string,
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.patientId !== patientId) {
    throw new AppError("You can only cancel your own appointments", 403);
  }

  if (appointment.status === "COMPLETED") {
    throw new AppError("Cannot cancel completed appointment", 400);
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
  });

  return updated;
};

// ============================================
// DOCTOR SERVICES
// ============================================

// Get Doctor's Appointments
export const getDoctorAppointmentsService = async (userId: string) => {
  // First find doctor profile
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!doctor) {
    throw new AppError("Doctor profile not found", 404);
  }

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    include: {
      patient: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { appointmentDate: "desc" },
  });

  return appointments;
};

// Update Appointment Status (by doctor)
export const updateAppointmentService = async (
  userId: string,
  appointmentId: string,
  data: UpdateAppointmentInput,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!doctor) {
    throw new AppError("Doctor profile not found", 404);
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.doctorId !== doctor.id) {
    throw new AppError("You can only update your own appointments", 403);
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data,
  });

  return updated;
};

// ============================================
// AVAILABILITY SERVICES
// ============================================

// Set Doctor Availability
export const setAvailabilityService = async (
  userId: string,
  data: SetAvailabilityInput,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!doctor) {
    throw new AppError("Doctor profile not found", 404);
  }

  // Delete existing slots
  await prisma.availabilitySlot.deleteMany({
    where: { doctorId: doctor.id },
  });

  // Create new slots
  const slots = await prisma.availabilitySlot.createMany({
    data: data.slots.map((slot) => ({
      doctorId: doctor.id,
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
  });

  return slots;
};

// Get Doctor Availability (public - for patients to see)
export const getDoctorAvailabilityService = async (doctorId: string) => {
  const slots = await prisma.availabilitySlot.findMany({
    where: {
      doctorId,
      isAvailable: true,
    },
    orderBy: { dayOfWeek: "asc" },
  });

  return slots;
};
