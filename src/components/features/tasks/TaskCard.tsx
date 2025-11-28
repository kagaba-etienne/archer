import { Clock, Target, AlertCircle, GripVertical } from "lucide-react";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge, Card } from "@/components/ui";
import type { Task } from "@/types";

export interface TaskCardProps {
  task: Task;
  variant?: "default" | "compact";
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
  enableDragAndDrop?: boolean;
}

const getPriorityStyles = (priority: Task["priority"]) => {
  switch (priority) {
    case "HIGH":
      return {
        color: "text-accent-warning",
        bg: "bg-accent-warning/10",
        icon: "text-accent-warning",
      };
    case "MEDIUM":
      return {
        color: "text-secondary",
        bg: "bg-secondary/10",
        icon: "text-secondary",
      };
    case "LOW":
      return {
        color: "text-accent-success",
        bg: "bg-accent-success/10",
        icon: "text-accent-success",
      };
  }
};

export function TaskCard({
  task,
  variant = "default",
  onEdit,
  enableDragAndDrop = false,
}: TaskCardProps) {
  const isCompact = variant === "compact";
  const priorityStyles = getPriorityStyles(task.priority);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: !enableDragAndDrop,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCardClick = () => {
    // Only open edit modal if not dragging
    if (onEdit && !isDragging) {
      onEdit(task);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        hoverable
        className={`relative break-inside-avoid ${onEdit ? "cursor-pointer" : ""}`}
        padding={isCompact ? "sm" : "md"}
        onClick={handleCardClick}
      >
        {/* Drag Handle - only visible in Kanban view */}
        {enableDragAndDrop && (
          <div
            {...attributes}
            {...listeners}
            className="absolute h-full rounded-l-lg flex items-center -left-0.5 top-1/2 -translate-y-1/2  rounded hover:bg-primary/10 transition-colors cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            title="Drag to move task"
          >
            <GripVertical className="h-3 w-3 text-text-secondary hover:text-primary transition-colors" />
          </div>
        )}

        {/* Task Content */}
        <div className={isCompact ? "space-y-2" : "space-y-3"}>
          {/* Title and Status */}
          <div className="flex items-start justify-between gap-2">
            <div className={`flex-1 min-w-0`}>
              <h3
                className={`font-semibold text-text-primary ${isCompact ? "text-sm line-clamp-2" : ""}`}
              >
                {task.title}
              </h3>
              {task.description && !isCompact && (
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            <div className="w-fit flex-col flex gap-1">
              {!isCompact && (
                <Badge variant="default" size="sm">
                  {task.status}
                </Badge>
              )}
              {/* AI Suggestion Badge */}
              {task.aiSuggestions && (
                <Badge variant="info" size="sm">
                  AI: {task.aiSuggestions.suggestedPriority}
                </Badge>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div
            className={`flex flex-wrap gap-2 ${isCompact ? "text-xs" : "text-sm"} text-text-secondary`}
          >
            {/* Priority */}
            <div
              className={`flex items-center gap-1 px-1 py-0.5 rounded ${priorityStyles.bg}`}
            >
              <AlertCircle
                className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} ${priorityStyles.icon}`}
              />
              <span
                className={`capitalize font-medium ${priorityStyles.color}`}
              >
                {task.priority}
              </span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Clock className={isCompact ? "h-3 w-3" : "h-4 w-4"} />
                <span>{format(new Date(task.dueDate), "MMM dd")}</span>
              </div>
            )}

            {/* Goals */}
            {task.goalIds && task.goalIds.length > 0 && (
              <div className="flex items-center gap-1">
                <Target className={isCompact ? "h-3 w-3" : "h-4 w-4"} />
                <span>
                  {task.goalIds.length}{" "}
                  {isCompact ? "" : `goal${task.goalIds.length > 1 ? "s" : ""}`}
                </span>
              </div>
            )}
          </div>

          {/* Blocked Reason */}
          {task.status === "BLOCKED" && task.blockedReason && (
            <div
              className={`p-2 bg-accent-warning/10 border border-accent-warning/20 rounded ${isCompact ? "text-xs" : "text-sm"} text-accent-warning`}
            >
              <strong>Blocked:</strong> {task.blockedReason}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
