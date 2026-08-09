/**
 * Stage 1: Extraction du texte avec détection de qualité.
 */
export async function extractCVText(buffer) {
    try {
        // Dynamic import with require fallback
        import pdf from 'pdf-parse';
        const data = await pdf(buffer);
        const text = data.text;
        // Détection de mauvaise extraction (texte trop court ou ratio symboles élevé)
        if (isExtractionPoor(text)) {
            return {
                text,
                confidence: 0.4,
                method: "local",
                error: "POOR_QUALITY_DETECTED",
            };
        }
        return { text, confidence: 0.9, method: "local" };
    }
    catch (err) {
        return { text: "", confidence: 0, method: "local", error: err.message };
    }
}
function isExtractionPoor(text) {
    if (text.length < 100)
        return true;
    const symbolRatio = (text.match(/[^a-zA-Z0-9\s]/g) || []).length / text.length;
    return symbolRatio > 0.3;
}
//# sourceMappingURL=extract-pdf-text.js.map