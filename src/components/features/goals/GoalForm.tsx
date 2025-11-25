"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Modal } from "@/components/ui";
import type { CreateGoalDto, Goal } from "@/types";

const goalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  horizon: z.enum(["short-term", "mid-term", "long-term"]),
  targetDate: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

export interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalDto) => void;
  initialData?: Goal;
  isLoading?: boolean;
}

export function GoalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: GoalFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          horizon: initialData.horizon,
          targetDate: initialData.targetDate
            ? new Date(initialData.targetDate).toISOString().split("T")[0]
            : undefined,
        }
      : {
          horizon: "mid-term",
        },
  });

  const handleFormSubmit = (data: GoalFormData) => {
    onSubmit({
      ...data,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
    });
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Goal" : "Create Goal"}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="Goal title"
          error={errors.title?.message}
          {...register("title")}
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 focus:outline-0 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="Goal description (optional)"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-accent-error mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Horizon
          </label>
          <select
            className="w-full px-3 focus:outline-0 py-2 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            {...register("horizon")}
          >
            <option value="short-term">Short-term (0-3 months)</option>
            <option value="mid-term">Mid-term (3-12 months)</option>
            <option value="long-term">Long-term (1+ years)</option>
          </select>
        </div>

        <Input
          label="Target Date (Optional)"
          type="date"
          {...register("targetDate")}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Update" : "Create"} Goal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
