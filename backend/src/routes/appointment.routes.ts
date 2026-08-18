import { Router } from "express";
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
  updateAppointment,
  setAvailability,
  getDoctorAvailability,
} from "../controllers/appointment.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  bookAppointmentSchema,
  updateAppointmentSchema,
  setAvailabilitySchema,
} from "../validators/appointment.validator";

const router = Router();

// All routes require authentication
router.use(authenticate);

// ============================================
// PATIENT ROUTES
// ============================================
router.post(
  "/book",
  authorize("PATIENT"),
  validate(bookAppointmentSchema),
  bookAppointment,
);

router.get("/my-appointments", authorize("PATIENT"), getMyAppointments);

router.patch("/:appointmentId/cancel", authorize("PATIENT"), cancelAppointment);

// ============================================
// DOCTOR ROUTES
// ============================================
router.get("/doctor/appointments", authorize("DOCTOR"), getDoctorAppointments);

router.patch(
  "/:appointmentId/update",
  authorize("DOCTOR"),
  validate(updateAppointmentSchema),
  updateAppointment,
);

router.post(
  "/doctor/availability",
  authorize("DOCTOR"),
  validate(setAvailabilitySchema),
  setAvailability,
);

// ============================================
// PUBLIC ROUTES (Any authenticated user)
// ============================================
router.get("/doctor/:doctorId/availability", getDoctorAvailability);

export default router;
