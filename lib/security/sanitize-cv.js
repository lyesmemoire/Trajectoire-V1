/**
 * Sécurise les entrées utilisateurs avant de les envoyer à l'IA ou de les afficher.
 * Empêche le XSS, le markdown injection, et le prompt injection basique.
 */
export function stripHtml(html) {
    if (!html)
        return "";
    return html.replace(/<[^>]*>?/gm, "");
}
export function removeMarkdown(text) {
    if (!text)
        return "";
    return text
        .replace(/[#*`_~>[\]()]/g, "") // Remove basic MD chars
        .replace(/\n{3,}/g, "\n\n") // Normalize newlines
        .trim();
}
export function normalizeText(text) {
    if (!text)
        return "";
    return text
        .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, "") // Remove non-printable or weird unicode
        .replace(/\s+$/gm, "") // Remove trailing spaces
        .trim();
}
export function sanitizeInput(input) {
    return normalizeText(removeMarkdown(stripHtml(input)));
}
//# sourceMappingURL=sanitize-cv.js.map