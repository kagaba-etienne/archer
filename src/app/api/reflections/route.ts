import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const CreateReflectionSchema = z.object({
  content: z.string().min(10),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (userId) => {
    const { searchParams } = new URL(request.url);
    const sentiment = searchParams.get("sentiment");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: Prisma.ReflectionWhereInput = { userId };
    if (sentiment)
      where.sentiment = sentiment as Prisma.ReflectionWhereInput["sentiment"];

    const [reflections, total] = await Promise.all([
      prisma.reflection.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.reflection.count({ where }),
    ]);

    return NextResponse.json({
      reflections,
      total,
      limit,
      offset,
    });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (userId) => {
    const body = await request.json();
    const { content, tags } = CreateReflectionSchema.parse(body);

    // Simple sentiment analysis (can be replaced with AI service)
    const sentiment = analyzeSentiment(content);

    const reflection = await prisma.reflection.create({
      data: {
        userId,
        content,
        tags,
        sentiment,
      },
    });

    return NextResponse.json(reflection, { status: 201 });
  });
}

function analyzeSentiment(text: string): "POSITIVE" | "NEUTRAL" | "NEGATIVE" {
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "happy",
    "productive",
    "success",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "sad",
    "frustrated",
    "failed",
    "stuck",
  ];

  const lowerText = text.toLowerCase();

  const positiveCount = positiveWords.filter((word) =>
    lowerText.includes(word),
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lowerText.includes(word),
  ).length;

  if (positiveCount > negativeCount) return "POSITIVE";
  if (negativeCount > positiveCount) return "NEGATIVE";
  return "NEUTRAL";
}
