import { Request, Response } from "express";
import {
  getPendingDoctorsService,
  verifyDoctorService,
} from "../services/admin.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Get all pending doctors
export const getPendingDoctors = asyncHandler(
  async (req: Request, res: Response) => {
    const doctors = await getPendingDoctorsService();
    return successResponse(res, 200, "Pending doctors fetched", { doctors });
  },
);

// Verify a doctor
export const verifyDoctor = asyncHandler(
  async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const doctor = await verifyDoctorService(doctorId);
    return successResponse(res, 200, "Doctor verified successfully", {
      doctor,
    });
  },
);
