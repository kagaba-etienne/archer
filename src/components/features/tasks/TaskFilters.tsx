import { Input, Badge } from "@/components/ui";
import type {
  TaskFilters as TaskFiltersType,
  TaskStatus,
  TaskPriority,
} from "@/types";

export interface TaskFiltersProps {
  filters: TaskFiltersType;
  onChange: (filters: TaskFiltersType) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const statuses: TaskStatus[] = [
    "created",
    "scheduled",
    "in-progress",
    "blocked",
    "completed",
  ];
  const priorities: TaskPriority[] = ["low", "medium", "high"];

  const toggleStatus = (status: TaskStatus) => {
    const currentStatuses = Array.isArray(filters.status)
      ? filters.status
      : filters.status
        ? [filters.status]
        : [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    onChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const togglePriority = (priority: TaskPriority) => {
    const currentPriorities = Array.isArray(filters.priority)
      ? filters.priority
      : filters.priority
        ? [filters.priority]
        : [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority];

    onChange({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search tasks..."
        value={filters.search || ""}
        onChange={(e) =>
          onChange({ ...filters, search: e.target.value || undefined })
        }
      />

      {/* Status Filter */}
      <div>
        <label className="text-sm font-medium text-text-primary mb-2 block">
          Status
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const isSelected = Array.isArray(filters.status)
              ? filters.status.includes(status)
              : filters.status === status;

            return (
              <Badge
                key={status}
                variant={isSelected ? "info" : "default"}
                className="cursor-pointer"
                onClick={() => toggleStatus(status)}
              >
                {status}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="text-sm font-medium text-text-primary mb-2 block">
          Priority
        </label>
        <div className="flex flex-wrap gap-2">
          {priorities.map((priority) => {
            const isSelected = Array.isArray(filters.priority)
              ? filters.priority.includes(priority)
              : filters.priority === priority;

            return (
              <Badge
                key={priority}
                variant={isSelected ? "warning" : "default"}
                className="cursor-pointer capitalize"
                onClick={() => togglePriority(priority)}
              >
                {priority}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
