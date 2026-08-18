import { Request, Response } from "express";
import {
  createPrescriptionService,
  getDoctorPrescriptionsService,
  updatePrescriptionService,
  getPatientPrescriptionsService,
  getPrescriptionByIdService,
} from "../services/prescription.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Doctor: Create Prescription
export const createPrescription = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const prescription = await createPrescriptionService(userId, req.body);
    return successResponse(res, 201, "Prescription created successfully", {
      prescription,
    });
  },
);

// Doctor: Get My Prescriptions
export const getDoctorPrescriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const prescriptions = await getDoctorPrescriptionsService(userId);
    return successResponse(res, 200, "Prescriptions fetched", {
      prescriptions,
    });
  },
);

// Doctor: Update Prescription
export const updatePrescription = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { prescriptionId } = req.params;
    const prescription = await updatePrescriptionService(
      userId,
      prescriptionId,
      req.body,
    );
    return successResponse(res, 200, "Prescription updated", { prescription });
  },
);

// Patient: Get My Prescriptions
export const getPatientPrescriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const patientId = req.user!.userId;
    const prescriptions = await getPatientPrescriptionsService(patientId);
    return successResponse(res, 200, "Prescriptions fetched", {
      prescriptions,
    });
  },
);

// Both: Get Single Prescription
export const getPrescriptionById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { prescriptionId } = req.params;
    const prescription = await getPrescriptionByIdService(
      userId,
      prescriptionId,
    );
    return successResponse(res, 200, "Prescription details", { prescription });
  },
);
