import { Router } from "express";
import {
  createPrescription,
  getDoctorPrescriptions,
  updatePrescription,
  getPatientPrescriptions,
  getPrescriptionById,
} from "../controllers/prescription.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
} from "../validators/prescription.validator";

const router = Router();

router.use(authenticate);

// Doctor Routes
router.post(
  "/",
  authorize("DOCTOR"),
  validate(createPrescriptionSchema),
  createPrescription,
);

router.get(
  "/doctor/my-prescriptions",
  authorize("DOCTOR"),
  getDoctorPrescriptions,
);

router.patch(
  "/:prescriptionId",
  authorize("DOCTOR"),
  validate(updatePrescriptionSchema),
  updatePrescription,
);

// Patient Routes
router.get(
  "/patient/my-prescriptions",
  authorize("PATIENT"),
  getPatientPrescriptions,
);

// Both (Doctor + Patient)
router.get(
  "/:prescriptionId",
  authorize("PATIENT", "DOCTOR"),
  getPrescriptionById,
);

export default router;
