"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card, Button, LoadingSkeleton } from "@/components/ui";
import { useNotificationPreferencesQuery } from "@/services/queries/useNotifications";
import { useUpdateNotificationPreferences } from "@/services/mutations/useNotifications";
import type { NotificationPreferences } from "@/types";

export default function NotificationSettingsPage() {
  const { data: preferences, isLoading } = useNotificationPreferencesQuery();
  const updatePreferences = useUpdateNotificationPreferences();

  const [localPreferences, setLocalPreferences] =
    useState<NotificationPreferences | null>(null);

  // Initialize local preferences when data loads
  if (preferences && !localPreferences) {
    setLocalPreferences(preferences);
  }

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!localPreferences) return;

    setLocalPreferences({
      ...localPreferences,
      [key]: !localPreferences[key],
    });
  };

  const handleSave = () => {
    if (!localPreferences) return;

    updatePreferences.mutate(localPreferences);
  };

  const hasChanges =
    JSON.stringify(preferences) !== JSON.stringify(localPreferences);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-bg-light">
        <div className="max-w-3xl mx-auto space-y-6">
          <LoadingSkeleton variant="rectangular" height={200} />
        </div>
      </div>
    );
  }

  if (!localPreferences) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg-light">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Notification Settings
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your notification preferences
          </p>
        </div>

        {/* Preferences */}
        <Card>
          <div className="space-y-6">
            <PreferenceToggle
              label="Task Reminders"
              description="Get notified about upcoming and overdue tasks"
              checked={localPreferences.taskReminders}
              onChange={() => handleToggle("taskReminders")}
            />

            <PreferenceToggle
              label="Goal Milestones"
              description="Celebrate when you reach goal milestones"
              checked={localPreferences.goalMilestones}
              onChange={() => handleToggle("goalMilestones")}
            />

            <PreferenceToggle
              label="AI Insights"
              description="Receive AI-generated recommendations and insights"
              checked={localPreferences.aiInsights}
              onChange={() => handleToggle("aiInsights")}
            />

            <PreferenceToggle
              label="Weekly Summary"
              description="Get a weekly summary of your progress"
              checked={localPreferences.weeklySummary}
              onChange={() => handleToggle("weeklySummary")}
            />

            <PreferenceToggle
              label="System Updates"
              description="Important system notifications and updates"
              checked={localPreferences.systemUpdates}
              onChange={() => handleToggle("systemUpdates")}
            />
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="mt-6 pt-6 border-t border-border-light flex justify-end">
              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={updatePreferences.isPending}
              >
                <Check className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

interface PreferenceToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <h3 className="font-medium text-text-primary">{label}</h3>
        <p className="text-sm text-text-secondary mt-0.5">{description}</p>
      </div>

      <button
        onClick={onChange}
        className={`relative inline-flex h-4 w-22 items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border-medium"
        }`}
      >
        <span
          className={`inline-block h-3 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
