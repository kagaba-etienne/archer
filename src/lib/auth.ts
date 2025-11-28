import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  userId: string;
}

export async function verifyAuth(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

    const verified = await jwtVerify(token, secret);
    const payload = verified.payload as unknown as JWTPayload;
    return payload.userId;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (userId: string) => Promise<Response>,
): Promise<Response> {
  const userId = await verifyAuth(request);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return handler(userId);
}
