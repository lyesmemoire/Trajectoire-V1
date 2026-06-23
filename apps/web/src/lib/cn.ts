import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge intelligent de classes Tailwind.
 * Évite les conflits (ex: "px-4 px-6" → "px-6").
 *
 * Usage:
 *   cn("text-red-500", isActive && "text-blue-500")
 *   → "text-blue-500" si isActive=true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
