"use client";

import { useEffect } from "react";
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
  const setUser = useAuthStore((state) => state.setUser);

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
  });

  useEffect(() => {
    if (user) {
      // Update auth store with user data
      setUser(user);
    } else if (error) {
      // Not authenticated, redirect to login
      // The API client already handles logout, just redirect
      router.push("/login");
    }
  }, [user, error, setUser, router]);

  // Show loading screen while verifying authentication
  if (isLoading) {
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
  if (!user) {
    return null;
  }

  // User is authenticated, render children with MainLayout
  return <MainLayout>{children}</MainLayout>;
}
