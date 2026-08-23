import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../services/notificationService";
import { toast } from "sonner";

// Get Notifications Hook
export const useGetNotifications = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => getNotifications(page, limit),
    refetchInterval: 15000, // Auto-poll every 15s as fallback for sockets
  });
};

// Get Unread Count Hook
export const useGetUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["unreadNotificationCount"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 10000, // Auto-poll unread count every 10s
  });
};

// Mark Single as Read Hook
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
};

// Mark All as Read Hook
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: (res) => {
      toast.success(res.message || "All notifications marked as read! ✅");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update");
    },
  });
};

// Delete Notification Hook
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: (res) => {
      toast.success(res.message || "Notification removed");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
};
