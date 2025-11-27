import { format, isSameDay, startOfDay } from "date-fns";
import { LoadingSkeleton, ErrorState } from "@/components/ui";
import { ReflectionCard } from "./ReflectionCard";
import { useReflectionsQuery } from "@/services/queries/useReflections";
import type { Reflection, ReflectionFilters } from "@/types";

export interface ReflectionTimelineProps {
  filters?: ReflectionFilters;
  onEdit?: (reflection: Reflection) => void;
  onDelete?: (reflectionId: string) => void;
}

export function ReflectionTimeline({
  filters,
  onEdit,
  onDelete,
}: ReflectionTimelineProps) {
  const { data: reflections, isLoading, error } = useReflectionsQuery(filters);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <LoadingSkeleton variant="text" width={100} />
            <LoadingSkeleton variant="rectangular" height={150} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load reflections"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!reflections || reflections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No reflections yet</p>
        <p className="text-sm text-text-muted mt-2">
          Start journaling to track your thoughts and progress
        </p>
      </div>
    );
  }

  // Group reflections by date
  const groupedReflections = reflections.reduce(
    (groups, reflection) => {
      const date = startOfDay(new Date(reflection.createdAt));
      const dateKey = date.toISOString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(reflection);

      return groups;
    },
    {} as Record<string, Reflection[]>,
  );

  return (
    <div className="space-y-8">
      {Object.entries(groupedReflections).map(([dateKey, dayReflections]) => {
        const date = new Date(dateKey);
        const isToday = isSameDay(date, new Date());

        return (
          <div key={dateKey} className="space-y-3">
            {/* Date Header */}
            <div className="sticky top-0 bg-bg-light py-2 z-10">
              <h3 className="font-semibold text-text-primary">
                {isToday ? "Today" : format(date, "EEEE, MMMM dd, yyyy")}
              </h3>
              <div className="h-px bg-border-light mt-2"></div>
            </div>

            {/* Reflections for this day */}
            <div className="space-y-3">
              {dayReflections.map((reflection) => (
                <ReflectionCard
                  key={reflection.id}
                  reflection={reflection}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
