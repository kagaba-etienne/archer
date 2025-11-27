"use client";

import { useMemo } from "react";
import { startOfDay, endOfDay } from "date-fns";
import { Card } from "@/components/ui";
import { CalendarEventCard } from "@/components/features/calendar/CalendarEventCard";
import { useTasksQuery } from "@/services/queries/useTasks";
import { useCalendarEventsQuery } from "@/services/queries/useCalendar";
import { useCreateTaskFromEvent } from "@/services/mutations/useCalendar";
import type { TaskFilters, Task, CalendarEvent } from "@/types";

export interface TaskListWithCalendarProps {
  filters?: TaskFilters;
}

type InterleavedItem =
  | { type: "task"; data: Task }
  | { type: "event"; data: CalendarEvent };

export function TaskListWithCalendar({ filters }: TaskListWithCalendarProps) {
  const today = new Date();
  const startDate = startOfDay(today);
  const endDate = endOfDay(today);

  const { data: tasks } = useTasksQuery(filters);
  const { data: events } = useCalendarEventsQuery(startDate, endDate);
  const createTaskFromEvent = useCreateTaskFromEvent();

  // Interleave tasks and events by time
  const interleavedItems = useMemo(() => {
    const items: InterleavedItem[] = [];

    if (tasks) {
      tasks.forEach((task) => {
        items.push({ type: "task", data: task });
      });
    }

    if (events) {
      events.forEach((event) => {
        items.push({ type: "event", data: event });
      });
    }

    // Sort by time
    items.sort((a, b) => {
      const aTime =
        a.type === "task"
          ? a.data.dueDate
            ? new Date(a.data.dueDate).getTime()
            : Infinity
          : new Date(a.data.startTime).getTime();
      const bTime =
        b.type === "task"
          ? b.data.dueDate
            ? new Date(b.data.dueDate).getTime()
            : Infinity
          : new Date(b.data.startTime).getTime();
      return aTime - bTime;
    });

    return items;
  }, [tasks, events]);

  return (
    <div className="space-y-3">
      {interleavedItems.length > 0 ? (
        interleavedItems.map((item) =>
          item.type === "task" ? (
            <Card key={`task-${item.data.id}`}>
              {/* Render task */}
              <div className="p-3">
                <h4 className="font-medium text-text-primary">
                  {item.data.title}
                </h4>
              </div>
            </Card>
          ) : (
            <CalendarEventCard
              key={`event-${item.data.id}`}
              event={item.data}
              onCreateTask={(eventId) => createTaskFromEvent.mutate(eventId)}
              isCreatingTask={createTaskFromEvent.isPending}
            />
          ),
        )
      ) : (
        <Card>
          <p className="text-center text-text-secondary py-8">
            No tasks or events for today
          </p>
        </Card>
      )}
    </div>
  );
}
