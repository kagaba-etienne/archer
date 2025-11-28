/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { VoiceService } from "./voiceService";

describe("VoiceService", () => {
  beforeEach(() => {
    // Mock SpeechRecognition as a constructor
    (global as any).SpeechRecognition = class MockSpeechRecognition {
      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();
      onstart = null;
      onresult = null;
      onerror = null;
      onend = null;
      continuous = false;
      interimResults = false;
      language = "en-US";
    };
    (global as any).webkitSpeechRecognition = (global as any).SpeechRecognition;
  });

  describe("isSupported", () => {
    it("should return true if SpeechRecognition is available", () => {
      expect(VoiceService.isSupported()).toBe(true);
    });

    it("should return false if SpeechRecognition is not available", () => {
      delete (global as any).SpeechRecognition;
      delete (global as any).webkitSpeechRecognition;
      expect(VoiceService.isSupported()).toBe(false);
    });
  });

  describe("parseCommand", () => {
    let service: VoiceService;

    beforeEach(() => {
      service = new VoiceService();
    });

    it("should parse create task command", () => {
      const result = service.parseCommand("Create a task to finish report");
      expect(result?.command).toBe("create-task");
      expect(result?.parameters.title).toBe("to finish report");
      expect(result?.confidence).toBeGreaterThan(0.5);
    });

    it("should parse create task command with variations", () => {
      const variations = [
        "Create a task to buy groceries",
        "Create task to study for exam",
      ];

      variations.forEach((cmd) => {
        const result = service.parseCommand(cmd);
        expect(result?.command).toBe("create-task");
        expect(result?.parameters.title).toBeDefined();
      });
    });

    it("should parse create goal command", () => {
      const result = service.parseCommand("Create a goal to learn React");
      expect(result?.command).toBe("create-goal");
      expect(result?.parameters.title).toBeDefined();
      expect(result?.confidence).toBeGreaterThan(0.5);
    });

    it("should parse create objective command", () => {
      const result = service.parseCommand(
        "Create an objective to improve fitness",
      );
      expect(result?.command).toBe("create-goal");
      expect(result?.parameters.title).toBeDefined();
    });

    it("should parse show tasks command", () => {
      const result = service.parseCommand("Show my tasks");
      expect(result?.command).toBe("view-tasks");
      expect(result?.confidence).toBe(0.9);
    });

    it("should parse view insights command", () => {
      const result = service.parseCommand("Show insights");
      expect(result?.command).toBe("view-insights");
    });

    it("should parse show today command", () => {
      const result = service.parseCommand("What's today");
      expect(result?.command).toBe("show-today");
    });

    it("should parse dashboard command", () => {
      const result = service.parseCommand("Go to dashboard");
      expect(result?.command).toBe("show-dashboard");
    });

    it("should parse list goals command", () => {
      const result = service.parseCommand("Show my goals");
      expect(result?.command).toBe("list-goals");
    });

    it("should parse record reflection command", () => {
      const result = service.parseCommand("Write a reflection");
      expect(result?.command).toBe("record-reflection");
    });

    it("should parse help command", () => {
      const result = service.parseCommand("Help me");
      expect(result?.command).toBe("help");
    });

    it("should return null for unrecognized command", () => {
      const result = service.parseCommand("Lorem ipsum dolor sit amet");
      expect(result).toBeNull();
    });

    it("should handle empty string", () => {
      const result = service.parseCommand("");
      expect(result).toBeNull();
    });

    it("should be case insensitive", () => {
      const result1 = service.parseCommand("CREATE TASK finish homework");
      const result2 = service.parseCommand("create task finish homework");
      expect(result1?.command).toBe(result2?.command);
    });
  });

  describe("Voice Recognition", () => {
    let service: VoiceService;
    let mockRecognition: any;

    beforeEach(() => {
      mockRecognition = {
        start: vi.fn(),
        stop: vi.fn(),
        abort: vi.fn(),
        onstart: null,
        onresult: null,
        onerror: null,
        onend: null,
        continuous: false,
        interimResults: true,
        language: "en-US",
      };

      (global as any).SpeechRecognition = class MockSpeechRecognition {
        constructor() {
          return mockRecognition;
        }
      };
      (global as any).webkitSpeechRecognition = (
        global as any
      ).SpeechRecognition;

      service = new VoiceService();
    });

    it("should start recognition", () => {
      const onResult = vi.fn();
      const onError = vi.fn();

      service.start(onResult, onError);

      expect(mockRecognition.start).toHaveBeenCalled();
      expect(service.isActive()).toBe(true);
    });

    it("should stop recognition", () => {
      service.stop();
      expect(mockRecognition.stop).toHaveBeenCalled();
    });

    it("should abort recognition", () => {
      service.abort();
      expect(mockRecognition.abort).toHaveBeenCalled();
    });

    it("should return empty transcript initially", () => {
      expect(service.getTranscript()).toBe("");
    });
  });
});
