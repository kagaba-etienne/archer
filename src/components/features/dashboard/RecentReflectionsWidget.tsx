import { BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Card, Button } from "@/components/ui";
import { useReflectionsQuery } from "@/services/queries/useReflections";
import { useRouter } from "next/navigation";

export function RecentReflectionsWidget() {
  const router = useRouter();
  const { data: reflections } = useReflectionsQuery();

  const recentReflections = reflections?.slice(0, 3);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Recent Reflections
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/reflections")}
        >
          View All
        </Button>
      </div>

      {recentReflections && recentReflections.length > 0 ? (
        <div className="space-y-3">
          {recentReflections.map((reflection) => (
            <div
              key={reflection.id}
              className="p-3 bg-bg-gray rounded-lg hover:bg-border-light transition-colors cursor-pointer"
              onClick={() => router.push("/dashboard/reflections")}
            >
              <p className="text-sm text-text-primary line-clamp-2">
                {reflection.content}
              </p>
              <p className="text-xs text-text-secondary mt-2">
                {format(new Date(reflection.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm mb-3">No reflections yet</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push("/dashboard/reflections")}
          >
            Start Journaling
          </Button>
        </div>
      )}
    </Card>
  );
}
