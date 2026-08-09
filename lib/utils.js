import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/**
 * Combines class names with clsx and tailwind-merge
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Formats a date to French locale
 */
export function formatDate(date, options) {
    return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options,
    }).format(new Date(date));
}
/**
 * Formats a relative time (e.g., "il y a 2 jours")
 */
export function formatRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1)
        return "à l'instant";
    if (minutes < 60)
        return `il y a ${minutes} min`;
    if (hours < 24)
        return `il y a ${hours}h`;
    if (days < 7)
        return `il y a ${days}j`;
    return formatDate(date, { day: "numeric", month: "short" });
}
/**
 * Formats a number to French locale (e.g., 1 234,56)
 */
export function formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
}
/**
 * Formats a currency in EUR
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}
/**
 * Truncates a string to a max length
 */
export function truncate(str, maxLength) {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - 3) + "...";
}
/**
 * Generates a random ID
 */
export function generateId() {
    return Math.random().toString(36).substring(2, 15);
}
/**
 * Debounces a function
 */
export function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
/**
 * Safely parses JSON
 */
export function safeJSONParse(str, fallback) {
    try {
        return JSON.parse(str);
    }
    catch {
        return fallback;
    }
}
/**
 * Merges class names with priority (last one wins)
 */
export function mergeClasses(...classes) {
    return classes.filter(Boolean).join(" ");
}
//# sourceMappingURL=utils.js.map