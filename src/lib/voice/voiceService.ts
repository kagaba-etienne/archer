/* eslint-disable @typescript-eslint/no-explicit-any */

export type VoiceCommand =
  | "create-task"
  | "create-goal"
  | "view-tasks"
  | "view-insights"
  | "show-today"
  | "show-dashboard"
  | "list-goals"
  | "record-reflection"
  | "help";

export interface VoiceRecognitionResult {
  command: VoiceCommand;
  parameters: Record<string, unknown>;
  confidence: number;
  transcript: string;
}

export interface VoiceServiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export class VoiceService {
  private recognition: any = null;
  private isListening = false;
  private transcript = "";
  private tempTranscript = "";

  constructor(config?: VoiceServiceConfig) {
    if (!VoiceService.isSupported()) {
      throw new Error("Web Speech API not supported in this browser");
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = config?.continuous ?? false;
    this.recognition.interimResults = config?.interimResults ?? true;
    this.recognition.language = config?.language ?? "en-US";
  }

  static isSupported(): boolean {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    return !!SpeechRecognition;
  }

  start(
    onResult: (result: Partial<VoiceRecognitionResult>) => void,
    onError: (error: string) => void,
  ): void {
    if (!this.recognition) return;

    this.transcript = "";
    this.tempTranscript = "";
    this.isListening = true;

    this.recognition.onstart = () => {
      onResult({ transcript: "Listening..." });
    };

    this.recognition.onresult = (event: any) => {
      this.tempTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.transcript += transcript + " ";
        } else {
          this.tempTranscript += transcript;
        }
      }

      const fullTranscript = this.transcript + this.tempTranscript;
      onResult({ transcript: fullTranscript });
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error || "Speech recognition error");
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  stop(): void {
    if (!this.recognition) return;
    this.recognition.stop();
    this.isListening = false;
  }

  abort(): void {
    if (!this.recognition) return;
    this.recognition.abort();
    this.isListening = false;
  }

  getTranscript(): string {
    return this.transcript.trim();
  }

  isActive(): boolean {
    return this.isListening;
  }

  /**
   * Parse voice transcript into command
   */
  parseCommand(transcript: string): VoiceRecognitionResult | null {
    const lower = transcript.toLowerCase();

    // Create task
    if (lower.includes("create") && lower.includes("task")) {
      const parts = transcript.match(
        /(?:create|add)\s+(?:a\s+)?task\s+(?:(?:to\s+)?do\s+)?(.+?)(?:\s+(?:for|in|at|on|due|today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday))?(?:\s+(?:today|tomorrow|soon|later|tonight|next\s+week))?$/i,
      );
      return {
        command: "create-task",
        parameters: { title: parts?.[1] || "Untitled task" },
        confidence: parts ? 0.8 : 0.5,
        transcript,
      };
    }

    // Create goal
    if (
      lower.includes("create") &&
      (lower.includes("goal") || lower.includes("objective"))
    ) {
      const parts = transcript.match(
        /(?:create|set)\s+(?:a\s+)?(?:goal|objective)\s+(?:to\s+)?(.+?)(?:\s+(?:in|within|by))?/i,
      );
      return {
        command: "create-goal",
        parameters: { title: parts?.[1] || "Untitled goal" },
        confidence: parts ? 0.8 : 0.5,
        transcript,
      };
    }

    // View tasks
    if (
      (lower.includes("show") && lower.includes("task")) ||
      lower.includes("my tasks") ||
      lower.includes("what do i")
    ) {
      return {
        command: "view-tasks",
        parameters: {},
        confidence: 0.9,
        transcript,
      };
    }

    // View insights
    if (
      (lower.includes("show") &&
        (lower.includes("insight") || lower.includes("alignment"))) ||
      lower.includes("how am i")
    ) {
      return {
        command: "view-insights",
        parameters: {},
        confidence: 0.9,
        transcript,
      };
    }

    // Show today
    if (
      lower.includes("today") ||
      lower.includes("what's today") ||
      lower.includes("today's") ||
      lower.includes("today's tasks")
    ) {
      return {
        command: "show-today",
        parameters: {},
        confidence: 0.9,
        transcript,
      };
    }

    // Dashboard
    if (lower.includes("dashboard") || lower.includes("home")) {
      return {
        command: "show-dashboard",
        parameters: {},
        confidence: 0.9,
        transcript,
      };
    }

    // List goals
    if (lower.includes("goals") || lower.includes("objectives")) {
      return {
        command: "list-goals",
        parameters: {},
        confidence: 0.9,
        transcript,
      };
    }

    // Record reflection
    if (
      lower.includes("reflect") ||
      lower.includes("journal") ||
      (lower.includes("write") && lower.includes("reflection"))
    ) {
      return {
        command: "record-reflection",
        parameters: {},
        confidence: 0.9,
        transcript,
      };
    }

    // Help
    if (lower.includes("help") || lower.includes("commands")) {
      return {
        command: "help",
        parameters: {},
        confidence: 0.9,
        transcript,
      };
    }

    return null;
  }
}
