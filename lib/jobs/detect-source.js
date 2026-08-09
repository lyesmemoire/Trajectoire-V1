export function detectJobSource(input) {
    const trimmed = input.trim();
    if (!trimmed)
        return "INVALID";
    try {
        const url = new URL(trimmed);
        const host = url.hostname.toLowerCase();
        if (host.includes("linkedin.com"))
            return "URL_LINKEDIN";
        if (host.includes("indeed.com"))
            return "URL_INDEED";
        if (host.includes("welcometothejungle.com"))
            return "URL_WTTJ";
        // If it's a valid URL but not from a known job board, we still treat it as potentially scrapable or as text
        return "RAW_TEXT";
    }
    catch {
        // If not a URL, it's raw text if it has a minimum length
        return trimmed.length > 20 ? "RAW_TEXT" : "INVALID";
    }
}
//# sourceMappingURL=detect-source.js.map