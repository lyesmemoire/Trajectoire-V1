/**
 * Nettoie et normalise l'entrée brute pour le moteur de doute.
 */
export function normalizeJobInput(input: string): string {
  let cleaned = input.trim();

  // 1. Suppression des paramètres de tracking si c'est une URL
  try {
    const url = new URL(cleaned);
    // Remove UTM and other tracking params
    const searchParams = new URLSearchParams(url.search);
    const paramsToRemove = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "ref",
      "trackingId",
      "shareId",
    ];
    paramsToRemove.forEach((p) => searchParams.delete(p));

    url.search = searchParams.toString();
    cleaned = url.toString();
  } catch {
    // Ce n'est pas une URL, on traite le texte
    // Nettoyage des espaces multiples et retours à la ligne excessifs
    cleaned = cleaned.replace(/\s+/g, " ");
  }

  // 3. Tronquer si le texte est monstrueusement long pour éviter l'explosion de tokens
  if (cleaned.length > 8000) {
    cleaned = cleaned.substring(0, 8000);
  }

  return cleaned;
}
