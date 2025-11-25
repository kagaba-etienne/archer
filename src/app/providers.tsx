"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

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
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--bg-white)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-light)",
          },
          success: {
            iconTheme: {
              primary: "var(--accent-success)",
              secondary: "var(--bg-white)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--accent-error)",
              secondary: "var(--bg-white)",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
