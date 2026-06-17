import { JobSourceType } from "./detect-source";

/**
 * Prépare le contenu final pour le Doubt Engine.
 * Si c'est une URL, cela devrait normalement déclencher un fetch côté serveur.
 */
export async function extractJobContent(
  input: string,
  type: JobSourceType,
): Promise<string> {
  if (type === "RAW_TEXT") {
    return input;
  }

  if (type.startsWith("URL")) {
    // Simulation d'un appel à un service de scraping
    // En production: return await fetch('/api/jobs/scrape', { ... })
    console.log(`[Job Extraction] Triggering scrape for ${type}: ${input}`);
    return input; // On renvoie l'URL pour que l'IA puisse éventuellement la traiter ou simuler le contenu
  }

  return input;
}
