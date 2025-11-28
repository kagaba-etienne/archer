import { describe, it, expect } from "vitest";
import { format, isSameDay, addDays, parseISO } from "date-fns";

describe("Date utilities", () => {
  describe("format", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15T00:00:00Z");
      const formatted = format(date, "MMM dd, yyyy");
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
      expect(formatted).toContain("2024");
    });

    it("should format with different patterns", () => {
      const date = new Date("2024-03-20T15:30:00Z");
      expect(format(date, "yyyy-MM-dd")).toContain("2024");
      expect(format(date, "MMMM dd")).toContain("March");
    });

    it("should handle time formatting", () => {
      const date = new Date("2024-01-15T14:30:00Z");
      const formatted = format(date, "HH:mm");
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe("isSameDay", () => {
    it("should return true for same day dates", () => {
      const date1 = new Date("2024-01-15T10:00:00Z");
      const date2 = new Date("2024-01-15T20:30:00Z");
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it("should return false for different days", () => {
      const date1 = new Date(2024, 0, 15, 23, 59, 59);
      const date2 = new Date(2024, 0, 16, 0, 0, 0);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it("should handle dates in different months", () => {
      const date1 = new Date("2024-01-31T12:00:00Z");
      const date2 = new Date("2024-02-01T12:00:00Z");
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe("addDays", () => {
    it("should add days to date", () => {
      const date = new Date("2024-01-15T00:00:00Z");
      const newDate = addDays(date, 5);
      expect(format(newDate, "yyyy-MM-dd")).toContain("2024-01-20");
    });

    it("should handle negative days", () => {
      const date = new Date("2024-01-15T00:00:00Z");
      const newDate = addDays(date, -5);
      expect(format(newDate, "yyyy-MM-dd")).toContain("2024-01-10");
    });

    it("should handle month boundaries", () => {
      const date = new Date("2024-01-30T00:00:00Z");
      const newDate = addDays(date, 5);
      expect(format(newDate, "MMM")).toContain("Feb");
    });

    it("should handle year boundaries", () => {
      const date = new Date("2023-12-30T00:00:00Z");
      const newDate = addDays(date, 5);
      expect(format(newDate, "yyyy")).toContain("2024");
    });
  });

  describe("parseISO", () => {
    it("should parse ISO date string", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const parsed = parseISO(dateString);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2024);
    });

    it("should handle date-only strings", () => {
      const dateString = "2024-03-20";
      const parsed = parseISO(dateString);
      expect(parsed).toBeInstanceOf(Date);
      expect(format(parsed, "yyyy-MM-dd")).toBe("2024-03-20");
    });
  });
});
