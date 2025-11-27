"use client";

import Link from "next/link";
import { Bell, Calendar, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui";

/**
 * Settings index page - shows all settings categories
 */
export default function SettingsPage() {
  const settingsCategories = [
    {
      title: "Notifications",
      description: "Manage your notification preferences",
      icon: Bell,
      href: "/dashboard/settings/notifications",
    },
    {
      title: "Calendar Integration",
      description: "Connect and manage your calendars",
      icon: Calendar,
      href: "/dashboard/settings/calendar",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-bg-light">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <p className="text-text-secondary mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Settings Categories */}
        <div className="flex flex-col gap-3">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.href} href={category.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">
                          {category.title}
                        </h3>
                        <p className="text-sm text-text-secondary mt-0.5">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-text-muted" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
