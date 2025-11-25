"use client";

import { useAuthStore } from "@/stores/authStore";
import { Card } from "@/components/ui";
import Link from "next/link";

/**
 * Main dashboard page - accessible at /dashboard
 * Protected by DashboardLayout which verifies authentication
 */
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back, {user?.name}!
          </p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">
            Authentication System Complete ✓
          </h2>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>✅ Cookie-based authentication working</p>
            <p>✅ Protected routes implemented</p>
            <p>✅ Login/Signup pages functional</p>
            <p>✅ Session verification active</p>
            <p>✅ Logout functionality working</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <Link
              href="/dashboard/tasks"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to Tasks
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">User Information</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-text-secondary">Name:</span> {user?.name}
            </p>
            <p>
              <span className="text-text-secondary">Email:</span> {user?.email}
            </p>
            <p>
              <span className="text-text-secondary">Timezone:</span>{" "}
              {user?.timezone}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
