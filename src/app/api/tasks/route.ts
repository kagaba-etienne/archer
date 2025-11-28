import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().datetime().optional(),
  goalIds: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Prisma.TaskWhereInput = { userId };

    if (status) where.status = status as Prisma.TaskWhereInput["status"];
    if (priority)
      where.priority = priority as Prisma.TaskWhereInput["priority"];

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { dueDate: "asc" },
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json({
      tasks,
      total,
      limit,
      offset,
    });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (userId) => {
    const body = await request.json();
    const { title, description, priority, dueDate, goalIds } =
      CreateTaskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    // Link to goals if provided
    if (goalIds && goalIds.length > 0) {
      await prisma.goalTask.createMany({
        data: goalIds.map((goalId) => ({
          goalId,
          taskId: task.id,
        })),
      });
    }

    return NextResponse.json(task, { status: 201 });
  });
}
