import { Router } from "express";
import {
  createDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
} from "../controllers/doctor.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createDoctorProfileSchema,
  updateDoctorProfileSchema,
} from "../validators/doctor.validator";

const router = Router();

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
