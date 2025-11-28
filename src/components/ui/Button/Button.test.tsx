import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("should render button with text", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("should render as a button element", () => {
      render(<Button>Submit</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Variants", () => {
    it("should render primary variant by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
    });

    it("should render secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary");
    });

    it("should render outline variant", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-2");
    });

    it("should render ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent");
    });

    it("should render destructive variant", () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-accent-error");
    });
  });

  describe("Sizes", () => {
    it("should render medium size by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4");
    });

    it("should render small size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-sm");
      expect(button).toHaveClass("px-3");
    });

    it("should render large size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-lg");
      expect(button).toHaveClass("px-6");
    });
  });

  describe("Full Width", () => {
    it("should render full width when specified", () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });

    it("should not be full width by default", () => {
      render(<Button>Normal</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("w-full");
    });
  });

  describe("Loading State", () => {
    it("should show loading spinner when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      const spinner = screen.getByRole("button").querySelector("svg");
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass("animate-spin");
    });

    it("should be disabled when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should not show spinner when isLoading is false", () => {
      render(<Button isLoading={false}>Not Loading</Button>);
      const button = screen.getByRole("button");
      const spinner = button.querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should have disabled opacity class", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:opacity-50");
    });

    it("should not be disabled by default", () => {
      render(<Button>Enabled</Button>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  describe("Interactions", () => {
    it("should call onClick handler when clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledOnce();
    });

    it("should not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>,
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should not call onClick when loading", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} isLoading>
          Loading
        </Button>,
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Press me</Button>);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalled();
    });

    it("should have focus ring class", () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus-ring");
    });
  });
});
