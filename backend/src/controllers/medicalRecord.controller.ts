import { Request, Response } from "express";
import {
  uploadRecordService,
  getMyRecordsService,
  getRecordByIdService,
  updateRecordService,
  deleteRecordService,
  shareRecordService,
  getSharedRecordsService,
} from "../services/medicalRecord.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Upload Record
export const uploadRecord = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const record = await uploadRecordService(userId, req.body);
    return successResponse(res, 201, "Record uploaded", { record });
  },
);

// Get My Records
export const getMyRecords = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { category } = req.query;
    const records = await getMyRecordsService(userId, category as string);
    return successResponse(res, 200, "Records fetched", { records });
  },
);

// Get Single Record
export const getRecordById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { recordId } = req.params;
    const record = await getRecordByIdService(userId, recordId);
    return successResponse(res, 200, "Record details", { record });
  },
);

// Update Record
export const updateRecord = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { recordId } = req.params;
    const record = await updateRecordService(userId, recordId, req.body);
    return successResponse(res, 200, "Record updated", { record });
  },
);

// Delete Record
export const deleteRecord = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { recordId } = req.params;
    const result = await deleteRecordService(userId, recordId);
    return successResponse(res, 200, result.message);
  },
);

// Share with Doctor
export const shareRecord = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { recordId } = req.params;
  const record = await shareRecordService(userId, recordId, req.body);
  return successResponse(res, 200, "Record shared", { record });
});

// Get Shared Records (Doctor)
export const getSharedRecords = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const records = await getSharedRecordsService(userId);
    return successResponse(res, 200, "Shared records", { records });
  },
);
