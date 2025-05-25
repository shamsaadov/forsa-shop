import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges tailwind classes using tailwind-merge and clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
