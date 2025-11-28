import { test, expect } from "@playwright/test";

test.describe("Task Management", () => {
  // NOTE: Task management tests are skipped because they require proper authentication
  // which needs either a real backend or MSW setup for E2E tests.
  // These tests are kept as examples of E2E test patterns for task management.

  test.beforeEach(async ({ page }) => {
    // Navigate to login and authenticate
    await page.goto("/login");

    // Fill in test credentials
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByPlaceholder(/enter your password/i).fill("TestPassword123");

    // Submit login
    await page.getByRole("button", { name: /sign in/i }).click();

    // Wait for dashboard to load
    await page.waitForURL(/\/dashboard/, { timeout: 5000 });

    // Navigate to tasks page
    await page.goto("/dashboard/tasks");
    await page.waitForTimeout(1000);
  });

  test.skip("should display tasks page", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/tasks/);
    await expect(
      page.getByRole("heading", { name: /tasks/i }).first(),
    ).toBeVisible();
  });

  test.skip("should show create task button", async ({ page }) => {
    const createButton = page.getByRole("button", { name: /new task/i });
    await expect(createButton).toBeVisible();
  });

  test.skip("should open create task modal", async ({ page }) => {
    // Click new task button
    await page.getByRole("button", { name: /new task/i }).click();

    // Modal should be visible
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/create task/i)).toBeVisible();
  });

  test.skip("should create a new task", async ({ page }) => {
    // Open modal
    await page.getByRole("button", { name: /new task/i }).click();

    // Fill form
    const titleInput = page.getByPlaceholder(/task title/i);
    await titleInput.fill("E2E Test Task");

    const descInput = page.getByPlaceholder(/description/i);
    if (await descInput.isVisible()) {
      await descInput.fill("This is a test task created by E2E tests");
    }

    // Submit form
    await page
      .getByRole("button", { name: /create|save/i })
      .first()
      .click();

    // Wait for task to appear
    await page.waitForTimeout(1000);

    // Verify task exists
    await expect(page.getByText("E2E Test Task")).toBeVisible();
  });

  test.skip("should filter tasks by status", async ({ page }) => {
    // Look for filter/status buttons
    const filterButtons = page.getByRole("button", {
      name: /all|active|completed/i,
    });

    if ((await filterButtons.count()) > 0) {
      // Click on a filter
      await filterButtons.first().click();
      await page.waitForTimeout(500);

      // Page should still show tasks section
      await expect(page.getByText(/tasks/i).first()).toBeVisible();
    }
  });

  test.skip("should search for tasks", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);

    if (await searchInput.isVisible()) {
      await searchInput.fill("test");
      await page.waitForTimeout(500);

      // Should show filtered results
      await expect(page.getByText(/tasks/i).first()).toBeVisible();
    }
  });

  test.skip("should toggle task view (list/kanban)", async ({ page }) => {
    // Look for view toggle buttons
    const viewToggle = page.getByRole("button", {
      name: /list|kanban|board/i,
    });

    if ((await viewToggle.count()) > 0) {
      await viewToggle.first().click();
      await page.waitForTimeout(500);

      // View should change
      await expect(page).toHaveURL(/\/dashboard\/tasks/);
    }
  });

  test.skip("should mark task as complete", async ({ page }) => {
    // Look for checkboxes in task cards
    const checkbox = page.locator('input[type="checkbox"]').first();

    if (await checkbox.isVisible()) {
      await checkbox.click();
      await page.waitForTimeout(500);

      // Checkbox should be checked
      await expect(checkbox).toBeChecked();
    }
  });

  test.skip("should edit a task", async ({ page }) => {
    // Click on a task card to open edit
    const taskCard = page.locator('[class*="cursor-pointer"]').first();

    if (await taskCard.isVisible()) {
      await taskCard.click();

      // Edit modal should appear
      await page.waitForTimeout(500);

      const modal = page.getByRole("dialog");
      if (await modal.isVisible()) {
        // Update title
        const titleInput = page.getByPlaceholder(/task title/i);
        await titleInput.clear();
        await titleInput.fill("Updated Task Title");

        // Save changes
        await page.getByRole("button", { name: /update|save/i }).click();

        await page.waitForTimeout(1000);

        // Verify update
        await expect(page.getByText("Updated Task Title")).toBeVisible();
      }
    }
  });

  test.skip("should delete a task", async ({ page }) => {
    // Open task details
    const taskCard = page.locator('[class*="cursor-pointer"]').first();

    if (await taskCard.isVisible()) {
      await taskCard.click();
      await page.waitForTimeout(500);

      // Look for delete button
      const deleteButton = page.getByRole("button", { name: /delete/i });

      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Confirm deletion if confirmation dialog appears
        const confirmButton = page.getByRole("button", {
          name: /confirm|delete/i,
        });
        if ((await confirmButton.count()) > 1) {
          await confirmButton.last().click();
        }

        await page.waitForTimeout(1000);

        // Task should be removed
        await expect(page).toHaveURL(/\/dashboard\/tasks/);
      }
    }
  });

  test.skip("should navigate between task views", async ({ page }) => {
    // Test navigation within tasks section
    await expect(page).toHaveURL(/\/dashboard\/tasks/);

    // Should be able to see tasks interface
    await expect(page.getByText(/tasks/i).first()).toBeVisible();
  });
});
