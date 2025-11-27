import { Lightbulb } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { useRecommendationsQuery } from "@/services/queries/useInsights";
import { useRouter } from "next/navigation";

export function RecommendationsWidget() {
  const router = useRouter();
  const { data: recommendations } = useRecommendationsQuery();

  const topRecommendations = recommendations
    ?.filter((r) => r.status === "pending")
    .slice(0, 2);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          AI Recommendations
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/insights")}
        >
          View All
        </Button>
      </div>

      {topRecommendations && topRecommendations.length > 0 ? (
        <div className="space-y-3">
          {topRecommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-3 bg-primary/5 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => router.push("/dashboard/insights")}
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary">
                      {rec.title}
                    </p>
                    <Badge variant="warning" size="sm">
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary text-sm">
            No recommendations available
          </p>
        </div>
      )}
    </Card>
  );
}
