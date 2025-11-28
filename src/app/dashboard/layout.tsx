"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/authStore";
import { queryKeys } from "@/services/queryClient";
import { LoadingSkeleton } from "@/components/ui";
import { MainLayout } from "@/components/layout/MainLayout";

/**
 * Protected layout for dashboard pages
 * Verifies authentication on mount and redirects to login if not authenticated
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, token, user: storedUser, setUser } = useAuthStore();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Verify authentication on mount
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: hasCheckedAuth && isAuthenticated && !!token, // Only run after hydration check
  });

  useEffect(() => {
    // Wait for next tick to allow Zustand persist to hydrate
    const timer = setTimeout(() => {
      setHasCheckedAuth(true);

      // After hydration, check if authenticated
      if (!isAuthenticated || !token) {
        router.push("/login");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, token, router]);

  useEffect(() => {
    if (!hasCheckedAuth) return;

    if (user) {
      // Update auth store with fresh user data from server
      setUser(user);
    } else if (error && !storedUser) {
      // API failed and we don't have cached user data - redirect
      router.push("/login");
    }
  }, [user, error, setUser, router, storedUser, hasCheckedAuth]);

  // Show loading screen while checking auth or verifying with server
  if (
    !hasCheckedAuth ||
    isLoading ||
    (!user && !error && isAuthenticated && token)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="w-full max-w-md space-y-4">
          <LoadingSkeleton variant="rectangular" height={200} />
          <LoadingSkeleton variant="text" width="100%" />
          <LoadingSkeleton variant="text" width="80%" />
        </div>
      </div>
    );
  }

  // Don't render children until authenticated
  // If we have a stored user and token, allow access even if API call failed temporarily
  if (!user && !storedUser) {
    return null;
  }

  // User is authenticated, render children with MainLayout
  return <MainLayout>{children}</MainLayout>;
}
