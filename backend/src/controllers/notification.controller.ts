import { Request, Response } from "express";
import {
  getNotificationsService,
  markAsReadService,
  markAllAsReadService,
  deleteNotificationService,
  getUnreadCountService,
} from "../services/notification.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Get My Notifications
export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { page, limit } = req.query;
    const result = await getNotificationsService(
      userId,
      Number(page) || 1,
      Number(limit) || 20,
    );
    return successResponse(res, 200, "Notifications fetched", result);
  },
);

// Get Unread Count
export const getUnreadCount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await getUnreadCountService(userId);
    return successResponse(res, 200, "Unread count", result);
  },
);

// Mark One as Read
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { notificationId } = req.params;
  const notification = await markAsReadService(userId, notificationId);
  return successResponse(res, 200, "Marked as read", { notification });
});

// Mark All as Read
export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await markAllAsReadService(userId);
    return successResponse(res, 200, result.message);
  },
);

// Delete Notification
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { notificationId } = req.params;
    const result = await deleteNotificationService(userId, notificationId);
    return successResponse(res, 200, result.message);
  },
);
