import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 *
 * This utility combines clsx for conditional classes and tailwind-merge
 * to handle Tailwind class conflicts correctly.
 *
 * @example
 * cn('px-4 py-2', condition && 'bg-primary', 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
