/** Longueur maximale par défaut du texte injecté dans un prompt. */
export const DEFAULT_MAX_CHAR_LENGTH = 8000;

/**
 * Sanitizes user-provided text (CV, job descriptions, transcripts)
 * before injecting them into AI prompts.
 *
 * `maxLength` permet aux appelants qui traitent de longs documents (CV complet,
 * description de poste) de relever le plafond par défaut sans tronquer le texte.
 */
export function sanitizeForPrompt(
  text: string,
  maxLength: number = DEFAULT_MAX_CHAR_LENGTH,
): string {
  if (!text) return "";

  // 1. Unicode Normalization (NFKC to mitigate homoglyph/spacing attacks)
  let sanitized = text.normalize("NFKC");

  // 2. Remove AI Special Tokens (OpenAI & Mistral)
  const specialTokens = [
    /<\|.*?\|>/g, // OpenAI special tokens like <|im_start|>
    /\[\/?INST\]/g, // Mistral tokens
    /<<\/?SYS>>/g,
    /<\/?[sS]>/g, // <s> </s>
  ];
  specialTokens.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, " ");
  });

  // 3. Remove/Neutralize obvious prompt injection patterns
  // Removed "instead of" to prevent false positives in CVs.
  const injectionPatterns = [
    /ignore (all )?previous (instructions|prompts|directions)/gi,
    /(system|user|assistant) prompt/gi,
    /you are (now|going to act as)/gi,
    /respond as/gi,
    /forget everything/gi,
    /jailbreak/gi,
    /bypass/gi,
  ];
  injectionPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "[REDACTED]");
  });

  // 4. Neutralize structural delimiters
  const delimiters = [
    /---+/g,
    /###+/g,
    /===+/g,
    /\*\*\*+/g,
    /___+/g,
    /<<<+/g,
    />>>+/g,
  ];
  delimiters.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, " ");
  });

  // 5. Escape potential markdown/formatting breaks
  sanitized = sanitized.replace(/[`]/g, "'");

  // 6. Base64 & Hex long payload neutralization (heuristics for >64 chars)
  sanitized = sanitized.replace(
    /(?:[A-Za-z0-9+/]{4}){16,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g,
    "[BASE64_REDACTED]",
  );
  sanitized = sanitized.replace(/[A-Fa-f0-9]{64,}/g, "[HEX_REDACTED]");

  // 7. Limit length to prevent token flooding
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + "... [TRUNCATED]";
  }

  return sanitized;
}

/**
 * Ensures structured output is clean.
 */
export function enforceJsonBoundary(payload: any): any {
  // Deep clone and remove any fields starting with internal markers like "_"
  return JSON.parse(
    JSON.stringify(payload, (key, value) => {
      if (
        key.startsWith("_") ||
        key.includes("reasoning") ||
        key.includes("internal")
      ) {
        return undefined;
      }
      return value;
    }),
  );
}
