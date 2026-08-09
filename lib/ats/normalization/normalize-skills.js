export const SKILL_MAP = {
    js: "javascript",
    javascript: "javascript",
    ts: "typescript",
    typescript: "typescript",
    reactjs: "react",
    "react.js": "react",
    nextjs: "next.js",
    node: "node.js",
    nodejs: "node.js",
    python3: "python",
    aws: "cloud (aws)",
    gcp: "cloud (gcp)",
};
/**
 * Normalise les compétences pour le matching déterministe.
 */
export function normalizeSkills(skills) {
    return Array.from(new Set(skills.map((s) => {
        const clean = s.toLowerCase().trim();
        return SKILL_MAP[clean] || clean;
    })));
}
//# sourceMappingURL=normalize-skills.js.map