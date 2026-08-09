import { readFileSync } from "fs";
import { join } from "path";

/**
 * Charge un prompt depuis le dossier docs/ à la racine du projet.
 * Utilisé pour charger les prompts système pour les moteurs LLM.
 */
export async function loadPrompt(promptFileName: string): Promise<string> {
  const docsPath = join(process.cwd(), "docs", promptFileName);
  const content = readFileSync(docsPath, "utf-8");
  
  // Extraire uniquement le contenu du prompt système (entre les balises de code)
  const systemPromptMatch = content.match(/```text\n([\s\S]*?)\n```/);
  if (systemPromptMatch && systemPromptMatch[1]) {
    return systemPromptMatch[1].trim();
  }
  
  // Fallback : si pas de balises de code, retourner tout le contenu
  return content.trim();
}
