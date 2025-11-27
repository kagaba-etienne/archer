import { Card } from "@/components/ui";
import type { InsightsTrend } from "@/types";

export interface InsightsTrendChartProps {
  data: InsightsTrend;
}

export function InsightsTrendChart({ data }: InsightsTrendChartProps) {
  const chartHeight = 200;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Alignment Trend
      </h3>

      <div className="relative" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-text-muted w-8">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-px bg-border-light" />
            ))}
          </div>

          {/* Line chart */}
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="currentColor"
                  stopOpacity="0.2"
                  className="text-primary"
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0"
                  className="text-primary"
                />
              </linearGradient>
            </defs>

            {data.alignmentHistory.length > 1 && (
              <>
                {/* Area */}
                <path
                  d={generateAreaPath(data.alignmentHistory)}
                  fill="url(#areaGradient)"
                />

                {/* Line */}
                <path
                  d={generateLinePath(data.alignmentHistory)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary"
                />

                {/* Points */}
                {data.alignmentHistory.map((point, i) => (
                  <circle
                    key={i}
                    cx={`${(i / (data.alignmentHistory.length - 1)) * 100}%`}
                    cy={`${100 - (point.score / 100) * 100}%`}
                    r="4"
                    fill="currentColor"
                    className="text-primary"
                  />
                ))}
              </>
            )}
          </svg>

          {/* X-axis labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-text-muted">
            {data.alignmentHistory
              .filter(
                (_, i) => i === 0 || i === data.alignmentHistory.length - 1,
              )
              .map((point, i) => (
                <span key={i}>
                  {new Date(point.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-4 border-t border-border-light">
        <StatItem label="Average" value={`${Math.round(data.averageScore)}%`} />
        <StatItem label="Peak" value={`${Math.round(data.peakScore)}%`} />
        <StatItem label="Current" value={`${Math.round(data.currentScore)}%`} />
      </div>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="text-xl font-bold text-text-primary mt-1">{value}</p>
    </div>
  );
}

function generateLinePath(data: { date: Date; score: number }[]): string {
  if (data.length === 0) return "";

  return data
    .map((point, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (point.score / 100) * 100;
      return `${i === 0 ? "M" : "L"} ${x}% ${y}%`;
    })
    .join(" ");
}

function generateAreaPath(data: { date: Date; score: number }[]): string {
  if (data.length === 0) return "";

  const linePath = generateLinePath(data);
  return `${linePath} L 100% 100% L 0% 100% Z`;
}
