import { useState } from "react";
import { format } from "date-fns";
import { Smile, Meh, Frown, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import type { Reflection, Sentiment } from "@/types";

export interface ReflectionCardProps {
  reflection: Reflection;
  onEdit?: (reflection: Reflection) => void;
  onDelete?: (reflectionId: string) => void;
}

const sentimentIcons: Record<Sentiment, React.ReactNode> = {
  positive: <Smile className="h-5 w-5 text-accent-success" />,
  neutral: <Meh className="h-5 w-5 text-text-secondary" />,
  negative: <Frown className="h-5 w-5 text-accent-warning" />,
};

export function ReflectionCard({
  reflection,
  onEdit,
  onDelete,
}: ReflectionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const contentPreview =
    reflection.content.length > 200
      ? reflection.content.slice(0, 200) + "..."
      : reflection.content;

  return (
    <Card className="relative">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {reflection.sentiment && sentimentIcons[reflection.sentiment]}
            <span className="text-sm text-text-secondary">
              {format(new Date(reflection.createdAt), "MMM dd, yyyy · h:mm a")}
            </span>
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-text-secondary hover:text-text-primary"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <p className="text-text-primary whitespace-pre-wrap">
            {expanded ? reflection.content : contentPreview}
          </p>

          {reflection.content.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary text-sm hover:underline mt-2"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Tags */}
        {reflection.tags && reflection.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {reflection.tags.map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {reflection.summary && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-text-secondary">
              <strong className="text-primary">AI Summary:</strong>{" "}
              {reflection.summary}
            </p>
          </div>
        )}

        {/* Sentiment Score */}
        {reflection.sentimentScore !== undefined && (
          <div className="text-xs text-text-muted">
            Sentiment score: {reflection.sentimentScore.toFixed(2)}
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-12 right-4 bg-bg-white border border-border-light rounded-lg shadow-lg p-2 z-10">
          {onEdit && (
            <button
              onClick={() => {
                onEdit(reflection);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-bg-gray rounded"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete(reflection.id);
                setShowMenu(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-accent-error hover:bg-accent-error/10 rounded"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
