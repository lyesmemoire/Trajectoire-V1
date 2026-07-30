/**
 * Secure Logger - Logger sécurisé qui masque les informations sensibles
 * 
 * Ce module fournit un logger qui masque automatiquement:
 * - Emails
 * - Noms
 * - Téléphones
 * - Clés API
 * - JWT tokens
 * - OpenAI tokens
 */

import { logger, LogContext } from "@/lib/logger/Logger";

const SENSITIVE_PATTERNS = [
  // Emails
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: "[EMAIL]" },
  // API keys (sk- prefix for OpenAI, etc.)
  { pattern: /\b(sk-[a-zA-Z0-9]{20,})\b/g, replacement: "[API_KEY]" },
  // JWT tokens
  { pattern: /\b(eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)\b/g, replacement: "[JWT]" },
  // Phone numbers (basic pattern)
  { pattern: /\b(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: "[PHONE]" },
  // Generic keys
  { pattern: /\b([a-zA-Z0-9_-]*[Kk]ey[a-zA-Z0-9_-]*["\s]*[:=]["\s]*["']?[a-zA-Z0-9_-]{10,}["']?)\b/g, replacement: "[KEY]" },
  // Tokens
  { pattern: /\b([a-zA-Z0-9_-]*[Tt]oken[a-zA-Z0-9_-]*["\s]*[:=]["\s]*["']?[a-zA-Z0-9_-]{10,}["']?)\b/g, replacement: "[TOKEN]" },
];

/**
 * Masque les informations sensibles dans une chaîne
 */
export function maskSensitiveData(message: string): string {
  let masked = message;
  
  for (const { pattern, replacement } of SENSITIVE_PATTERNS) {
    masked = masked.replace(pattern, replacement);
  }
  
  return masked;
}

/**
 * Logger sécurisé
 */
export const secureLogger = {
  error: (message: string, context?: LogContext) => {
    const maskedMessage = maskSensitiveData(message);
    logger.error(maskedMessage, context);
  },

  warn: (message: string, context?: LogContext) => {
    const maskedMessage = maskSensitiveData(message);
    logger.warn(maskedMessage, context);
  },

  info: (message: string, context?: LogContext) => {
    const maskedMessage = maskSensitiveData(message);
    logger.info(maskedMessage, context);
  },

  debug: (message: string, context?: LogContext) => {
    const maskedMessage = maskSensitiveData(message);
    logger.debug(maskedMessage, context);
  },
};
