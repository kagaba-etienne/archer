"use client";

import { useState } from "react";
import { Plus, List, LayoutGrid } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { TaskList } from "@/components/features/tasks/TaskList";
import { TaskKanban } from "@/components/features/tasks/TaskKanban";
import { TaskFilters } from "@/components/features/tasks/TaskFilters";
import { TaskForm } from "@/components/features/tasks/TaskForm";
import { useCreateTask } from "@/services/mutations/useTasks";
import type { TaskFilters as TaskFiltersType, CreateTaskDto } from "@/types";

export default function TasksPage() {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  const createTask = useCreateTask();

  const handleCreateTask = (data: CreateTaskDto) => {
    createTask.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg-light">
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
            <div className="flex border border-border-medium rounded-lg p-1">
              <button
                className={`p-2 rounded ${view === "list" ? "bg-primary text-white" : "text-text-secondary"}`}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                className={`p-2 rounded ${view === "kanban" ? "bg-primary text-white" : "text-text-secondary"}`}
                onClick={() => setView("kanban")}
                aria-label="Kanban view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <Button variant="primary" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <TaskFilters filters={filters} onChange={setFilters} />
        </Card>

        {/* Task Views */}
        <div>
          {view === "list" ? (
            <TaskList
              filters={filters}
              onCreateTask={() => setIsFormOpen(true)}
            />
          ) : (
            <TaskKanban />
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateTask}
          isLoading={createTask.isPending}
        />
      </div>
    </div>
  );
}
