import type { User } from "@/types";

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
