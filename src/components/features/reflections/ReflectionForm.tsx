import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, X } from "lucide-react";
import { Button, Modal, Badge } from "@/components/ui";
import type { CreateReflectionDto, Reflection } from "@/types";

const reflectionSchema = z.object({
  content: z
    .string()
    .min(10, "Reflection must be at least 10 characters")
    .max(5000),
  tags: z.array(z.string()).optional(),
});

type ReflectionFormData = z.infer<typeof reflectionSchema>;

export interface ReflectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReflectionDto) => void;
  initialData?: Reflection;
  isLoading?: boolean;
}

const SUGGESTED_TAGS = [
  "work",
  "personal",
  "growth",
  "challenge",
  "achievement",
  "learning",
  "goal",
  "gratitude",
];

export function ReflectionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: ReflectionFormProps) {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReflectionFormData>({
    resolver: zodResolver(reflectionSchema),
    defaultValues: {
      content: "",
      tags: [],
    },
  });

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          content: initialData.content,
          tags: initialData.tags,
        });
        setTags(initialData.tags || []);
      } else {
        reset({
          content: "",
          tags: [],
        });
        setTags([]);
      }
    }
  }, [isOpen, initialData, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const content = watch("content");
  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;

  const handleFormSubmit = (data: ReflectionFormData) => {
    onSubmit({
      content: data.content,
      tags: tags.length > 0 ? tags : undefined,
    });
    reset();
    setTags([]);
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Reflection" : "New Reflection"}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Reflection Prompt */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-start gap-2">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-primary mb-1">Reflection Prompt</p>
            <p>
              What did you accomplish today? How do your actions align with your
              goals?
            </p>
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Your Reflection
          </label>
          <textarea
            className="w-full px-4 py-3 border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary min-h-[200px] resize-y"
            placeholder="Write your thoughts, feelings, and insights..."
            {...register("content")}
          />
          {errors.content && (
            <p className="text-sm text-accent-error mt-1">
              {errors.content.message}
            </p>
          )}
          <div className="flex justify-between mt-2">
            <p className="text-xs text-text-muted">{wordCount} words</p>
            <p className="text-xs text-text-muted">
              {content?.length || 0} / 5000 characters
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tags (Optional)
          </label>

          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-accent-error"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {SUGGESTED_TAGS.filter((tag) => !tags.includes(tag)).map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => addTag(tag)}
              >
                + {tag}
              </Badge>
            ))}
          </div>

          {/* Custom Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              className="flex-1 px-3 py-2 text-sm border border-border-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Add custom tag..."
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTag(tagInput)}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? "Update" : "Save"} Reflection
          </Button>
        </div>
      </form>
    </Modal>
  );
}
