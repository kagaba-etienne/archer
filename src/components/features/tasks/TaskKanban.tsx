"use client";

import {
  DndContext,
  DragEndEvent,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { useTasksQuery } from "@/services/queries/useTasks";
import { useUpdateTask } from "@/services/mutations/useTasks";
import type { TaskStatus, Task, TaskFilters } from "@/types";

const KANBAN_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "CREATED", label: "Created" },
  { status: "SCHEDULED", label: "Scheduled" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "BLOCKED", label: "Blocked" },
  { status: "COMPLETED", label: "Completed" },
];

function DroppableColumn({
  status,
  children,
}: {
  status: TaskStatus;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-2 min-h-[400px] rounded-lg p-2 transition-colors ${
        isOver
          ? "bg-primary/10 border-2 border-primary border-dashed"
          : "bg-bg-light/50"
      }`}
    >
      {children}
    </div>
  );
}

export interface TaskKanbanProps {
  filters?: TaskFilters;
  onEditTask?: (task: Task) => void;
}

export function TaskKanban({ filters, onEditTask }: TaskKanbanProps) {
  const { data: tasks } = useTasksQuery(filters);
  const updateTask = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks?.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id as string;

    // Check if dropped on a column (status) or another task
    let newStatus: TaskStatus;

    // If dropped directly on a column
    if (KANBAN_COLUMNS.some((col) => col.status === over.id)) {
      newStatus = over.id as TaskStatus;
    } else {
      // If dropped on another task, get that task's status
      const targetTask = tasks?.find((t) => t.id === over.id);
      if (!targetTask) return;
      newStatus = targetTask.status;
    }

    updateTask.mutate({
      id: taskId,
      data: { status: newStatus },
    });
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks?.filter((task) => task.status === status) || [];
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4 kanban-scrollbar">
        <div className="flex gap-4 min-w-max">
          {KANBAN_COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.status);

            return (
              <div key={column.status} className="shrink-0 w-[280px] space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-semibold text-text-primary">
                    {column.label}
                  </h3>
                  <span className="text-sm text-text-secondary bg-bg-light px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableColumn status={column.status}>
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        variant="compact"
                        onEdit={onEditTask}
                        enableDragAndDrop={true}
                      />
                    ))}
                  </DroppableColumn>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80">
            <TaskCard task={activeTask} variant="compact" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
