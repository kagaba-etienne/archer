"use client";

import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { Button, Card } from "@/components/ui";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Cookie cleared by backend, user cleared from Zustand by logout function
      router.push("/login");
    },
  });

  return (
    <div className="min-h-screen p-8 bg-bg-light">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-text-secondary mt-1">
              Welcome back, {user?.name}!
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            isLoading={logoutMutation.isPending}
          >
            Logout
          </Button>
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
