"use client";

import { useState } from "react";
import { Target, Calendar, MoreVertical, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { Card, Badge, Button } from "@/components/ui";
import { GoalProgressRing } from "./GoalProgressRing";
import type { Goal } from "@/types";

export interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onViewTasks?: (goalId: string) => void;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onViewTasks,
}: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const horizonColors = {
    "short-term": "info",
    "mid-term": "warning",
    "long-term": "success",
  } as const;

  return (
    <Card hoverable className="relative">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-text-primary">{goal.title}</h3>
            </div>
            {goal.description && (
              <p className="text-sm text-text-secondary">{goal.description}</p>
            )}
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-text-secondary hover:text-text-primary"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center py-4">
          <GoalProgressRing progress={goal.progress} />
        </div>

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Horizon</span>
            <Badge variant={horizonColors[goal.horizon]} size="sm">
              {goal.horizon}
            </Badge>
          </div>

          {goal.targetDate && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Target Date</span>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(goal.targetDate), "MMM dd, yyyy")}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Linked Tasks</span>
            <span className="text-sm font-medium">{goal.taskIds.length}</span>
          </div>
        </div>

        {/* Actions */}
        {onViewTasks && (
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => onViewTasks(goal.id)}
          >
            View Tasks
          </Button>
        )}
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-12 right-4 bg-bg-white border border-border-light rounded-lg shadow-lg p-2 z-10">
          {onEdit && (
            <button
              onClick={() => {
                onEdit(goal);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-bg-gray rounded"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete(goal.id);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-accent-error hover:bg-accent-error/10 rounded"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
