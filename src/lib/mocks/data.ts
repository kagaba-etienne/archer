import type {
  User,
  Goal,
  Task,
  Notification,
  NotificationPreferences,
} from "@/types";

/**
 * Mock test user data
 */
export const mockUser: User = {
  id: "test-user-123",
  name: "Test User",
  email: "test@archer.app",
  timezone: "Africa/Kigali",
  createdAt: new Date("2024-01-15T10:00:00Z"),
  updatedAt: new Date("2024-11-20T14:30:00Z"),
};

/**
 * Mock credentials for testing
 */
export const mockCredentials = {
  email: "test@archer.app",
  password: "testpassword123",
};

/**
 * Alternative test users for different scenarios
 */
export const mockUsers = {
  student: {
    id: "student-456",
    name: "Alice Mwangi",
    email: "alice@student.edu",
    timezone: "Africa/Nairobi",
    createdAt: new Date("2024-02-01T09:00:00Z"),
    updatedAt: new Date("2024-11-20T12:00:00Z"),
  } as User,

  professional: {
    id: "pro-789",
    name: "Emmanuel Kariuki",
    email: "emmanuel@company.com",
    timezone: "Africa/Lagos",
    createdAt: new Date("2024-03-10T08:00:00Z"),
    updatedAt: new Date("2024-11-20T16:45:00Z"),
  } as User,

  newUser: {
    id: "new-user-101",
    name: "Jane Doe",
    email: "jane@newuser.com",
    timezone: "UTC",
    createdAt: new Date("2024-11-20T10:00:00Z"),
    updatedAt: new Date("2024-11-20T10:00:00Z"),
  } as User,
};

/**
 * Mock goals data
 */
export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    userId: "test-user-123",
    title: "Graduate with Honors",
    description: "Complete my degree with a GPA above 3.5",
    horizon: "LONG_TERM",
    progress: 65,
    taskIds: [],
    createdAt: new Date("2024-01-10T10:00:00Z"),
    updatedAt: new Date("2024-11-20T14:00:00Z"),
  },
  {
    id: "goal-2",
    userId: "test-user-123",
    title: "Build Portfolio Website",
    description: "Create a professional portfolio to showcase my projects",
    horizon: "SHORT_TERM",
    progress: 40,
    taskIds: [],
    createdAt: new Date("2024-10-05T09:00:00Z"),
    updatedAt: new Date("2024-11-20T12:30:00Z"),
  },
  {
    id: "goal-3",
    userId: "test-user-123",
    title: "Learn Cloud Architecture",
    description: "Master AWS and Azure for cloud deployment",
    horizon: "MID_TERM",
    progress: 25,
    taskIds: [],
    createdAt: new Date("2024-09-15T11:00:00Z"),
    updatedAt: new Date("2024-11-20T16:00:00Z"),
  },
];

/**
 * Mock tasks data
 */
export const mockTasks: Task[] = [
  {
    id: "task-1",
    userId: "test-user-123",
    title: "Complete React assignment",
    description: "Finish the final project for Web Development course",
    priority: "HIGH",
    status: "IN_PROGRESS",
    dueDate: new Date("2025-11-30T23:59:59Z"),
    scheduledDate: new Date("2025-11-25T09:00:00Z"),
    goalIds: ["goal-1"],
    createdAt: new Date("2024-11-15T10:00:00Z"),
    updatedAt: new Date("2024-11-25T08:30:00Z"),
  },
  {
    id: "task-2",
    userId: "test-user-123",
    title: "Design portfolio layout",
    description: "Create wireframes and mockups for personal website",
    priority: "MEDIUM",
    status: "SCHEDULED",
    dueDate: new Date("2025-11-28T17:00:00Z"),
    scheduledDate: new Date("2025-11-26T14:00:00Z"),
    goalIds: ["goal-2"],
    createdAt: new Date("2024-11-18T14:20:00Z"),
    updatedAt: new Date("2024-11-23T11:15:00Z"),
  },
  {
    id: "task-3",
    userId: "test-user-123",
    title: "Study AWS Solutions Architect",
    description: "Complete modules 1-3 of the AWS certification course",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    dueDate: new Date("2025-12-05T23:59:59Z"),
    goalIds: ["goal-3"],
    createdAt: new Date("2024-11-10T09:00:00Z"),
    updatedAt: new Date("2024-11-24T16:45:00Z"),
  },
  {
    id: "task-4",
    userId: "test-user-123",
    title: "Prepare for midterm exam",
    description: "Review notes for Database Systems midterm",
    priority: "HIGH",
    status: "BLOCKED",
    blockedReason: "Waiting for study guide from professor",
    dueDate: new Date("2025-11-27T14:00:00Z"),
    goalIds: ["goal-1"],
    createdAt: new Date("2024-11-20T12:00:00Z"),
    updatedAt: new Date("2024-11-24T10:30:00Z"),
  },
  {
    id: "task-5",
    userId: "test-user-123",
    title: "Write technical blog post",
    description: "Share learnings about React hooks on portfolio blog",
    priority: "LOW",
    status: "CREATED",
    dueDate: new Date("2025-12-10T23:59:59Z"),
    goalIds: ["goal-2"],
    createdAt: new Date("2024-11-22T15:30:00Z"),
    updatedAt: new Date("2024-11-22T15:30:00Z"),
  },
  {
    id: "task-6",
    userId: "test-user-123",
    title: "Submit scholarship application",
    description:
      "Complete and submit application for academic excellence scholarship",
    priority: "HIGH",
    status: "COMPLETED",
    aiSuggestions: {
      suggestedPriority: "HIGH",
      reasoning: "Important for funding",
      confidence: 0.9,
    },
    dueDate: new Date("2025-11-20T23:59:59Z"),
    completedAt: new Date("2024-11-19T16:20:00Z"),
    goalIds: ["goal-1"],
    createdAt: new Date("2024-11-05T11:00:00Z"),
    updatedAt: new Date("2024-11-19T16:20:00Z"),
  },
  {
    id: "task-7",
    userId: "test-user-123",
    title: "Practice Azure fundamentals",
    description: "Go through Azure learning modules on Microsoft Learn",
    priority: "LOW",
    status: "SCHEDULED",
    dueDate: new Date("2025-12-15T23:59:59Z"),
    scheduledDate: new Date("2025-12-01T10:00:00Z"),
    goalIds: ["goal-3"],
    createdAt: new Date("2024-11-21T13:45:00Z"),
    updatedAt: new Date("2024-11-23T09:20:00Z"),
  },
];

/**
 * Mock notifications data
 */
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "test-user-123",
    type: "task-reminder",
    title: "Task Due Soon",
    message: "Complete React assignment is due in 2 days",
    channel: "in-app",
    read: false,
    actionUrl: "/dashboard/tasks/task-1",
    createdAt: new Date("2024-11-25T10:00:00Z").toISOString(),
  },
  {
    id: "notif-2",
    userId: "test-user-123",
    type: "goal-milestone",
    title: "Goal Milestone Reached",
    message: "You've reached 65% progress on Graduate with Honors!",
    channel: "in-app",
    read: false,
    actionUrl: "/dashboard/goals/goal-1",
    createdAt: new Date("2024-11-24T14:30:00Z").toISOString(),
  },
  {
    id: "notif-3",
    userId: "test-user-123",
    type: "ai-insight",
    title: "AI Recommendation",
    message:
      "Based on your pattern, consider scheduling tasks in the morning for better productivity",
    channel: "in-app",
    read: true,
    actionUrl: "/dashboard/insights",
    createdAt: new Date("2024-11-23T09:15:00Z").toISOString(),
    readAt: new Date("2024-11-23T10:00:00Z").toISOString(),
  },
  {
    id: "notif-4",
    userId: "test-user-123",
    type: "system",
    title: "Welcome to Archer",
    message: "Get started by creating your first goal and linking tasks to it",
    channel: "in-app",
    read: true,
    actionUrl: "/dashboard/goals",
    createdAt: new Date("2024-11-20T08:00:00Z").toISOString(),
    readAt: new Date("2024-11-20T08:30:00Z").toISOString(),
  },
  {
    id: "notif-5",
    userId: "test-user-123",
    type: "task-reminder",
    title: "Task Blocked",
    message: "Prepare for midterm exam is blocked. Review and update status.",
    channel: "in-app",
    read: false,
    actionUrl: "/dashboard/tasks/task-4",
    createdAt: new Date("2024-11-24T16:45:00Z").toISOString(),
  },
];

/**
 * Mock notification preferences
 */
export const mockNotificationPreferences: NotificationPreferences = {
  taskReminders: true,
  goalMilestones: true,
  aiInsights: true,
  weeklySummary: false,
  systemUpdates: true,
};
