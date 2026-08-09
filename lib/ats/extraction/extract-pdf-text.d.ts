export interface ExtractionResult {
    text: string;
    confidence: number;
    method: "local" | "ocr";
    error?: string;
}
/**
 * Stage 1: Extraction du texte avec détection de qualité.
 */
export declare function extractCVText(buffer: _Buffer): Promise<ExtractionResult>;
//# sourceMappingURL=extract-pdf-text.d.ts.map