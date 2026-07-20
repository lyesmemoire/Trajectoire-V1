/**
 * Token Limiter - Protection contre les abus IA
 * 
 * Ce module fournit des protections pour:
 * - Limiter le nombre de messages par session
 * - Limiter la taille des messages
 * - Limiter l'historique envoyé à l'IA
 * - Empêcher les conversations infinies
 */

export const MAX_MESSAGES_PER_SESSION = 50;
export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_HISTORY_MESSAGES = 20;
export const MAX_TOTAL_TOKENS_ESTIMATE = 100000;

/**
 * Vérifie si une session a atteint la limite de messages
 */
export function hasReachedMessageLimit(messageCount: number): boolean {
  return messageCount >= MAX_MESSAGES_PER_SESSION;
}

/**
 * Vérifie si un message dépasse la limite de taille
 */
export function isMessageTooLong(content: string): boolean {
  return content.length > MAX_MESSAGE_LENGTH;
}

/**
 * Limite l'historique des messages à envoyer à l'IA
 */
export function limitHistory<T>(messages: T[], limit: number = MAX_HISTORY_MESSAGES): T[] {
  return messages.slice(-limit);
}

/**
 * Estime le nombre de tokens d'un texte (approximation: 1 token ≈ 4 caractères)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Vérifie si le total des tokens dépasse la limite
 */
export function hasExceededTokenLimit(messages: string[]): boolean {
  const totalTokens = messages.reduce((sum, msg) => sum + estimateTokens(msg), 0);
  return totalTokens > MAX_TOTAL_TOKENS_ESTIMATE;
}

/**
 * Tronque un message si nécessaire
 */
export function truncateMessage(content: string, maxLength: number = MAX_MESSAGE_LENGTH): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + "... [message tronqué]";
}

/**
 * Classe d'erreur pour les limites de tokens
 */
export class TokenLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenLimitError";
  }
}
