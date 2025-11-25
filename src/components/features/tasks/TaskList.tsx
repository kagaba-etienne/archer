import { Plus } from "lucide-react";
import { Button, LoadingSkeleton, ErrorState } from "@/components/ui";
import { TaskCard } from "./TaskCard";
import { useTasksQuery } from "@/services/queries/useTasks";
import type { TaskFilters } from "@/types";

export interface TaskListProps {
  filters?: TaskFilters;
  onCreateTask?: () => void;
}

export function TaskList({ filters, onCreateTask }: TaskListProps) {
  const { data: tasks, isLoading, error } = useTasksQuery(filters);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton key={i} variant="rectangular" height={120} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load tasks"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary mb-4">No tasks found</p>
        {onCreateTask && (
          <Button variant="primary" onClick={onCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
