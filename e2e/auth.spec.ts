import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto("/");
  });

  test("should display login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/Archer/);
    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible();
  });

  test("should show validation errors for empty login form", async ({
    page,
  }) => {
    await page.goto("/login");

    // Click submit without filling form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Check for validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test("should navigate to signup page", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: /sign up/i }).click();

    await expect(page).toHaveURL(/\/signup/);
    await expect(
      page.getByRole("heading", { name: /create your account/i }),
    ).toBeVisible();
  });

  test("should attempt login with credentials", async ({ page }) => {
    await page.goto("/login");

    // Fill in login form
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByPlaceholder(/enter your password/i).fill("TestPassword123");

    // Submit form
    await page.getByRole("button", { name: /sign in/i }).click();

    // Wait for navigation or error message
    await page.waitForTimeout(1000);

    // Check if either redirected to dashboard or error shown
    const url = page.url();
    if (url.includes("/dashboard")) {
      await expect(page).toHaveURL(/\/dashboard/);
    } else {
      // Error message should be visible
      const errorAlert = page.locator('[role="alert"]');
      await expect(errorAlert).toBeVisible();
    }
  });

  test("should display signup form", async ({ page }) => {
    await page.goto("/signup");

    // Check all form fields are present
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /create/i })).toBeVisible();
  });

  test("should show validation errors for weak password", async ({ page }) => {
    await page.goto("/signup");

    await page.getByLabel(/name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("newuser@example.com");
    await page.getByPlaceholder(/create a password/i).fill("weak");

    await page.getByRole("button", { name: /create/i }).click();

    // Should show password validation error
    await expect(page.getByText(/password must be at least/i)).toBeVisible();
  });

  test("should navigate back to login from signup", async ({ page }) => {
    await page.goto("/signup");

    await page.getByRole("link", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("should redirect to login when accessing protected route", async ({
    page,
  }) => {
    // Try to access dashboard without auth
    await page.goto("/dashboard");

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
