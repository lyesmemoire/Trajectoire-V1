/**
 * Sécurise les entrées utilisateurs avant de les envoyer à l'IA ou de les afficher.
 * Empêche le XSS, le markdown injection, et le prompt injection basique.
 */
export declare function stripHtml(html: string): string;
export declare function removeMarkdown(text: string): string;
export declare function normalizeText(text: string): string;
export declare function sanitizeInput(input: string): string;
//# sourceMappingURL=sanitize-cv.d.ts.map