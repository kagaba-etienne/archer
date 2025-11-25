"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "sonner";

// Enable MSW in development
if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true"
) {
  import("@/lib/mocks/browser").then(({ worker }) => {
    worker.start({
      onUnhandledRequest: "bypass", // Allow real API calls for unmocked routes
    });
    console.log("🔶 MSW Mock Server Active");
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10, // 10 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="top-right"
        duration={4000}
        toastOptions={{
          style: {
            background: "var(--bg-white)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-light)",
          },
          className: "sonner-toast",
        }}
      />
    </QueryClientProvider>
  );
}
