import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(request, async (userId) => {
    const { id } = await params;

    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        taskLinks: {
          include: {
            task: true,
          },
        },
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const totalTasks = goal.taskLinks.length;
    const completedTasks = goal.taskLinks.filter(
      (link) => link.task.status === "COMPLETED",
    ).length;
    const inProgressTasks = goal.taskLinks.filter(
      (link) => link.task.status === "IN_PROGRESS",
    ).length;

    const percentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return NextResponse.json({
      goalId: goal.id,
      totalTasks,
      completedTasks,
      inProgressTasks,
      percentage,
    });
  });
}
