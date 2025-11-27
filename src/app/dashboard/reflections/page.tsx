"use client";

import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { Button, Card, Input } from "@/components/ui";
import { ReflectionTimeline } from "@/components/features/reflections/ReflectionTimeline";
import { ReflectionForm } from "@/components/features/reflections/ReflectionForm";
import {
  useCreateReflection,
  useUpdateReflection,
  useDeleteReflection,
} from "@/services/mutations/useReflections";
import type {
  CreateReflectionDto,
  Reflection,
  ReflectionFilters,
} from "@/types";

export default function ReflectionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReflection, setEditingReflection] = useState<
    Reflection | undefined
  >();
  const [filters, setFilters] = useState<ReflectionFilters>({});

  const createReflection = useCreateReflection();
  const updateReflection = useUpdateReflection();
  const deleteReflection = useDeleteReflection();

  const handleSubmit = (data: CreateReflectionDto) => {
    if (editingReflection) {
      updateReflection.mutate(
        { id: editingReflection.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingReflection(undefined);
          },
        },
      );
    } else {
      createReflection.mutate(data, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleDelete = (reflectionId: string) => {
    if (confirm("Are you sure you want to delete this reflection?")) {
      deleteReflection.mutate(reflectionId);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg-light">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Reflections</h1>
            <p className="text-text-secondary mt-1">
              Journal your thoughts and track your growth
            </p>
          </div>

          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Reflection
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-text-secondary" />
            <Input
              placeholder="Search reflections..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value || undefined })
              }
            />
          </div>
        </Card>

        {/* Timeline */}
        <ReflectionTimeline
          filters={filters}
          onEdit={(reflection) => {
            setEditingReflection(reflection);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
        />

        {/* Reflection Form Modal */}
        <ReflectionForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingReflection(undefined);
          }}
          onSubmit={handleSubmit}
          initialData={editingReflection}
          isLoading={createReflection.isPending || updateReflection.isPending}
        />
      </div>
    </div>
  );
}
