import { describe, it, expect } from "vitest";
import { login, signup, logout, getCurrentUser } from "@/lib/api/auth";
import { mockCredentials, mockUser, resetMockSession } from "@/lib/mocks";

/**
 * Example tests demonstrating mock authentication
 *
 * The MSW server is automatically configured via setup.ts
 */
describe("Authentication with Mock Server", () => {
  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      const user = await login(mockCredentials);

      expect(user.id).toBe(mockUser.id);
      expect(user.email).toBe(mockCredentials.email);
      expect(user.name).toBe(mockUser.name);
      expect(user.timezone).toBe(mockUser.timezone);
    });

    it("should reject login with invalid credentials", async () => {
      await expect(
        login({
          email: "wrong@email.com",
          password: "wrongpassword",
        }),
      ).rejects.toThrow();
    });
  });

  describe("signup", () => {
    it("should successfully register a new user", async () => {
      const newUserData = {
        name: "New User",
        email: "newuser@archer.app",
        password: "newpassword123",
        timezone: "Africa/Kigali",
      };

      const user = await signup(newUserData);

      expect(user.name).toBe(newUserData.name);
      expect(user.email).toBe(newUserData.email);
      expect(user.timezone).toBe(newUserData.timezone);
      expect(user.id).toBeDefined();
    });

    it("should reject signup with existing email", async () => {
      await expect(
        signup({
          name: "Test User",
          email: mockCredentials.email, // Already exists
          password: "password123",
          timezone: "UTC",
        }),
      ).rejects.toThrow();
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user when authenticated", async () => {
      // First login
      await login(mockCredentials);

      // Then get current user
      const user = await getCurrentUser();

      expect(user.id).toBe(mockUser.id);
      expect(user.email).toBe(mockUser.email);
      expect(user.name).toBe(mockUser.name);
      expect(user.timezone).toBe(mockUser.timezone);
    });

    it("should reject when not authenticated", async () => {
      // Ensure no user is logged in
      resetMockSession();

      await expect(getCurrentUser()).rejects.toThrow();
    });
  });

  describe("logout", () => {
    it("should successfully logout", async () => {
      // First login
      await login(mockCredentials);

      // Then logout
      await expect(logout()).resolves.not.toThrow();

      // Verify user is logged out
      await expect(getCurrentUser()).rejects.toThrow();
    });
  });
});
