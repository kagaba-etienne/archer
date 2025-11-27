import { Plus, Target, BookOpen, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui";
import { useRouter } from "next/navigation";

export function QuickActionsWidget() {
  const router = useRouter();

  const actions = [
    {
      icon: Plus,
      label: "New Task",
      onClick: () => router.push("/dashboard/tasks"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Target,
      label: "New Goal",
      onClick: () => router.push("/dashboard/goals"),
      color: "bg-accent-success/10 text-accent-success",
    },
    {
      icon: BookOpen,
      label: "Reflect",
      onClick: () => router.push("/dashboard/reflections"),
      color: "bg-accent-warning/10 text-accent-warning",
    },
    {
      icon: TrendingUp,
      label: "Insights",
      onClick: () => router.push("/dashboard/insights"),
      color: "bg-accent-info/10 text-accent-info",
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-bg-gray hover:bg-border-light transition-colors"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${action.color} mb-2`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-text-primary">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
