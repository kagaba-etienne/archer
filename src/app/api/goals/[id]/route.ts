import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateGoalSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(["ACTIVE", "ACHIEVED", "ABANDONED"]).optional(),
});

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

    // Transform to frontend type with taskIds
    const transformedGoal = {
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      horizon: goal.horizon,
      progress: goal.progress,
      taskIds: goal.taskLinks.map((link) => link.taskId),
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };

    return NextResponse.json(transformedGoal);
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(request, async (userId) => {
    const { id } = await params;
    const body = await request.json();
    const { title, description, progress, status } =
      UpdateGoalSchema.parse(body);

    const goal = await prisma.goal.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        title,
        description,
        progress,
        status,
      },
    });

    if (goal.count === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const updatedGoal = await prisma.goal.findUnique({
      where: { id },
      include: {
        taskLinks: true,
      },
    });

    if (!updatedGoal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Transform to frontend type with taskIds
    const transformedGoal = {
      id: updatedGoal.id,
      userId: updatedGoal.userId,
      title: updatedGoal.title,
      description: updatedGoal.description,
      horizon: updatedGoal.horizon,
      progress: updatedGoal.progress,
      taskIds: updatedGoal.taskLinks.map((link) => link.taskId),
      createdAt: updatedGoal.createdAt,
      updatedAt: updatedGoal.updatedAt,
    };

    return NextResponse.json(transformedGoal);
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withAuth(request, async (userId) => {
    const { id } = await params;
    const goal = await prisma.goal.deleteMany({
      where: {
        id,
        userId,
      },
    });

    if (goal.count === 0) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  });
}
