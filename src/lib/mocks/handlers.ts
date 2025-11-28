import { http, HttpResponse, delay } from "msw";
import type {
  User,
  LoginCredentials,
  RegisterUserDto,
  Goal,
  CreateGoalDto,
  UpdateGoalDto,
  LinkTaskToGoalDto,
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  Notification,
  NotificationPreferences,
} from "@/types";
import {
  mockUser,
  mockCredentials,
  mockGoals,
  mockTasks,
  mockNotifications,
  mockNotificationPreferences,
} from "./data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Simulated authentication session storage
 * In a real scenario, this would be managed by httpOnly cookies
 */
let currentUser: User | null = null;

/**
 * Simulated goals storage
 */
let goals: Goal[] = [...mockGoals];

/**
 * Simulated tasks storage
 */
let tasks: Task[] = [...mockTasks];

/**
 * Simulated notifications storage
 */
let notifications: Notification[] = [...mockNotifications];

/**
 * Simulated notification preferences storage
 */
let notificationPreferences: NotificationPreferences = {
  ...mockNotificationPreferences,
};

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

      return HttpResponse.json(
        {
          user: mockUser,
          token: "mock-jwt-token-12345",
        },
        {
          status: 200,
        },
      );
    }

    // Invalid credentials
    return HttpResponse.json(
      {
        error: "Invalid credentials",
      },
      { status: 401 },
    );
  }),

  /**
   * POST /auth/register
   * Register a new user
   */
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    await delay(700); // Simulate network latency

    const userData = (await request.json()) as RegisterUserDto;

    // Check if email already exists
    if (userData.email === mockCredentials.email) {
      return HttpResponse.json(
        {
          error: "User already exists",
        },
        { status: 400 },
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

    return HttpResponse.json(
      {
        user: newUser,
        token: "mock-jwt-token-67890",
      },
      {
        status: 201,
      },
    );
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
 * MSW handlers for goal endpoints
 */
export const goalHandlers = [
  /**
   * GET /goals
   * Get all goals for authenticated user
   */
  http.get(`${API_BASE_URL}/goals`, async () => {
    await delay(300);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const userGoals = goals.filter((goal) => goal.userId === currentUser!.id);
    return HttpResponse.json({ goals: userGoals }, { status: 200 });
  }),

  /**
   * GET /goals/:id
   * Get single goal by ID
   */
  http.get(`${API_BASE_URL}/goals/:id`, async ({ params }) => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const goal = goals.find((g) => g.id === params.id);

    if (!goal || goal.userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Goal not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return HttpResponse.json(goal, { status: 200 });
  }),

  /**
   * POST /goals
   * Create new goal
   */
  http.post(`${API_BASE_URL}/goals`, async ({ request }) => {
    await delay(400);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const data = (await request.json()) as CreateGoalDto;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      userId: currentUser.id,
      title: data.title,
      description: data.description,
      horizon: data.horizon,
      progress: 0,
      taskIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    goals.push(newGoal);

    return HttpResponse.json(newGoal, { status: 201 });
  }),

  /**
   * PATCH /goals/:id
   * Update existing goal
   */
  http.patch(`${API_BASE_URL}/goals/:id`, async ({ params, request }) => {
    await delay(350);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const goalIndex = goals.findIndex((g) => g.id === params.id);

    if (goalIndex === -1 || goals[goalIndex].userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Goal not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const updates = (await request.json()) as UpdateGoalDto;

    goals[goalIndex] = {
      ...goals[goalIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return HttpResponse.json(goals[goalIndex], { status: 200 });
  }),

  /**
   * DELETE /goals/:id
   * Delete goal
   */
  http.delete(`${API_BASE_URL}/goals/:id`, async ({ params }) => {
    await delay(300);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const goalIndex = goals.findIndex((g) => g.id === params.id);

    if (goalIndex === -1 || goals[goalIndex].userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Goal not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    goals.splice(goalIndex, 1);

    return HttpResponse.json(null, { status: 204 });
  }),

  /**
   * GET /goals/:id/progress
   * Get goal progress details
   */
  http.get(`${API_BASE_URL}/goals/:id/progress`, async ({ params }) => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const goal = goals.find((g) => g.id === params.id);

    if (!goal || goal.userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Goal not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return HttpResponse.json(
      {
        goalId: goal.id,
        totalTasks: goal.taskIds.length,
        completedTasks: Math.floor(goal.taskIds.length * (goal.progress / 100)),
        inProgressTasks: Math.ceil(
          goal.taskIds.length * (1 - goal.progress / 100),
        ),
        percentage: goal.progress,
      },
      { status: 200 },
    );
  }),

  /**
   * POST /goals/link-task
   * Link task to goal
   */
  http.post(`${API_BASE_URL}/goals/link-task`, async ({ request }) => {
    await delay(250);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const data = (await request.json()) as LinkTaskToGoalDto;

    const goalIndex = goals.findIndex((g) => g.id === data.goalId);

    if (goalIndex === -1 || goals[goalIndex].userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Goal not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    if (!goals[goalIndex].taskIds.includes(data.taskId)) {
      goals[goalIndex].taskIds.push(data.taskId);
      goals[goalIndex].updatedAt = new Date();
    }

    return HttpResponse.json(null, { status: 204 });
  }),

  /**
   * DELETE /goals/:goalId/tasks/:taskId
   * Unlink task from goal
   */
  http.delete(
    `${API_BASE_URL}/goals/:goalId/tasks/:taskId`,
    async ({ params }) => {
      await delay(250);

      if (!currentUser) {
        return HttpResponse.json(
          { message: "Authentication required", code: "UNAUTHORIZED" },
          { status: 401 },
        );
      }

      const goalIndex = goals.findIndex((g) => g.id === params.goalId);

      if (goalIndex === -1 || goals[goalIndex].userId !== currentUser.id) {
        return HttpResponse.json(
          { message: "Goal not found", code: "NOT_FOUND" },
          { status: 404 },
        );
      }

      goals[goalIndex].taskIds = goals[goalIndex].taskIds.filter(
        (id) => id !== params.taskId,
      );
      goals[goalIndex].updatedAt = new Date();

      return HttpResponse.json(null, { status: 204 });
    },
  ),
];

/**
 * MSW handlers for task endpoints
 */
export const taskHandlers = [
  /**
   * GET /tasks
   * Get all tasks for authenticated user with optional filters
   */
  http.get(`${API_BASE_URL}/tasks`, async ({ request }) => {
    await delay(300);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");
    const goalId = url.searchParams.get("goalId");

    let userTasks = tasks.filter((task) => task.userId === currentUser!.id);

    // Apply filters
    if (status) {
      userTasks = userTasks.filter((task) => task.status === status);
    }
    if (priority) {
      userTasks = userTasks.filter((task) => task.priority === priority);
    }
    if (goalId) {
      userTasks = userTasks.filter((task) => task.goalIds?.includes(goalId));
    }

    return HttpResponse.json({ tasks: userTasks }, { status: 200 });
  }),

  /**
   * GET /tasks/:id
   * Get single task by ID
   */
  http.get(`${API_BASE_URL}/tasks/:id`, async ({ params }) => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const task = tasks.find((t) => t.id === params.id);

    if (!task || task.userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Task not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return HttpResponse.json(task, { status: 200 });
  }),

  /**
   * POST /tasks
   * Create new task
   */
  http.post(`${API_BASE_URL}/tasks`, async ({ request }) => {
    await delay(400);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const data = (await request.json()) as CreateTaskDto;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      userId: currentUser.id,
      title: data.title,
      description: data.description,
      priority: data.priority || "MEDIUM",
      status: "CREATED",
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      goalIds: data.goalIds || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);

    return HttpResponse.json(newTask, { status: 201 });
  }),

  /**
   * PATCH /tasks/:id
   * Update existing task
   */
  http.patch(`${API_BASE_URL}/tasks/:id`, async ({ params, request }) => {
    await delay(350);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const taskIndex = tasks.findIndex((t) => t.id === params.id);

    if (taskIndex === -1 || tasks[taskIndex].userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Task not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const updates = (await request.json()) as UpdateTaskDto;

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      dueDate: updates.dueDate
        ? typeof updates.dueDate === "string"
          ? new Date(updates.dueDate)
          : updates.dueDate
        : tasks[taskIndex].dueDate,
      updatedAt: new Date(),
    };

    return HttpResponse.json(tasks[taskIndex], { status: 200 });
  }),

  /**
   * DELETE /tasks/:id
   * Delete task
   */
  http.delete(`${API_BASE_URL}/tasks/:id`, async ({ params }) => {
    await delay(300);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const taskIndex = tasks.findIndex((t) => t.id === params.id);

    if (taskIndex === -1 || tasks[taskIndex].userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Task not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    tasks.splice(taskIndex, 1);

    return HttpResponse.json(null, { status: 204 });
  }),

  /**
   * GET /tasks/stats
   * Get task statistics for authenticated user
   */
  http.get(`${API_BASE_URL}/tasks/stats`, async () => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const userTasks = tasks.filter((task) => task.userId === currentUser!.id);

    const stats = {
      total: userTasks.length,
      completed: userTasks.filter((t) => t.status === "COMPLETED").length,
      inProgress: userTasks.filter((t) => t.status === "IN_PROGRESS").length,
      blocked: userTasks.filter((t) => t.status === "BLOCKED").length,
      scheduled: userTasks.filter((t) => t.status === "SCHEDULED").length,
      created: userTasks.filter((t) => t.status === "CREATED").length,
      highPriority: userTasks.filter((t) => t.priority === "HIGH").length,
      mediumPriority: userTasks.filter((t) => t.priority === "MEDIUM").length,
      lowPriority: userTasks.filter((t) => t.priority === "LOW").length,
    };

    return HttpResponse.json(stats, { status: 200 });
  }),
];

/**
 * MSW handlers for notification endpoints
 */
export const notificationHandlers = [
  /**
   * GET /notifications
   * Fetch all notifications with optional filters
   */
  http.get(`${API_BASE_URL}/notifications`, async ({ request }) => {
    await delay(300);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const readParam = url.searchParams.get("read");
    const typeParams = url.searchParams.getAll("type");

    let filteredNotifications = notifications.filter(
      (n) => n.userId === currentUser!.id,
    );

    // Filter by read status
    if (readParam !== null) {
      const isRead = readParam === "true";
      filteredNotifications = filteredNotifications.filter(
        (n) => n.read === isRead,
      );
    }

    // Filter by type
    if (typeParams.length > 0) {
      filteredNotifications = filteredNotifications.filter((n) =>
        typeParams.includes(n.type),
      );
    }

    // Sort by creation date (newest first)
    filteredNotifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return HttpResponse.json(
      { notifications: filteredNotifications },
      { status: 200 },
    );
  }),

  /**
   * GET /notifications/unread-count
   * Get count of unread notifications
   */
  http.get(`${API_BASE_URL}/notifications/unread-count`, async () => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const count = notifications.filter(
      (n) => n.userId === currentUser!.id && !n.read,
    ).length;

    return HttpResponse.json({ count }, { status: 200 });
  }),

  /**
   * PATCH /notifications/:id/read
   * Mark notification as read
   */
  http.patch(`${API_BASE_URL}/notifications/:id/read`, async ({ params }) => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const { id } = params;
    const notification = notifications.find((n) => n.id === id);

    if (!notification) {
      return HttpResponse.json(
        { message: "Notification not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    if (notification.userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Unauthorized", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    notification.read = true;
    notification.readAt = new Date().toISOString();

    return HttpResponse.json(notification, { status: 200 });
  }),

  /**
   * POST /notifications/mark-all-read
   * Mark all notifications as read
   */
  http.post(`${API_BASE_URL}/notifications/mark-all-read`, async () => {
    await delay(300);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const now = new Date().toISOString();
    notifications.forEach((n) => {
      if (n.userId === currentUser!.id && !n.read) {
        n.read = true;
        n.readAt = now;
      }
    });

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  /**
   * POST /notifications/:id/delete
   * Delete notification
   */
  http.post(`${API_BASE_URL}/notifications/:id/delete`, async ({ params }) => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const { id } = params;
    const index = notifications.findIndex((n) => n.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Notification not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    if (notifications[index].userId !== currentUser.id) {
      return HttpResponse.json(
        { message: "Unauthorized", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    notifications.splice(index, 1);

    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  /**
   * GET /notifications/preferences
   * Get notification preferences
   */
  http.get(`${API_BASE_URL}/notifications/preferences`, async () => {
    await delay(200);

    if (!currentUser) {
      return HttpResponse.json(
        { message: "Authentication required", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    return HttpResponse.json(notificationPreferences, { status: 200 });
  }),

  /**
   * PATCH /notifications/preferences
   * Update notification preferences
   */
  http.patch(
    `${API_BASE_URL}/notifications/preferences`,
    async ({ request }) => {
      await delay(300);

      if (!currentUser) {
        return HttpResponse.json(
          { message: "Authentication required", code: "UNAUTHORIZED" },
          { status: 401 },
        );
      }

      const updates =
        (await request.json()) as Partial<NotificationPreferences>;

      notificationPreferences = {
        ...notificationPreferences,
        ...updates,
      };

      return HttpResponse.json(notificationPreferences, { status: 200 });
    },
  ),
];

/**
 * Helper function to reset mock session (useful for tests)
 */
export function resetMockSession(): void {
  currentUser = null;
  goals = [...mockGoals];
  tasks = [...mockTasks];
  notifications = [...mockNotifications];
  notificationPreferences = { ...mockNotificationPreferences };
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
