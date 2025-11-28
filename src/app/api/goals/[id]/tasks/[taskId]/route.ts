import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  return withAuth(request, async (userId) => {
    const { id: goalId, taskId } = await params;

    // Verify both task and goal belong to the user
    const [task, goal] = await Promise.all([
      prisma.task.findFirst({
        where: { id: taskId, userId },
      }),
      prisma.goal.findFirst({
        where: { id: goalId, userId },
      }),
    ]);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Delete the link
    const result = await prisma.goalTask.deleteMany({
      where: {
        goalId,
        taskId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  });
}
