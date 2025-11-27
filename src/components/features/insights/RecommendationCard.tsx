import { useState } from "react";
import { Lightbulb, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge } from "@/components/ui";
import type { Recommendation } from "@/types";

export interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const priorityColors = {
  high: "error",
  medium: "warning",
  low: "info",
} as const;

const categoryLabels = {
  "task-prioritization": "Task Prioritization",
  "goal-alignment": "Goal Alignment",
  "time-management": "Time Management",
  "habit-formation": "Habit Formation",
} as const;

export function RecommendationCard({
  recommendation,
  onAccept,
  onDismiss,
}: RecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="relative overflow-hidden">
      {/* Priority indicator */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${
          recommendation.priority === "high"
            ? "bg-accent-error"
            : recommendation.priority === "medium"
              ? "bg-accent-warning"
              : "bg-accent-info"
        }`}
      />

      <div className="pl-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-text-primary">
                {recommendation.title}
              </h4>
              <div className="flex items-center gap-2">
                <Badge
                  variant={priorityColors[recommendation.priority]}
                  size="sm"
                >
                  {recommendation.priority}
                </Badge>
                <Badge variant="default" size="sm">
                  {categoryLabels[recommendation.category]}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-text-secondary mt-1">
              {recommendation.description}
            </p>

            {/* Confidence */}
            {recommendation.confidence && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-text-muted">Confidence:</span>
                <div className="flex-1 max-w-[100px] h-1.5 bg-bg-gray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${recommendation.confidence * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {Math.round(recommendation.confidence * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {expanded && recommendation.reasoning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-border-light">
                <p className="text-sm text-text-secondary">
                  <strong>Why this matters:</strong> {recommendation.reasoning}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {recommendation.reasoning && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Learn more <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(recommendation.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
            )}
            {onAccept && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAccept(recommendation.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Apply
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
