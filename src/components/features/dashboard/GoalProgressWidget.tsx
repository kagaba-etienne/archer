import { Target } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { GoalProgressRing } from "@/components/features/goals/GoalProgressRing";
import { useGoalsQuery } from "@/services/queries/useGoals";
import { useRouter } from "next/navigation";

export function GoalProgressWidget() {
  const router = useRouter();
  const { data: goals } = useGoalsQuery();

  // Get goals with progress sorted by progress (lowest first to highlight needs attention)
  const sortedGoals = goals
    ?.slice()
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 3);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Goal Progress
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/goals")}
        >
          View All
        </Button>
      </div>

      {sortedGoals && sortedGoals.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {sortedGoals.map((goal) => (
            <div
              key={goal.id}
              className="flex flex-col items-center cursor-pointer min-w-0"
              onClick={() => router.push("/dashboard/goals")}
            >
              <GoalProgressRing
                progress={goal.progress}
                size={80}
                strokeWidth={6}
              />
              <div className="text-center mt-2 w-full px-1">
                <p
                  className="text-xs font-medium text-text-primary truncate"
                  title={goal.title}
                >
                  {goal.title}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {goal.taskIds.length} tasks
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm mb-3">No goals set yet</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/dashboard/goals")}
          >
            Create Goal
          </Button>
        </div>
      )}
    </Card>
  );
}
