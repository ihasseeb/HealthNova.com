import { Router } from "express";
import {
  createDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
  getAllVerifiedDoctors,
} from "../controllers/doctor.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createDoctorProfileSchema,
  updateDoctorProfileSchema,
} from "../validators/doctor.validator";

const router = Router();
// PUBLIC ROUTE (Patients can see all verified doctors without login)
router.get("/all", getAllVerifiedDoctors);

// All routes require authentication
router.use(authenticate);

// Doctor profile routes
router.post(
  "/profile",
  validate(createDoctorProfileSchema),
  createDoctorProfile,
);
router.get("/profile", getDoctorProfile);
router.put(
  "/profile",
  validate(updateDoctorProfileSchema),
  updateDoctorProfile,
);

export default router;
