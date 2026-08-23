import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  useGetNotifications,
  useGetUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "../hooks/useNotification";
import { getSocket } from "../services/chatService";
import { useQueryClient } from "@tanstack/react-query";

const NotificationBell = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: countData } = useGetUnreadNotificationCount();
  const { data: listData } = useGetNotifications(1, 5); // Fetch top 5
  const markReadMutation = useMarkNotificationAsRead();
  const markAllReadMutation = useMarkAllNotificationsAsRead();

  const unreadCount = countData?.data?.unreadCount || 0;
  const notifications = listData?.data?.notifications || [];

  // Listen to Real-Time Socket.io Notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleRealTimeNotification = () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    };

    socket.on("new_notification", handleRealTimeNotification);

    return () => {
      socket.off("new_notification", handleRealTimeNotification);
    };
  }, [queryClient]);

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
      setIsOpen(false);
    }
  };

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition outline-none">
          <span className="text-xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 shadow-2xl rounded-2xl border-slate-100"
      >
        <div className="p-4 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <DropdownMenuLabel className="p-0 font-bold text-slate-800">
            Notifications {unreadCount > 0 && `(${unreadCount} New)`}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              className="text-xs text-emerald-600 hover:underline font-semibold"
            >
              Mark all read
            </button>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif: any) => (
              <DropdownMenuItem
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 cursor-pointer flex items-start gap-3 transition ${
                  !notif.isRead ? "bg-emerald-50/50 font-medium" : "bg-white"
                }`}
              >
                <span className="text-lg">
                  {notif.type === "APPOINTMENT"
                    ? "📅"
                    : notif.type === "PAYMENT"
                      ? "💰"
                      : notif.type === "CHAT"
                        ? "💬"
                        : "🔔"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {notif.title}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-1">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 self-center" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="p-2 text-center bg-slate-50 rounded-b-2xl">
          <button
            onClick={() => {
              navigate("/notifications");
              setIsOpen(false);
            }}
            className="text-xs text-slate-600 hover:text-emerald-600 font-semibold block w-full py-1"
          >
            View All Notifications →
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
