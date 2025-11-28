"use client";

import { useState } from "react";
import { Mic, MicOff, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useVoiceAssistant } from "@/lib/hooks/useVoiceAssistant";
import { useRouter } from "next/navigation";
import { useCreateTask } from "@/services/mutations/useTasks";
import { useCreateGoal } from "@/services/mutations/useGoals";
import type { VoiceCommand } from "@/lib/voice/voiceService";

export function VoiceAssistant() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const createTask = useCreateTask();
  const createGoal = useCreateGoal();

  const handleVoiceCommand = (
    command: VoiceCommand,
    parameters: Record<string, unknown>,
  ) => {
    switch (command) {
      case "create-task":
        createTask.mutate({
          title: parameters.title as string,
          description: parameters.title as string,
          priority: "medium",
        });
        break;
      case "create-goal":
        createGoal.mutate({
          title: parameters.title as string,
          horizon: "mid-term",
        });
        break;
      case "view-tasks":
        router.push("/dashboard/tasks");
        break;
      case "view-insights":
        router.push("/dashboard/insights");
        break;
      case "show-today":
        router.push("/dashboard/tasks");
        break;
      case "show-dashboard":
        router.push("/dashboard");
        break;
      case "list-goals":
        router.push("/dashboard/goals");
        break;
      case "record-reflection":
        router.push("/dashboard/reflections");
        break;
      case "help":
        setShowHelp(true);
        break;
    }
  };

  const { isListening, transcript, error, start, stop, isSupported } =
    useVoiceAssistant({
      onCommand: handleVoiceCommand,
    });

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Voice Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowHelp(false)}
      >
        <div
          className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all ${
            isListening
              ? "bg-accent-error shadow-lg"
              : "bg-primary shadow-md hover:shadow-lg"
          }`}
          onClick={isListening ? stop : start}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="mic-off"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <MicOff className="h-7 w-7 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Mic className="h-7 w-7 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listening indicator */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent-error"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
      </motion.button>

      {/* Voice Status */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-8 z-40 max-w-xs"
          >
            <Card className="bg-primary text-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Listening...</p>
                  <button
                    onClick={stop}
                    className="hover:bg-white/20 p-1 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {transcript && (
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <p className="text-sm">{transcript}</p>
                  </div>
                )}

                {error && <p className="text-xs text-red-200">{error}</p>}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 p-4 border-b border-border-light flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Voice Commands</h2>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1 hover:bg-bg-gray rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <VoiceCommandHelp
                  command="Create task"
                  examples={[
                    "Create a task to finish report",
                    "Add task buy groceries",
                    "New task call client",
                  ]}
                />

                <VoiceCommandHelp
                  command="Create goal"
                  examples={[
                    "Create goal learn React",
                    "Set objective finish project by Friday",
                    "New goal improve fitness",
                  ]}
                />

                <VoiceCommandHelp
                  command="Show tasks"
                  examples={["What are my tasks?", "Show tasks", "My tasks"]}
                />

                <VoiceCommandHelp
                  command="View insights"
                  examples={[
                    "Show insights",
                    "How am I doing?",
                    "Show alignment",
                  ]}
                />

                <VoiceCommandHelp
                  command="Dashboard"
                  examples={["Show dashboard", "Home", "Go to dashboard"]}
                />

                <VoiceCommandHelp
                  command="Reflections"
                  examples={[
                    "Record reflection",
                    "Write journal entry",
                    "Reflect on today",
                  ]}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface VoiceCommandHelpProps {
  command: string;
  examples: string[];
}

function VoiceCommandHelp({ command, examples }: VoiceCommandHelpProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-text-primary">{command}</h3>
      <ul className="space-y-1">
        {examples.map((example) => (
          <li
            key={example}
            className="text-sm text-text-secondary flex items-start gap-2"
          >
            <span className="text-primary mt-1">•</span>
            <span>&quot;{example}&quot;</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
