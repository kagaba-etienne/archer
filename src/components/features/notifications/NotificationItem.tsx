import { formatDistanceToNow } from "date-fns";
import { Target, Lightbulb, Info, Clock, X } from "lucide-react";
import { Badge } from "@/components/ui";
import type { Notification, NotificationType } from "@/types";

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  "task-reminder": <Clock className="h-5 w-5 text-accent-warning" />,
  "goal-milestone": <Target className="h-5 w-5 text-accent-success" />,
  "ai-insight": <Lightbulb className="h-5 w-5 text-primary" />,
  system: <Info className="h-5 w-5 text-accent-info" />,
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`relative p-4 border-b border-border-light hover:bg-bg-gray transition-colors cursor-pointer ${
        !notification.read ? "bg-primary/5" : ""
      }`}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 left-2 w-2 h-2 bg-primary rounded-full" />
      )}

      <div className="flex items-start gap-3 pl-3">
        {/* Icon */}
        <div className="shrink-0 mt-1">
          {notificationIcons[notification.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"} text-text-primary`}
              >
                {notification.title}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                {notification.message}
              </p>
            </div>

            {/* Delete button */}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="text-text-muted hover:text-accent-error transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-text-muted">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
            {!notification.read && (
              <Badge variant="info" size="sm">
                New
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
