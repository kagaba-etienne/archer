"use client";

import { RefreshCw } from "lucide-react";
import { Button, Card, LoadingSkeleton } from "@/components/ui";
import { AlignmentScore } from "@/components/features/insights/AlignmentScore";
import { RecommendationCard } from "@/components/features/insights/RecommendationCard";
import { InsightsTrendChart } from "@/components/features/insights/InsightsTrendChart";
import {
  useAlignmentScoreQuery,
  useRecommendationsQuery,
  useInsightsTrendsQuery,
} from "@/services/queries/useInsights";
import {
  useAcceptRecommendation,
  useDismissRecommendation,
  useRefreshInsights,
} from "@/services/mutations/useInsights";

export default function InsightsPage() {
  const { data: alignmentScore, isLoading: loadingScore } =
    useAlignmentScoreQuery();
  const { data: recommendations, isLoading: loadingRecommendations } =
    useRecommendationsQuery();
  const { data: trends, isLoading: loadingTrends } = useInsightsTrendsQuery(30);

  const acceptRecommendation = useAcceptRecommendation();
  const dismissRecommendation = useDismissRecommendation();
  const refreshInsights = useRefreshInsights();

  const handleAccept = (id: string) => {
    acceptRecommendation.mutate({ recommendationId: id });
  };

  const handleDismiss = (id: string) => {
    dismissRecommendation.mutate({
      recommendationId: id,
      reason: "not-relevant",
    });
  };

  const handleRefresh = () => {
    refreshInsights.mutate();
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg-light">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">AI Insights</h1>
            <p className="text-text-secondary mt-1">
              Understand your productivity patterns and get personalized
              recommendations
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            isLoading={refreshInsights.isPending}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Insights
          </Button>
        </div>

        {/* Alignment Score & Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loadingScore ? (
            <LoadingSkeleton variant="rectangular" height={300} />
          ) : alignmentScore ? (
            <AlignmentScore
              score={alignmentScore.score}
              change={alignmentScore.changeFromLastWeek}
              breakdown={{
                taskCompletion: alignmentScore.breakdown.taskCompletion,
                goalProgress: alignmentScore.breakdown.goalProgress,
                consistency: alignmentScore.breakdown.consistency,
              }}
            />
          ) : (
            <Card>
              <p className="text-text-secondary text-center py-8">
                No alignment data available yet
              </p>
            </Card>
          )}

          {loadingTrends ? (
            <LoadingSkeleton variant="rectangular" height={300} />
          ) : trends ? (
            <InsightsTrendChart data={trends} />
          ) : (
            <Card>
              <p className="text-text-secondary text-center py-8">
                No trend data available yet
              </p>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Personalized Recommendations
          </h2>

          {loadingRecommendations ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} variant="rectangular" height={120} />
              ))}
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations
                .filter((r) => r.status === "pending")
                .map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onAccept={handleAccept}
                    onDismiss={handleDismiss}
                  />
                ))}
            </div>
          ) : (
            <Card>
              <p className="text-text-secondary text-center py-8">
                No recommendations available. Complete more tasks and set goals
                to get personalized insights!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
