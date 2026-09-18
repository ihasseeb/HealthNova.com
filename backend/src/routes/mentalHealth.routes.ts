import { Router } from "express";
import {
  logMood,
  getMoodHistory,
} from "../controllers/mentalHealth.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { createMoodLogSchema } from "../validators/mentalHealth.validator";

const router = Router();

router.use(authenticate); // Must be logged in
router.post("/", validate(createMoodLogSchema), logMood);
router.get("/history", getMoodHistory);

export default router;
