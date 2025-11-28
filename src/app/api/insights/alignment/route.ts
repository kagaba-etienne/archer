import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { AlignmentScore } from "@/types/insights.types";

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    try {
      // Get user's tasks and goals
      const [tasks, goals, completedTasks] = await Promise.all([
        prisma.task.findMany({
          where: {
            userId,
            status: { in: ["CREATED", "SCHEDULED", "IN_PROGRESS"] },
          },
          include: {
            goalLinks: true,
          },
        }),
        prisma.goal.findMany({
          where: { userId, status: "ACTIVE" },
        }),
        prisma.task.count({
          where: {
            userId,
            status: "COMPLETED",
            updatedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
      ]);

      // Calculate alignment metrics
      const tasksAligned = tasks.filter(
        (task) => task.goalLinks.length > 0,
      ).length;
      const tasksUnaligned = tasks.length - tasksAligned;

      // Calculate alignment score (0-100)
      const taskCompletionScore =
        tasks.length > 0
          ? Math.min(100, (completedTasks / tasks.length) * 100)
          : 0;

      const goalProgressScore =
        goals.length > 0
          ? (goals.reduce((sum, goal) => sum + goal.progress, 0) /
              goals.length) *
            100
          : 0;

      const consistencyScore =
        tasks.length > 0 ? (tasksAligned / tasks.length) * 100 : 0;

      const overallScore =
        (taskCompletionScore * 0.4 +
          goalProgressScore * 0.3 +
          consistencyScore * 0.3) *
        0.01;

      // Get previous week's score for trend calculation
      const lastWeekScore = await calculatePreviousWeekScore(userId);
      const changeFromLastWeek = lastWeekScore
        ? ((overallScore - lastWeekScore) / lastWeekScore) * 100
        : 0;

      const trend =
        changeFromLastWeek > 5
          ? "improving"
          : changeFromLastWeek < -5
            ? "declining"
            : "stable";

      const alignmentScore: AlignmentScore = {
        score: Math.round(overallScore),
        trend,
        tasksAligned,
        tasksUnaligned,
        calculatedAt: new Date(),
        changeFromLastWeek: Math.round(changeFromLastWeek),
        breakdown: {
          taskCompletion: Math.round(taskCompletionScore),
          goalProgress: Math.round(goalProgressScore),
          consistency: Math.round(consistencyScore),
        },
      };

      return NextResponse.json(alignmentScore);
    } catch (error) {
      console.error("Error calculating alignment score:", error);
      return NextResponse.json(
        { error: "Failed to calculate alignment score" },
        { status: 500 },
      );
    }
  });
}

async function calculatePreviousWeekScore(
  userId: string,
): Promise<number | null> {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [tasks, completedTasks] = await Promise.all([
      prisma.task.count({
        where: {
          userId,
          createdAt: { gte: twoWeeksAgo, lte: oneWeekAgo },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          status: "COMPLETED",
          updatedAt: { gte: twoWeeksAgo, lte: oneWeekAgo },
        },
      }),
    ]);

    if (tasks === 0) return null;

    return (completedTasks / tasks) * 100;
  } catch (error) {
    console.error("Error calculating previous week score:", error);
    return null;
  }
}
