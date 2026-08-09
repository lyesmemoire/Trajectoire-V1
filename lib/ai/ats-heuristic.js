/**
 * Extracts basic keywords from a job description and checks their presence in the CV.
 * Returns a score between 0 and 100 based on word frequency match.
 * Improved with stop words and better filtering.
 */
export function calculateHeuristicScore(cvText, jobDescription) {
    if (!cvText || !jobDescription)
        return 0;
    const cvLower = cvText.toLowerCase();
    // Basic French and English stop words to filter out noise
    const stopWords = new Set([
        "dans",
        "avec",
        "pour",
        "plus",
        "moins",
        "nous",
        "vous",
        "votre",
        "notre",
        "leurs",
        "faire",
        "fait",
        "être",
        "avoir",
        "avec",
        "sans",
        "tout",
        "tous",
        "cette",
        "cela",
        "avec",
        "from",
        "this",
        "that",
        "with",
        "your",
        "their",
        "about",
        "more",
        "less",
        "will",
        "should",
        "could",
        "would",
    ]);
    // Extract words longer than 3 characters, filtering out common stop words
    const jobWords = jobDescription
        .toLowerCase()
        .match(/\b[a-zàâçéèêëîïôûùµÿ]{4,}\b/g);
    if (!jobWords || jobWords.length === 0)
        return 0;
    // Filter out stop words and count unique keywords
    const filteredJobWords = jobWords.filter((word) => !stopWords.has(word));
    const uniqueJobWords = Array.from(new Set(filteredJobWords));
    if (uniqueJobWords.length === 0)
        return 0;
    let matches = 0;
    for (const word of uniqueJobWords) {
        // Regex for whole word matching to avoid partial matches (e.g., "dev" matching "development")
        // but here we want some flexibility, so we stick to includes for now or use word boundaries
        if (cvLower.includes(word)) {
            matches++;
        }
    }
    const score = Math.round((matches / uniqueJobWords.length) * 100);
    // Boost score slightly if length is significant (more detail usually better for ATS)
    let lengthBoost = 0;
    if (cvText.length > 2000)
        lengthBoost = 5;
    return Math.min(100, Math.max(0, score + lengthBoost));
}
//# sourceMappingURL=ats-heuristic.js.map