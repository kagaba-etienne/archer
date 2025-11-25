import { http, HttpResponse, delay } from "msw";
import type { User, LoginCredentials, RegisterUserDto } from "@/types";
import { mockUser, mockCredentials } from "./data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Simulated authentication session storage
 * In a real scenario, this would be managed by httpOnly cookies
 */
let currentUser: User | null = null;

/**
 * MSW handlers for authentication endpoints
 */
export const authHandlers = [
  /**
   * POST /auth/login
   * Authenticate user with email and password
   */
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    await delay(500); // Simulate network latency

    const credentials = (await request.json()) as LoginCredentials;

    // Validate credentials
    if (
      credentials.email === mockCredentials.email &&
      credentials.password === mockCredentials.password
    ) {
      currentUser = mockUser;

      return HttpResponse.json(mockUser, {
        status: 200,
        headers: {
          "Set-Cookie": "auth-token=mock-jwt-token; HttpOnly; Secure; Path=/",
        },
      });
    }

    // Invalid credentials
    return HttpResponse.json(
      {
        message: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      },
      { status: 401 },
    );
  }),

  /**
   * POST /auth/signup
   * Register a new user
   */
  http.post(`${API_BASE_URL}/auth/signup`, async ({ request }) => {
    await delay(700); // Simulate network latency

    const userData = (await request.json()) as RegisterUserDto;

    // Check if email already exists
    if (userData.email === mockCredentials.email) {
      return HttpResponse.json(
        {
          message: "Email already in use",
          code: "EMAIL_EXISTS",
          field: "email",
        },
        { status: 409 },
      );
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      timezone: userData.timezone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    currentUser = newUser;

    return HttpResponse.json(newUser, {
      status: 201,
      headers: {
        "Set-Cookie": "auth-token=mock-jwt-token; HttpOnly; Secure; Path=/",
      },
    });
  }),

  /**
   * POST /auth/logout
   * Logout current user
   */
  http.post(`${API_BASE_URL}/auth/logout`, async () => {
    await delay(300);

    currentUser = null;

    return HttpResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Set-Cookie": "auth-token=; HttpOnly; Secure; Path=/; Max-Age=0",
        },
      },
    );
  }),

  /**
   * GET /auth/me
   * Get current authenticated user
   */
  http.get(`${API_BASE_URL}/auth/me`, async () => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        {
          message: "Authentication required",
          code: "UNAUTHORIZED",
        },
        { status: 401 },
      );
    }

    return HttpResponse.json(currentUser, { status: 200 });
  }),

  /**
   * POST /auth/refresh
   * Refresh authentication token
   */
  http.post(`${API_BASE_URL}/auth/refresh`, async () => {
    await delay(300);

    if (!currentUser) {
      return HttpResponse.json(
        {
          message: "Refresh token invalid or expired",
          code: "INVALID_REFRESH_TOKEN",
        },
        { status: 401 },
      );
    }

    return HttpResponse.json(currentUser, {
      status: 200,
      headers: {
        "Set-Cookie":
          "auth-token=mock-jwt-token-refreshed; HttpOnly; Secure; Path=/",
      },
    });
  }),

  /**
   * PATCH /auth/profile
   * Update user profile
   */
  http.patch(`${API_BASE_URL}/auth/profile`, async ({ request }) => {
    await delay(400);

    if (!currentUser) {
      return HttpResponse.json(
        {
          message: "Authentication required",
          code: "UNAUTHORIZED",
        },
        { status: 401 },
      );
    }

    const updates = (await request.json()) as Partial<User>;

    // Update current user
    currentUser = {
      ...currentUser,
      ...updates,
      updatedAt: new Date(),
    };

    return HttpResponse.json(currentUser, { status: 200 });
  }),
];

/**
 * Helper function to reset mock session (useful for tests)
 */
export function resetMockSession(): void {
  currentUser = null;
}

/**
 * Helper function to set authenticated user (useful for tests)
 */
export function setMockUser(user: User | null): void {
  currentUser = user;
}

/**
 * Helper function to get current mock user
 */
export function getMockUser(): User | null {
  return currentUser;
}
