/**
 * Moteur de calcul de l'entropie d'interaction.
 * Différencie un humain d'un bot par le chaos naturel des mouvements.
 */
export interface InteractionSignals {
  mouseMovements: number;
  scrollPositionChanges: number;
  keyStrokes: number;
  timeOnPage: number;
  clickChaos: boolean; // Détecte les clics trop parfaits/centrés
}

export function calculateEntropyScore(signals: _InteractionSignals): number {
  let score = 0;

  // 1. Humain = Mouvements de souris non-linéaires
  if (signals.mouseMovements > 50) score += 30;

  // 2. Humain = Lecture réelle (temps passé vs scroll)
  if (signals.timeOnPage > 10000 && signals.scrollPositionChanges > 5)
    score += 30;

  // 3. Humain = Rythme de frappe variable
  if (signals.keyStrokes > 10) score += 20;

  // 4. Bot Detection: Trop de clics en un temps record
  if (signals.clickChaos) score -= 50;

  return Math.min(100, Math.max(0, score));
}

/**
 * Détecte les marqueurs Headless (Playwright/Puppeteer).
 */
export function detectAutomationFingerprint(headers: Headers): boolean {
  const ua = headers.get("user-agent") || "";
  const isWebdriver = headers.get("x-webdriver") === "true";
  const isHeadless = ua.includes("HeadlessChrome") || ua.includes("Playwright");

  // Check for missing common human headers
  const hasAcceptLang = headers.has("accept-language");
  const hasSecFetch = headers.has("sec-fetch-mode");

  return isWebdriver || isHeadless || !hasAcceptLang || !hasSecFetch;
}
