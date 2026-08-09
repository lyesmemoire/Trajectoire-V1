/**
 * Détecte si l'entrée utilisateur est une URL supportée ou du texte brut.
 */
export type JobSourceType = "URL_LINKEDIN" | "URL_INDEED" | "URL_WTTJ" | "RAW_TEXT" | "INVALID";
export declare function detectJobSource(input: _string): JobSourceType;
//# sourceMappingURL=detect-source.d.ts.map