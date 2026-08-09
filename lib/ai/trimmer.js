export function aggressiveTrim(text, maxChars = 5000) {
    if (!text)
        return "";
    const cleaned = text
        .replace(/\s+/g, " ")
        .replace(/\n{2,}/g, "\n")
        .trim();
    if (cleaned.length <= maxChars)
        return cleaned;
    return cleaned.slice(0, maxChars);
}
//# sourceMappingURL=trimmer.js.map