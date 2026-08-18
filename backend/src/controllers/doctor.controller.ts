import { Request, Response } from "express";
import {
  createDoctorProfileService,
  updateDoctorProfileService,
  getDoctorProfileService,
} from "../services/doctor.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// CREATE Doctor Profile
export const createDoctorProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await createDoctorProfileService(userId, req.body);
    return successResponse(res, 201, "Doctor profile created successfully", {
      profile,
    });
  },
);

// GET Doctor Profile
export const getDoctorProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await getDoctorProfileService(userId);
    return successResponse(res, 200, "Doctor profile fetched successfully", {
      profile,
    });
  },
);

// UPDATE Doctor Profile
export const updateDoctorProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await updateDoctorProfileService(userId, req.body);
    return successResponse(res, 200, "Doctor profile updated successfully", {
      profile,
    });
  },
);
