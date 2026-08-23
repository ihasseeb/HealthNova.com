import api from "./api";

// Get My Notifications (with pagination)
export const getNotifications = async (page = 1, limit = 20) => {
  const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return response.data;
};

// Get Unread Count
export const getUnreadNotificationCount = async () => {
  const response = await api.get("/notifications/unread-count");
  return response.data;
};

// Mark Single Notification as Read
export const markNotificationAsRead = async (notificationId: string) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

// Mark All Notifications as Read
export const markAllNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};

// Delete Notification
export const deleteNotification = async (notificationId: string) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};
