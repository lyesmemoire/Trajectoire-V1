import { JobSourceType } from "./detect-source";
/**
 * Prépare le contenu final pour le Doubt Engine.
 * Si c'est une URL, cela devrait normalement déclencher un fetch côté serveur.
 */
export declare function extractJobContent(input: string, type: JobSourceType): Promise<string>;
//# sourceMappingURL=extract-job-content.d.ts.map