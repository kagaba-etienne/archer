import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Button, Input, Modal } from "@/components/ui";
import type { CreateTaskDto, Task } from "@/types";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z
    .enum([
      "created",
      "scheduled",
      "in-progress",
      "blocked",
      "completed",
      "archived",
    ])
    .optional(),
  blockedReason: z.string().max(200, "Blocked reason too long").optional(),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskDto) => void;
  initialData?: Task;
  isLoading?: boolean;
}

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          description: initialData.description,
          priority: initialData.priority,
          status: initialData.status,
          blockedReason: initialData.blockedReason,
          dueDate: initialData.dueDate
            ? new Date(initialData.dueDate).toISOString().split("T")[0]
            : undefined,
        });
      } else {
        reset({
          title: "",
          description: "",
          priority: "medium",
          status: undefined,
          blockedReason: undefined,
          dueDate: undefined,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Task" : "Create Task"}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="Task title"
          error={errors.title?.message}
          {...register("title")}
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-border-medium bg-bg-white focus:outline-0 text-text-primary transition-all"
            rows={3}
            placeholder="Task description (optional)"
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
            Priority
          </label>
          <select
            className="w-full px-3 py-2 border border-border-medium rounded-lg focus:ring-2 focus:outline-0 focus:ring-primary focus:border-border-medium bg-bg-white text-text-primary appearance-none cursor-pointer transition-all"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2313343b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
            {...register("priority")}
          >
            <option value="low" className="bg-bg-white text-text-primary py-2">
              Low
            </option>
            <option
              value="medium"
              className="bg-bg-white text-text-primary py-2"
            >
              Medium
            </option>
            <option value="high" className="bg-bg-white text-text-primary py-2">
              High
            </option>
          </select>
        </div>

        {initialData && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-border-medium rounded-lg focus:ring-2 focus:outline-0 focus:ring-primary focus:border-border-medium bg-bg-white text-text-primary appearance-none cursor-pointer transition-all"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2313343b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
              {...register("status")}
            >
              <option value="created">Created</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        {initialData && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Blocked Reason (if blocked)
            </label>
            <Input
              placeholder="Why is this task blocked?"
              error={errors.blockedReason?.message}
              {...register("blockedReason")}
            />
          </div>
        )}

        <Input label="Due Date" type="date" {...register("dueDate")} />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Update" : "Create"} Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
