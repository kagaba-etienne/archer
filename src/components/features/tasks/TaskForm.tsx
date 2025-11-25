import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Modal } from "@/components/ui";
import type { CreateTaskDto, Task } from "@/types";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  priority: z.enum(["low", "medium", "high"]),
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
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          priority: initialData.priority,
          dueDate: initialData.dueDate
            ? new Date(initialData.dueDate).toISOString().split("T")[0]
            : undefined,
        }
      : {
          priority: "medium",
        },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
    reset();
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
            className="w-full px-3 py-2 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
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
            className="w-full px-3 py-2 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            {...register("priority")}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

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
