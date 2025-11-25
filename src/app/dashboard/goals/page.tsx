"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { GoalCard } from "@/components/features/goals/GoalCard";
import { GoalForm } from "@/components/features/goals/GoalForm";
import { LinkTaskModal } from "@/components/features/goals/LinkTaskModal";
import { useGoalsQuery } from "@/services/queries/useGoals";
import {
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useLinkTaskToGoal,
  useUnlinkTaskFromGoal,
} from "@/services/mutations/useGoals";
import type { CreateGoalDto, Goal } from "@/types";

export default function GoalsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [linkingGoalId, setLinkingGoalId] = useState<string | null>(null);

  const { data: goals, isLoading } = useGoalsQuery();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const linkTask = useLinkTaskToGoal();
  const unlinkTask = useUnlinkTaskFromGoal();

  const handleCreateGoal = (data: CreateGoalDto) => {
    if (editingGoal) {
      updateGoal.mutate(
        { id: editingGoal.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingGoal(undefined);
          },
        },
      );
    } else {
      createGoal.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this goal? Linked tasks will not be deleted.",
      )
    ) {
      deleteGoal.mutate(goalId);
    }
  };

  const handleLinkTask = (taskId: string) => {
    if (linkingGoalId) {
      linkTask.mutate({ taskId, goalId: linkingGoalId });
    }
  };

  const handleUnlinkTask = (taskId: string) => {
    if (linkingGoalId) {
      unlinkTask.mutate({ taskId, goalId: linkingGoalId });
    }
  };

  const linkingGoal = goals?.find((g) => g.id === linkingGoalId);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg-light">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Goals</h1>
            <p className="text-text-secondary mt-1">
              Define and track your long-term objectives
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Goal
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-bg-gray rounded w-3/4"></div>
                  <div className="h-32 bg-bg-gray rounded"></div>
                  <div className="h-4 bg-bg-gray rounded w-1/2"></div>
                </div>
              </Card>
            ))
          ) : goals && goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(g) => {
                  setEditingGoal(g);
                  setIsFormOpen(true);
                }}
                onDelete={handleDeleteGoal}
                onViewTasks={() => setLinkingGoalId(goal.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-text-secondary mb-4">No goals yet</p>
              <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Goal
              </Button>
            </div>
          )}
        </div>

        {/* Goal Form Modal */}
        <GoalForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingGoal(undefined);
          }}
          onSubmit={handleCreateGoal}
          initialData={editingGoal}
          isLoading={createGoal.isPending || updateGoal.isPending}
        />

        {/* Link Task Modal */}
        {linkingGoalId && linkingGoal && (
          <LinkTaskModal
            isOpen={!!linkingGoalId}
            onClose={() => setLinkingGoalId(null)}
            linkedTaskIds={linkingGoal.taskIds}
            onLink={handleLinkTask}
            onUnlink={handleUnlinkTask}
          />
        )}
      </div>
    </div>
  );
}
