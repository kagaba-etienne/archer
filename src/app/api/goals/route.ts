import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const CreateGoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  horizon: z.enum(["SHORT_TERM", "MID_TERM", "LONG_TERM"]).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const horizon = searchParams.get("horizon");

    const where: Prisma.GoalWhereInput = { userId };

    if (status) where.status = status as Prisma.GoalWhereInput["status"];
    if (horizon) where.horizon = horizon as Prisma.GoalWhereInput["horizon"];

    const goals = await prisma.goal.findMany({
      where,
      include: {
        taskLinks: {
          include: {
            task: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to frontend type with taskIds
    const transformedGoals = goals.map((goal) => ({
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      horizon: goal.horizon,
      progress: goal.progress,
      taskIds: goal.taskLinks.map((link) => link.taskId),
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    }));

    return NextResponse.json({ goals: transformedGoals });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (userId) => {
    const body = await request.json();
    const { title, description, horizon, progress } =
      CreateGoalSchema.parse(body);

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description,
        horizon,
        progress,
      },
    });

    // Transform to frontend type with taskIds
    const transformedGoal = {
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      description: goal.description,
      horizon: goal.horizon,
      progress: goal.progress,
      taskIds: [],
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };

    return NextResponse.json(transformedGoal, { status: 201 });
  });
}
