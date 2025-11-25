"use client";

import { useState } from "react";
import { Plus, List, LayoutGrid } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { TaskList } from "@/components/features/tasks/TaskList";
import { TaskKanban } from "@/components/features/tasks/TaskKanban";
import { TaskFilters } from "@/components/features/tasks/TaskFilters";
import { TaskForm } from "@/components/features/tasks/TaskForm";
import { useCreateTask, useUpdateTask } from "@/services/mutations/useTasks";
import type {
  TaskFilters as TaskFiltersType,
  CreateTaskDto,
  Task,
} from "@/types";

export default function TasksPage() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const handleSubmitTask = (data: CreateTaskDto) => {
    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingTask(undefined);
          },
        },
      );
    } else {
      createTask.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false);
          setEditingTask(undefined);
        },
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Tasks</h1>
            <p className="text-text-secondary mt-1">
              Manage and organize your tasks
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex border border-border-medium rounded-lg">
              <button
                className={`p-1 rounded-l-lg ${view === "list" ? "bg-primary text-white" : "text-text-secondary"}`}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List className="h-3 w-3" />
              </button>
              <button
                className={`p-1 rounded-r-lg ${view === "kanban" ? "bg-primary text-white" : "text-text-secondary"}`}
                onClick={() => setView("kanban")}
                aria-label="Kanban view"
              >
                <LayoutGrid className="h-3 w-3" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <TaskFilters
            filters={filters}
            onChange={setFilters}
            viewMode={view}
          />
        </Card>

        {/* Task Views */}
        <div>
          {view === "list" ? (
            <TaskList
              filters={filters}
              onCreateTask={() => setIsFormOpen(true)}
              onEditTask={handleEditTask}
            />
          ) : (
            <TaskKanban filters={filters} onEditTask={handleEditTask} />
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmitTask}
          initialData={editingTask}
          isLoading={createTask.isPending || updateTask.isPending}
        />
      </div>
    </div>
  );
}
