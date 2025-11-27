"use client";

import { Calendar } from "lucide-react";
import { Card } from "@/components/ui";
import { CalendarAccountManager } from "@/components/features/calendar/CalendarAccountManager";

export default function CalendarSettingsPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg-light">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Calendar Integration
          </h1>
          <p className="text-text-secondary mt-1">
            Connect your calendar to sync events and tasks
          </p>
        </div>

        {/* Connected Calendars */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Connected Calendars
            </h2>
          </div>
          <CalendarAccountManager />
        </Card>

        {/* How it works */}
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            How it works
          </h3>
          <div className="space-y-3 text-sm text-text-secondary">
            <div>
              <p className="font-medium text-text-primary mb-1">
                📅 Sync Events
              </p>
              <p>
                Your calendar events are automatically synced and visible in
                your task view
              </p>
            </div>
            <div>
              <p className="font-medium text-text-primary mb-1">
                ✨ Create Tasks
              </p>
              <p>Convert calendar events into tasks with one click</p>
            </div>
            <div>
              <p className="font-medium text-text-primary mb-1">
                🔄 Stay Updated
              </p>
              <p>Events sync automatically as they change in your calendar</p>
            </div>
            <div>
              <p className="font-medium text-text-primary mb-1">🔒 Secure</p>
              <p>
                Your calendar data is encrypted and only used to sync with your
                Archer account
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
