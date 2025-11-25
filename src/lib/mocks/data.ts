import type { User, Goal, Task } from "@/types";

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
    horizon: "long-term",
    targetDate: new Date("2025-06-15T00:00:00Z"),
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
    horizon: "short-term",
    targetDate: new Date("2025-01-30T00:00:00Z"),
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
    horizon: "mid-term",
    targetDate: new Date("2025-04-01T00:00:00Z"),
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
    priority: "high",
    status: "in-progress",
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
    priority: "medium",
    status: "scheduled",
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
    priority: "medium",
    status: "in-progress",
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
    priority: "high",
    status: "blocked",
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
    priority: "low",
    status: "created",
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
    priority: "high",
    status: "completed",
    aiSuggestions: {
      suggestedPriority: "high",
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
    priority: "low",
    status: "scheduled",
    dueDate: new Date("2025-12-15T23:59:59Z"),
    scheduledDate: new Date("2025-12-01T10:00:00Z"),
    goalIds: ["goal-3"],
    createdAt: new Date("2024-11-21T13:45:00Z"),
    updatedAt: new Date("2024-11-23T09:20:00Z"),
  },
];
