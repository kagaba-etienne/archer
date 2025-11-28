import { useState } from "react";
import { Bell, Check, Filter, Loader2 } from "lucide-react";
import { LoadingSkeleton } from "@/components/ui";
import { NotificationItem } from "./NotificationItem";
import { useNotificationsQuery } from "@/services/queries/useNotifications";
import {
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/services/mutations/useNotifications";
import type { NotificationFilters } from "@/types";

export function NotificationCenter() {
  const [filters, setFilters] = useState<NotificationFilters>({ read: false });

  const { data: notifications, isLoading } = useNotificationsQuery(filters);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id);
  };

  const toggleFilter = () => {
    setFilters((prev) => ({
      ...prev,
      read: prev.read === false ? undefined : false,
    }));
  };

  return (
    <div className="h-full flex flex-col w-[80vw] md:w-md">
      {/* Header */}
      <div className="border-b border-border-light">
        <div className="pt-4 flex gap-2 flex-col items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Notifications
            </h2>
          </div>

          <div className="flex gap-2 w-full border-b border-t">
            <button
              className="filter-button pl-4 border-r py-2 border-border-light cursor-pointer flex-1 flex items-center"
              onClick={toggleFilter}
            >
              <Filter className="h-4 w-4 mr-1" />
              {filters.read === false ? "Unread" : "All"}
            </button>
            <button
              className="mark-all-as-read-button pr-4 py-2 cursor-pointer flex-1 flex items-center"
              onClick={handleMarkAllAsRead}
            >
              {markAllAsRead.isPending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Mark all read
            </button>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <LoadingSkeleton key={i} variant="rectangular" height={80} />
            ))}
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={filters.read === false ? handleDelete : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <Bell className="h-16 w-16 text-text-muted mb-4" />
            <p className="text-text-secondary text-center">
              {filters.read === false
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
