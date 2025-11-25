import { Clock, Target, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge, Card } from "@/components/ui";
import type { Task } from "@/types";

export interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card hoverable className="relative">
      {/* AI Suggestion Badge */}
      {task.aiSuggestions && (
        <div className="absolute top-2 right-2">
          <Badge variant="info" size="sm">
            AI: {task.aiSuggestions.suggestedPriority}
          </Badge>
        </div>
      )}

      {/* Task Content */}
      <div className="space-y-3">
        {/* Title and Status */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-text-secondary mt-1">
                {task.description}
              </p>
            )}
          </div>

          <Badge variant="default" size="sm">
            {task.status}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
          {/* Priority */}
          <div className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span className="capitalize">{task.priority}</span>
          </div>

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), "MMM dd")}</span>
            </div>
          )}

          {/* Goals */}
          {task.goalIds.length > 0 && (
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>
                {task.goalIds.length} goal{task.goalIds.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Blocked Reason */}
        {task.status === "blocked" && task.blockedReason && (
          <div className="p-2 bg-accent-error/10 rounded text-sm text-accent-error">
            <strong>Blocked:</strong> {task.blockedReason}
          </div>
        )}
      </div>
    </Card>
  );
}
