import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

/**
 * Loading skeleton with shimmer effect
 */
export function LoadingSkeleton({
  variant = "text",
  width,
  height,
  className,
  ...props
}: LoadingSkeletonProps) {
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-linear-to-r from-bg-gray via-border-light to-bg-gray bg-size-[200%_100%]",
        variants[variant],
        className,
      )}
      style={{
        width: width,
        height: height || (variant === "text" ? "1rem" : undefined),
        animation: "shimmer 2s infinite",
      }}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}
