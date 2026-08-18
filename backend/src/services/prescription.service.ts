import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import type {
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
} from "../validators/prescription.validator";
import { notifyPrescription } from "../utils/notification";

// ============================================
// DOCTOR SERVICES
// ============================================

// Create Prescription
export const createPrescriptionService = async (
  userId: string,
  data: CreatePrescriptionInput,
) => {
  // 1. Get doctor profile
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!doctor) {
    throw new AppError("Doctor profile not found", 404);
  }

  // 2. Verify patient exists
  const patient = await prisma.user.findUnique({
    where: { id: data.patientId },
  });

  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  // 3. Verify appointment (if provided)
  if (data.appointmentId) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    if (appointment.doctorId !== doctor.id) {
      throw new AppError("Not your appointment", 403);
    }

    // Check if prescription already exists for this appointment
    const existing = await prisma.prescription.findUnique({
      where: { appointmentId: data.appointmentId },
    });

    if (existing) {
      throw new AppError(
        "Prescription already exists for this appointment",
        400,
      );
    }
  }

  // 4. Create prescription with medicines
  const prescription = await prisma.prescription.create({
    data: {
      patientId: data.patientId,
      doctorId: doctor.id,
      appointmentId: data.appointmentId,
      diagnosis: data.diagnosis,
      notes: data.notes,
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      medicines: {
        create: data.medicines,
      },
    },
    include: {
      medicines: true,
      patient: {
        select: { id: true, name: true, email: true },
      },
      doctor: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  // After creating prescription:
  await notifyPrescription(data.patientId, prescription.doctor.user.name);

  return prescription;
};

// Get Doctor's Created Prescriptions
export const getDoctorPrescriptionsService = async (userId: string) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!doctor) {
    throw new AppError("Doctor profile not found", 404);
  }

  const prescriptions = await prisma.prescription.findMany({
    where: { doctorId: doctor.id },
    include: {
      medicines: true,
      patient: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return prescriptions;
};

// Update Prescription (Doctor)
export const updatePrescriptionService = async (
  userId: string,
  prescriptionId: string,
  data: UpdatePrescriptionInput,
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!doctor) {
    throw new AppError("Doctor profile not found", 404);
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id: prescriptionId },
  });

  if (!prescription) {
    throw new AppError("Prescription not found", 404);
  }

  if (prescription.doctorId !== doctor.id) {
    throw new AppError("You can only update your own prescriptions", 403);
  }

  const updated = await prisma.prescription.update({
    where: { id: prescriptionId },
    data,
    include: { medicines: true },
  });

  return updated;
};

// ============================================
// PATIENT SERVICES
// ============================================

// Get Patient's Prescriptions
export const getPatientPrescriptionsService = async (patientId: string) => {
  const prescriptions = await prisma.prescription.findMany({
    where: { patientId },
    include: {
      medicines: true,
      doctor: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return prescriptions;
};

// Get Single Prescription
export const getPrescriptionByIdService = async (
  userId: string,
  prescriptionId: string,
) => {
  const prescription = await prisma.prescription.findUnique({
    where: { id: prescriptionId },
    include: {
      medicines: true,
      patient: {
        select: { id: true, name: true, email: true },
      },
      doctor: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  if (!prescription) {
    throw new AppError("Prescription not found", 404);
  }

  // Verify user has access (patient or doctor)
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  const isPatient = prescription.patientId === userId;
  const isDoctor = doctor && prescription.doctorId === doctor.id;

  if (!isPatient && !isDoctor) {
    throw new AppError("Access denied", 403);
  }

  return prescription;
};
