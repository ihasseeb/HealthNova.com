import { Router } from "express";
import {
  createHealthProfile,
  getHealthProfile,
  updateHealthProfile,
  deleteHealthProfile,
} from "../controllers/healthProfile.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createHealthProfileSchema,
  updateHealthProfileSchema,
} from "../validators/healthProfile.validator";

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/health-profile
router.post("/", validate(createHealthProfileSchema), createHealthProfile);

// GET /api/health-profile
router.get("/", getHealthProfile);

// PUT /api/health-profile
router.put("/", validate(updateHealthProfileSchema), updateHealthProfile);

// DELETE /api/health-profile
router.delete("/", deleteHealthProfile);

export default router;
