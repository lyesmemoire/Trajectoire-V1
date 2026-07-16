/**
 * Détecte si l'entrée utilisateur est une URL supportée ou du texte brut.
 */
// @ts-nocheck

export type JobSourceType =
  | "URL_LINKEDIN"
  | "URL_INDEED"
  | "URL_WTTJ"
  | "RAW_TEXT"
  | "INVALID";

export function detectJobSource(input: string): JobSourceType {
  const trimmed = input.trim();

  if (!trimmed) return "INVALID";

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();

    if (host.includes("linkedin.com")) return "URL_LINKEDIN";
    if (host.includes("indeed.com")) return "URL_INDEED";
    if (host.includes("welcometothejungle.com")) return "URL_WTTJ";

    // If it's a valid URL but not from a known job board, we still treat it as potentially scrapable or as text
    return "RAW_TEXT";
  } catch (e) {
    // If not a URL, it's raw text if it has a minimum length
    return trimmed.length > 20 ? "RAW_TEXT" : "INVALID";
  }
}
