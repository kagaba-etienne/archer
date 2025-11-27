import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui";

export interface AlignmentScoreProps {
  score: number; // 0-100
  change?: number; // percentage change from previous period
  breakdown?: {
    taskCompletion: number;
    goalProgress: number;
    consistency: number;
  };
}

export function AlignmentScore({
  score,
  change,
  breakdown,
}: AlignmentScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent-success";
    if (score >= 60) return "text-accent-warning";
    return "text-accent-error";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  const getTrendIcon = () => {
    if (!change) return <Minus className="h-4 w-4" />;
    if (change > 0)
      return <TrendingUp className="h-4 w-4 text-accent-success" />;
    return <TrendingDown className="h-4 w-4 text-accent-error" />;
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Alignment Score
          </h3>
          {change !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon()}
              <span
                className={
                  change > 0 ? "text-accent-success" : "text-accent-error"
                }
              >
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>

        {/* Score Circle */}
        <div className="flex flex-col items-center justify-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            <svg width="160" height="160" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-bg-gray"
              />

              {/* Progress circle */}
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * score) / 100}
                strokeLinecap="round"
                className={getScoreColor(score)}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * score) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>

            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {Math.round(score)}
              </span>
              <span className="text-sm text-text-secondary mt-1">
                {getScoreLabel(score)}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Breakdown */}
        {breakdown && (
          <div className="space-y-3 pt-4 border-t border-border-light">
            <BreakdownItem
              label="Task Completion"
              value={breakdown.taskCompletion}
            />
            <BreakdownItem
              label="Goal Progress"
              value={breakdown.goalProgress}
            />
            <BreakdownItem label="Consistency" value={breakdown.consistency} />
          </div>
        )}
      </div>
    </Card>
  );
}

interface BreakdownItemProps {
  label: string;
  value: number;
}

function BreakdownItem({ label, value }: BreakdownItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium text-text-primary">
          {Math.round(value)}%
        </span>
      </div>
      <div className="h-2 bg-bg-gray rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
