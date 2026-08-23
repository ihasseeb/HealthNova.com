import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "../../hooks/useNotification";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetNotifications(1, 50);
  const markRead = useMarkNotificationAsRead();
  const markAllRead = useMarkAllNotificationsAsRead();
  const deleteNotif = useDeleteNotification();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">🔔</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span>🔔</span> Notification Center
            </h1>
            <p className="text-white/90 text-sm mt-1">
              Stay updated on your health appointments, reminders, and alerts
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="bg-white text-emerald-600 hover:bg-slate-50 text-xs"
            >
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow border border-emerald-100">
            <div className="text-5xl mb-3">🔕</div>
            <h3 className="text-xl font-bold text-slate-800">
              No Notifications
            </h3>
            <p className="text-slate-500 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif: any) => (
              <motion.div
                key={notif.id}
                whileHover={{ x: 2 }}
                className={`p-4 rounded-2xl border shadow-sm transition flex items-start gap-4 ${
                  !notif.isRead
                    ? "bg-emerald-50/60 border-emerald-200"
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="text-2xl mt-1">
                  {notif.type === "APPOINTMENT"
                    ? "📅"
                    : notif.type === "PAYMENT"
                      ? "💰"
                      : notif.type === "CHAT"
                        ? "💬"
                        : "🔔"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-sm">
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block mt-2">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {notif.link && (
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!notif.isRead) markRead.mutate(notif.id);
                        navigate(notif.link);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                    >
                      View
                    </Button>
                  )}
                  <button
                    onClick={() => deleteNotif.mutate(notif.id)}
                    className="text-slate-400 hover:text-red-500 p-1 text-sm transition"
                  >
                    🗑️
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
