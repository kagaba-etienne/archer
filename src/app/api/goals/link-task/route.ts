import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const LinkTaskSchema = z.object({
  taskId: z.string(),
  goalId: z.string(),
});

export async function POST(request: NextRequest) {
  return withAuth(request, async (userId) => {
    const body = await request.json();
    const { taskId, goalId } = LinkTaskSchema.parse(body);

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

    // Check if link already exists
    const existingLink = await prisma.goalTask.findUnique({
      where: {
        goalId_taskId: {
          goalId,
          taskId,
        },
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { error: "Task is already linked to this goal" },
        { status: 400 },
      );
    }

    // Create the link
    await prisma.goalTask.create({
      data: {
        goalId,
        taskId,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  });
}
