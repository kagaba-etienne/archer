import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

/**
 * Card component with optional hover effect
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { hoverable = false, padding = "md", children, className, ...props },
    ref,
  ) => {
    const paddings = {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "bg-bg-white rounded-lg border border-border-light shadow-sm",
          "transition-shadow duration-200",
          hoverable && "hover:shadow-md cursor-pointer",
          paddings[padding],
          className,
        )}
        initial={false}
        whileHover={hoverable ? { y: -2 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-b border-border-light pb-3 mb-3", className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardHeader.displayName = "CardHeader";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t border-border-light pt-3 mt-3", className)}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = "CardFooter";
