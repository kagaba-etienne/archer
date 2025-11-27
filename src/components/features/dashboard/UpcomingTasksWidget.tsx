import { Plus, Clock } from "lucide-react";
import { format } from "date-fns";
import { Card, Button, Badge, LoadingSkeleton } from "@/components/ui";
import { useTasksQuery } from "@/services/queries/useTasks";
import { useRouter } from "next/navigation";

export function UpcomingTasksWidget() {
  const router = useRouter();
  const { data: tasks, isLoading } = useTasksQuery({
    status: ["created", "scheduled", "in-progress"],
  });

  // Get next 5 upcoming tasks
  const upcomingTasks = tasks
    ?.filter((t) => t.dueDate)
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Upcoming Tasks
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} variant="rectangular" height={60} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Upcoming Tasks
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/tasks")}
        >
          View All
        </Button>
      </div>

      {upcomingTasks && upcomingTasks.length > 0 ? (
        <div className="space-y-2">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 bg-bg-gray rounded-lg hover:bg-border-light transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard/tasks")}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-text-primary text-sm">
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
                      <Clock className="h-3 w-3" />
                      {format(new Date(task.dueDate), "MMM dd, h:mm a")}
                    </div>
                  )}
                </div>
                <Badge variant="default" size="sm">
                  {task.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-text-secondary text-sm mb-3">No upcoming tasks</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/dashboard/tasks")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      )}
    </Card>
  );
}
