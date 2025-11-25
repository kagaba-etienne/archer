"use client";

import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { useTasksQuery } from "@/services/queries/useTasks";
import { useUpdateTask } from "@/services/mutations/useTasks";
import type { TaskStatus } from "@/types";

const KANBAN_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "created", label: "Created" },
  { status: "scheduled", label: "Scheduled" },
  { status: "in-progress", label: "In Progress" },
  { status: "blocked", label: "Blocked" },
  { status: "completed", label: "Completed" },
];

export function TaskKanban() {
  const { data: tasks } = useTasksQuery();
  const updateTask = useUpdateTask();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    updateTask.mutate({
      id: taskId,
      data: { status: newStatus },
    });
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks?.filter((task) => task.status === status) || [];
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.status);

          return (
            <div key={column.status} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">
                  {column.label}
                </h3>
                <span className="text-sm text-text-secondary">
                  {columnTasks.length}
                </span>
              </div>

              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 min-h-[200px]">
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
