import { Request, Response } from "express";
import {
  bookAppointmentService,
  getPatientAppointmentsService,
  cancelAppointmentService,
  getDoctorAppointmentsService,
  updateAppointmentService,
  setAvailabilityService,
  getDoctorAvailabilityService,
} from "../services/appointment.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// ============================================
// PATIENT CONTROLLERS
// ============================================

// Book Appointment
export const bookAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const patientId = req.user!.userId;
    const appointment = await bookAppointmentService(patientId, req.body);
    return successResponse(res, 201, "Appointment booked successfully", {
      appointment,
    });
  },
);

// Get My Appointments (Patient)
export const getMyAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const patientId = req.user!.userId;
    const appointments = await getPatientAppointmentsService(patientId);
    return successResponse(res, 200, "Appointments fetched successfully", {
      appointments,
    });
  },
);

// Cancel Appointment
export const cancelAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const patientId = req.user!.userId;
    const { appointmentId } = req.params;
    const appointment = await cancelAppointmentService(
      patientId,
      appointmentId,
    );
    return successResponse(res, 200, "Appointment cancelled successfully", {
      appointment,
    });
  },
);

// ============================================
// DOCTOR CONTROLLERS
// ============================================

// Get Doctor's Appointments
export const getDoctorAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const appointments = await getDoctorAppointmentsService(userId);
    return successResponse(res, 200, "Doctor appointments fetched", {
      appointments,
    });
  },
);

// Update Appointment (Confirm/Complete/etc)
export const updateAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { appointmentId } = req.params;
    const appointment = await updateAppointmentService(
      userId,
      appointmentId,
      req.body,
    );
    return successResponse(res, 200, "Appointment updated successfully", {
      appointment,
    });
  },
);

// ============================================
// AVAILABILITY CONTROLLERS
// ============================================

// Set Availability (Doctor)
export const setAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await setAvailabilityService(userId, req.body);
    return successResponse(res, 201, "Availability set successfully", {
      result,
    });
  },
);

// Get Doctor Availability (Public - for patients)
export const getDoctorAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const slots = await getDoctorAvailabilityService(doctorId);
    return successResponse(res, 200, "Availability fetched", { slots });
  },
);
