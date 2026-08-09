import { type ClassValue } from "clsx";
/**
 * Combines class names with clsx and tailwind-merge
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Formats a date to French locale
 */
export declare function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string;
/**
 * Formats a relative time (e.g., "il y a 2 jours")
 */
export declare function formatRelativeTime(date: string | Date): string;
/**
 * Formats a number to French locale (e.g., 1 234,56)
 */
export declare function formatNumber(num: number, decimals?: number): string;
/**
 * Formats a currency in EUR
 */
export declare function formatCurrency(amount: number): string;
/**
 * Truncates a string to a max length
 */
export declare function truncate(str: string, maxLength: number): string;
/**
 * Generates a random ID
 */
export declare function generateId(): string;
/**
 * Debounces a function
 */
export declare function debounce<T extends (...args: unknown[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Sleep for a given number of milliseconds
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Capitalizes the first letter of a string
 */
export declare function capitalize(str: string): string;
/**
 * Converts a string to a URL-friendly slug
 */
export declare function slugify(str: string): string;
/**
 * Safely parses JSON
 */
export declare function safeJSONParse<T>(str: string, fallback: T): T;
/**
 * Merges class names with priority (last one wins)
 */
export declare function mergeClasses(...classes: (string | undefined)[]): string;
//# sourceMappingURL=utils.d.ts.map