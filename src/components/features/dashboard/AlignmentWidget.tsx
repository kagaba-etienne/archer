import { TrendingUp } from "lucide-react";
import { Card, Button, LoadingSkeleton } from "@/components/ui";
import { useAlignmentScoreQuery } from "@/services/queries/useInsights";
import { useRouter } from "next/navigation";

export function AlignmentWidget() {
  const router = useRouter();
  const { data: alignment, isLoading } = useAlignmentScoreQuery();

  if (isLoading) {
    return (
      <Card>
        <LoadingSkeleton variant="rectangular" height={150} />
      </Card>
    );
  }

  if (!alignment) {
    return (
      <Card>
        <p className="text-text-secondary text-center py-8">
          No alignment data available yet
        </p>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent-success";
    if (score >= 60) return "text-accent-warning";
    return "text-accent-error";
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Your Alignment
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/insights")}
        >
          Details
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-bold ${getScoreColor(alignment.score)}`}
            >
              {Math.round(alignment.score)}%
            </span>
            {alignment.changeFromLastWeek !== undefined && (
              <span
                className={`text-sm ${
                  alignment.changeFromLastWeek > 0
                    ? "text-accent-success"
                    : "text-accent-error"
                }`}
              >
                {alignment.changeFromLastWeek > 0 ? "+" : ""}
                {alignment.changeFromLastWeek}%
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1">
            Tasks aligned with goals
          </p>
        </div>

        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Quick breakdown */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border-light">
        <div className="text-center">
          <p className="text-xs text-text-secondary">Tasks</p>
          <p className="text-sm font-semibold text-text-primary">
            {Math.round(alignment.breakdown.taskCompletion)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-secondary">Goals</p>
          <p className="text-sm font-semibold text-text-primary">
            {Math.round(alignment.breakdown.goalProgress)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-text-secondary">Streak</p>
          <p className="text-sm font-semibold text-text-primary">
            {Math.round(alignment.breakdown.consistency)}%
          </p>
        </div>
      </div>
    </Card>
  );
}
