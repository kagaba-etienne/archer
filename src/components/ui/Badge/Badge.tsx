import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  children: React.ReactNode;
}

/**
 * Badge component for status indicators and labels
 */
export function Badge({
  variant = "default",
  size = "md",
  children,
  className,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-bg-gray text-text-primary border border-border-medium",
    success: "bg-accent-success text-white border border-accent-success",
    warning: "bg-accent-warning text-white border border-accent-warning",
    error: "bg-accent-error text-white border border-accent-error",
    info: "bg-accent-info text-white border border-accent-info",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full transition-all",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
