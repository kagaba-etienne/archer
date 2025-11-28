import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "./TaskCard";
import type { Task } from "@/types";

const mockTask: Task = {
  id: "1",
  userId: "user1",
  title: "Test Task",
  description: "Test Description",
  status: "IN_PROGRESS",
  priority: "HIGH",
  dueDate: new Date("2024-12-31"),
  createdAt: new Date(),
  updatedAt: new Date(),
  goalIds: [],
};

describe("TaskCard Component", () => {
  describe("Rendering", () => {
    it("should render task title", () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("should render task description", () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("should not render description in compact variant", () => {
      render(<TaskCard task={mockTask} variant="compact" />);
      expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
    });

    it("should render task status badge", () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.getByText("IN_PROGRESS")).toBeInTheDocument();
    });

    it("should not render status badge in compact variant", () => {
      render(<TaskCard task={mockTask} variant="compact" />);
      const badges = screen.queryAllByText("IN_PROGRESS");
      expect(badges.length).toBe(0);
    });
  });

  describe("Priority Display", () => {
    it("should render high priority badge", () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.getByText("HIGH")).toBeInTheDocument();
    });

    it("should render medium priority badge", () => {
      const mediumTask = { ...mockTask, priority: "MEDIUM" as const };
      render(<TaskCard task={mediumTask} />);
      expect(screen.getByText("MEDIUM")).toBeInTheDocument();
    });

    it("should render low priority badge", () => {
      const lowTask = { ...mockTask, priority: "LOW" as const };
      render(<TaskCard task={lowTask} />);
      expect(screen.getByText("LOW")).toBeInTheDocument();
    });
  });

  describe("Due Date Display", () => {
    it("should render due date when present", () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.getByText(/Dec 31/)).toBeInTheDocument();
    });

    it("should not render due date when not present", () => {
      const taskWithoutDate = { ...mockTask, dueDate: undefined };
      render(<TaskCard task={taskWithoutDate} />);
      expect(screen.queryByText(/Dec/)).not.toBeInTheDocument();
    });
  });

  describe("Goals Display", () => {
    it("should render goal count when goals exist", () => {
      const taskWithGoals = { ...mockTask, goalIds: ["goal1", "goal2"] };
      render(<TaskCard task={taskWithGoals} />);
      expect(screen.getByText(/2/)).toBeInTheDocument();
    });

    it("should not render goals section when no goals", () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.queryByText(/goal/)).not.toBeInTheDocument();
    });

    it("should use singular form for one goal", () => {
      const taskWithOneGoal = { ...mockTask, goalIds: ["goal1"] };
      render(<TaskCard task={taskWithOneGoal} />);
      expect(screen.getByText(/1\s+goal$/)).toBeInTheDocument();
    });
  });

  describe("Blocked Status", () => {
    it("should display blocked reason when task is blocked", () => {
      const blockedTask = {
        ...mockTask,
        status: "BLOCKED" as const,
        blockedReason: "Waiting for approval",
      };
      render(<TaskCard task={blockedTask} />);
      expect(screen.getByText(/Waiting for approval/)).toBeInTheDocument();
      expect(screen.getByText(/Blocked:/)).toBeInTheDocument();
    });

    it("should not display blocked section for non-blocked tasks", () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.queryByText(/Blocked:/)).not.toBeInTheDocument();
    });
  });

  describe("AI Suggestions", () => {
    it("should display AI suggestion badge when present", () => {
      const taskWithAI = {
        ...mockTask,
        aiSuggestions: {
          suggestedPriority: "HIGH" as const,
          reason: "Important deadline",
          confidence: 0.9,
        },
      };
      render(<TaskCard task={taskWithAI} />);
      expect(screen.getByText(/AI:/)).toBeInTheDocument();
    });

    it("should not display AI badge when no suggestions", () => {
      render(<TaskCard task={mockTask} />);
      expect(screen.queryByText(/AI:/)).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onEdit when card is clicked", async () => {
      const handleEdit = vi.fn();
      const user = userEvent.setup();

      render(<TaskCard task={mockTask} onEdit={handleEdit} />);

      const card = screen.getByText("Test Task").closest("div");
      if (card?.parentElement) {
        await user.click(card.parentElement);
        expect(handleEdit).toHaveBeenCalledWith(mockTask);
      }
    });

    it("should have hoverable card", () => {
      const { container } = render(<TaskCard task={mockTask} />);
      // Card component should render
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Drag and Drop", () => {
    it("should show drag handle when enableDragAndDrop is true", () => {
      const { container } = render(
        <TaskCard task={mockTask} enableDragAndDrop />,
      );
      const dragHandle = container.querySelector("svg");
      expect(dragHandle).toBeInTheDocument();
    });

    it("should not show drag handle by default", () => {
      render(<TaskCard task={mockTask} />);
      const gripIcon = screen.queryByTitle("Drag to move task");
      expect(gripIcon).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should apply default styling by default", () => {
      const { container } = render(<TaskCard task={mockTask} />);
      expect(
        container.querySelector('[class*="space-y-3"]'),
      ).toBeInTheDocument();
    });

    it("should apply compact styling when variant is compact", () => {
      const { container } = render(
        <TaskCard task={mockTask} variant="compact" />,
      );
      expect(
        container.querySelector('[class*="space-y-2"]'),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper card structure", () => {
      const { container } = render(<TaskCard task={mockTask} />);
      const card = container.firstChild?.firstChild;
      expect(card).toBeInTheDocument();
    });

    it("should have clickable card when onEdit is provided", () => {
      const { container } = render(
        <TaskCard task={mockTask} onEdit={vi.fn()} />,
      );
      const card = container.querySelector('[class*="cursor-pointer"]');
      expect(card).toBeInTheDocument();
    });
  });
});
