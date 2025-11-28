"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/auth";
import { queryKeys } from "@/services/queryClient";
import { Button, LoadingSkeleton } from "@/components/ui";

export default function Home() {
  const router = useRouter();

  // Check if user is authenticated
  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <LoadingSkeleton width="200px" height="40px" />
      </div>
    );
  }

  // If authenticated, don't render (redirecting)
  if (user) {
    return null;
  }

  // Show landing page for unauthenticated users
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-bg-light">
      <div className="text-center space-y-8 max-w-3xl">
        <h1 className="text-5xl font-bold text-primary">Archer</h1>

        <p className="text-2xl text-text-primary font-medium">
          Align your daily tasks with your long-term goals
        </p>

        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          AI-powered productivity platform for students and young professionals.
          Focus on alignment, not just completion.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link href="/signup">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
