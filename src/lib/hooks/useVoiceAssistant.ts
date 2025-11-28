import { useState, useCallback } from "react";
import { VoiceService, type VoiceCommand } from "@/lib/voice/voiceService";

export interface UseVoiceAssistantOptions {
  onCommand?: (
    command: VoiceCommand,
    parameters: Record<string, unknown>,
  ) => void;
}

export function useVoiceAssistant(options?: UseVoiceAssistantOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<VoiceService | null>(null);

  const initialize = useCallback(() => {
    if (!VoiceService.isSupported()) {
      setError("Web Speech API not supported in your browser");
      return false;
    }

    try {
      const voiceService = new VoiceService();
      setService(voiceService);
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize voice service",
      );
      return false;
    }
  }, []);

  const start = useCallback(() => {
    if (!service) {
      if (!initialize()) return;
    }

    setTranscript("");
    setError(null);
    setIsListening(true);

    service!.start(
      (result) => {
        setTranscript(result.transcript || "");
      },
      (error) => {
        setError(error);
        setIsListening(false);
      },
    );
  }, [service, initialize]);

  const stop = useCallback(() => {
    if (!service) return;

    service.stop();
    setIsListening(false);

    // Parse and execute command
    const finalTranscript = service.getTranscript();
    if (finalTranscript) {
      const result = service.parseCommand(finalTranscript);
      if (result && options?.onCommand) {
        options.onCommand(result.command, result.parameters);
      }
    }
  }, [service, options]);

  const abort = useCallback(() => {
    if (!service) return;
    service.abort();
    setIsListening(false);
    setTranscript("");
  }, [service]);

  return {
    isListening,
    transcript,
    error,
    start,
    stop,
    abort,
    isSupported: VoiceService.isSupported(),
  };
}
