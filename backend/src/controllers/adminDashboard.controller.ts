import { Request, Response } from "express";
import {
  getDashboardStatsService,
  getAllUsersService,
  getRevenueAnalyticsService,
  getAppointmentAnalyticsService,
} from "../services/adminDashboard.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Dashboard Overview
export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await getDashboardStatsService();
    return successResponse(res, 200, "Dashboard stats", stats);
  },
);

// All Users (with pagination)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, page, limit } = req.query;
  const result = await getAllUsersService(
    role as string,
    Number(page) || 1,
    Number(limit) || 20,
  );
  return successResponse(res, 200, "Users fetched", result);
});

// Revenue Analytics
export const getRevenueAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await getRevenueAnalyticsService();
    return successResponse(res, 200, "Revenue analytics", analytics);
  },
);

// Appointment Analytics
export const getAppointmentAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const analytics = await getAppointmentAnalyticsService();
    return successResponse(res, 200, "Appointment analytics", analytics);
  },
);
