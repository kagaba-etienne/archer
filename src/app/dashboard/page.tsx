"use client";

import { useAuthStore } from "@/stores/authStore";
import { UpcomingTasksWidget } from "@/components/features/dashboard/UpcomingTasksWidget";
import { GoalProgressWidget } from "@/components/features/dashboard/GoalProgressWidget";
import { AlignmentWidget } from "@/components/features/dashboard/AlignmentWidget";
import { RecentReflectionsWidget } from "@/components/features/dashboard/RecentReflectionsWidget";
import { RecommendationsWidget } from "@/components/features/dashboard/RecommendationsWidget";
import { QuickActionsWidget } from "@/components/features/dashboard/QuickActionsWidget";

/**
 * Main dashboard page - accessible at /dashboard
 * Protected by DashboardLayout which verifies authentication
 */
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg-light">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {getGreeting()}, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-text-secondary mt-1">
            Here&apos;s your productivity overview for today
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Widgets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alignment Score */}
            <AlignmentWidget />

            {/* Upcoming Tasks */}
            <UpcomingTasksWidget />

            {/* Recommendations */}
            <RecommendationsWidget />
          </div>

          {/* Right Column - Secondary Widgets */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActionsWidget />

            {/* Goal Progress */}
            <GoalProgressWidget />

            {/* Recent Reflections */}
            <RecentReflectionsWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
