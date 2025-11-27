"use client";

import { format } from "date-fns";
import { Plus, ExternalLink } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import type { CalendarEvent } from "@/types";

export interface CalendarEventCardProps {
  event: CalendarEvent;
  onCreateTask?: (eventId: string) => void;
  isCreatingTask?: boolean;
}

export function CalendarEventCard({
  event,
  onCreateTask,
  isCreatingTask,
}: CalendarEventCardProps) {
  const eventStart = new Date(event.startTime);
  const eventEnd = new Date(event.endTime);

  const isAllDay = event.allDay ?? false;
  const timeString = isAllDay
    ? "All day"
    : `${format(eventStart, "h:mm a")} - ${format(eventEnd, "h:mm a")}`;

  return (
    <Card className="relative overflow-hidden">
      {/* Calendar color indicator */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: event.calendarColor || "#3B82F6" }}
      />

      <div className="pl-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary">{event.title}</h4>
            <p className="text-sm text-text-secondary mt-1">{timeString}</p>

            {event.description && (
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {event.calendarName && (
              <Badge variant="default" size="sm">
                {event.calendarName}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {onCreateTask && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCreateTask(event.id)}
              isLoading={isCreatingTask}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Task
            </Button>
          )}

          {event.eventUrl && (
            <a
              href={event.eventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
