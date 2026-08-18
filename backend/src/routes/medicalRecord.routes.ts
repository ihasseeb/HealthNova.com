import { Router } from "express";
import {
  uploadRecord,
  getMyRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  shareRecord,
  getSharedRecords,
} from "../controllers/medicalRecord.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import {
  uploadRecordSchema,
  updateRecordSchema,
  shareRecordSchema,
} from "../validators/medicalRecord.validator";

const router = Router();

router.use(authenticate);

// Patient Routes
router.post("/", validate(uploadRecordSchema), uploadRecord);
router.get("/", getMyRecords);
router.get("/:recordId", getRecordById);
router.put("/:recordId", validate(updateRecordSchema), updateRecord);
router.delete("/:recordId", deleteRecord);
router.post("/:recordId/share", validate(shareRecordSchema), shareRecord);

// Doctor Route
router.get("/doctor/shared", authorize("DOCTOR"), getSharedRecords);

export default router;
