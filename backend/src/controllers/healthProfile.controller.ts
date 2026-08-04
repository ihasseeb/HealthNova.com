import { Request, Response } from "express";
import {
  createHealthProfileService,
  getHealthProfileService,
  updateHealthProfileService,
  deleteHealthProfileService,
} from "../services/healthProfile.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// CREATE Health Profile
export const createHealthProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await createHealthProfileService(userId, req.body);

    return successResponse(res, 201, "Health profile created successfully", {
      profile,
    });
  },
);

// GET Health Profile
export const getHealthProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await getHealthProfileService(userId);

    return successResponse(res, 200, "Health profile fetched successfully", {
      profile,
    });
  },
);

// UPDATE Health Profile
export const updateHealthProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const profile = await updateHealthProfileService(userId, req.body);

    return successResponse(res, 200, "Health profile updated successfully", {
      profile,
    });
  },
);

// DELETE Health Profile
export const deleteHealthProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await deleteHealthProfileService(userId);

    return successResponse(res, 200, result.message);
  },
);
