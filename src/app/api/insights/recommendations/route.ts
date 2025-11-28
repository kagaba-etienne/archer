import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Recommendation } from "@/types/recommendation.types";

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get("limit") || "10");
      const status = searchParams.get("status") || "pending";

      // Get user's tasks for analysis
      const [tasks] = await Promise.all([
        prisma.task.findMany({
          where: {
            userId,
            status: { in: ["CREATED", "SCHEDULED", "IN_PROGRESS"] },
          },
          include: {
            goalLinks: true,
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
      ]);

      // Generate recommendations based on task/goal analysis
      const recommendations: Recommendation[] = [];

      // 1. Recommend linking unaligned tasks to goals
      const unalignedTasks = tasks.filter(
        (task) => task.goalLinks.length === 0,
      );
      unalignedTasks.slice(0, 3).forEach((task) => {
        recommendations.push({
          id: `link-${task.id}`,
          userId,
          type: "link-task-to-goal",
          taskId: task.id,
          score: 0.8,
          rationale: `Task "${task.title}" is not linked to any goal. Linking it will improve alignment.`,
          actionText: "Link to goal",
          dismissed: false,
          createdAt: new Date(),
          title: "Link task to goal",
          description: `Consider linking "${task.title}" to one of your active goals to improve alignment.`,
          priority: "high",
          category: "goal-alignment",
          status: status as "pending" | "accepted" | "dismissed",
          confidence: 0.8,
          reasoning: "Unaligned tasks reduce your overall alignment score",
        });
      });

      // 2. Recommend scheduling tasks without due dates
      const unscheduledTasks = tasks.filter(
        (task) => !task.dueDate && task.status === "CREATED",
      );
      unscheduledTasks.slice(0, 2).forEach((task) => {
        recommendations.push({
          id: `schedule-${task.id}`,
          userId,
          type: "schedule-task",
          taskId: task.id,
          score: 0.7,
          rationale: `Task "${task.title}" has no due date. Setting a deadline improves commitment.`,
          actionText: "Set due date",
          dismissed: false,
          createdAt: new Date(),
          title: "Schedule task",
          description: `Add a due date to "${task.title}" to better manage your time.`,
          priority: "medium",
          category: "time-management",
          status: status as "pending" | "accepted" | "dismissed",
          confidence: 0.7,
          reasoning: "Tasks with deadlines are 40% more likely to be completed",
        });
      });

      // 3. Recommend adjusting priorities for urgent tasks
      const urgentTasks = tasks.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) <=
            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
          task.priority !== "HIGH",
      );
      urgentTasks.slice(0, 2).forEach((task) => {
        recommendations.push({
          id: `priority-${task.id}`,
          userId,
          type: "adjust-priority",
          taskId: task.id,
          score: 0.85,
          rationale: `Task "${task.title}" is due soon but not marked as urgent.`,
          actionText: "Increase priority",
          dismissed: false,
          createdAt: new Date(),
          title: "Adjust priority",
          description: `Consider increasing the priority of "${task.title}" as it's due within 3 days.`,
          priority: "high",
          category: "task-prioritization",
          status: status as "pending" | "accepted" | "dismissed",
          confidence: 0.85,
          reasoning: "Due date proximity suggests higher priority needed",
        });
      });

      // 4. Recommend reflection prompt
      if (recommendations.length > 0) {
        recommendations.push({
          id: `reflect-${Date.now()}`,
          userId,
          type: "reflection-prompt",
          score: 0.6,
          rationale: "Regular reflection helps maintain alignment with goals.",
          actionText: "Reflect on progress",
          dismissed: false,
          createdAt: new Date(),
          title: "Time to reflect",
          description:
            "Take a moment to reflect on your progress this week. What went well? What could improve?",
          priority: "low",
          category: "habit-formation",
          status: status as "pending" | "accepted" | "dismissed",
          confidence: 0.6,
          reasoning: "Regular reflection improves goal alignment by 25%",
        });
      }

      // Sort by priority and score
      const sortedRecommendations = recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return NextResponse.json({
        recommendations: sortedRecommendations,
        total: sortedRecommendations.length,
      });
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return NextResponse.json(
        { error: "Failed to generate recommendations" },
        { status: 500 },
      );
    }
  });
}
