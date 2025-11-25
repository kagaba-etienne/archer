"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Modal, Button, LoadingSkeleton, Badge } from "@/components/ui";
import { useTasksQuery } from "@/services/queries/useTasks";

export interface LinkTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkedTaskIds: string[];
  onLink: (taskId: string) => void;
  onUnlink: (taskId: string) => void;
}

export function LinkTaskModal({
  isOpen,
  onClose,
  linkedTaskIds,
  onLink,
  onUnlink,
}: LinkTaskModalProps) {
  const [search, setSearch] = useState("");
  const { data: tasks, isLoading } = useTasksQuery();

  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()),
  );

  const isLinked = (taskId: string) => linkedTaskIds.includes(taskId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Link Tasks" size="md">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="max-h-96 overflow-y-auto no-scrollbar space-y-2">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} variant="rectangular" height={60} />
            ))
          ) : filteredTasks && filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border border-border-light rounded-lg hover:bg-bg-gray transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{task.title}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="default" size="sm">
                      {task.status}
                    </Badge>
                    <Badge variant="warning" size="sm">
                      {task.priority}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant={isLinked(task.id) ? "destructive" : "primary"}
                  size="sm"
                  onClick={() => {
                    if (isLinked(task.id)) {
                      onUnlink(task.id);
                    } else {
                      onLink(task.id);
                    }
                  }}
                >
                  {isLinked(task.id) ? "Unlink" : "Link"}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-text-secondary py-8">
              No tasks found
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
