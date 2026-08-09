import prisma from "@/lib/prisma";
export async function storePattern(userId, _pattern, _severity) {
    // Logic to update behavioral patterns in the user profile or dedicated table
    // This helps the AI identify recurring mistakes like "vague answers" or "lack of metrics"
}
export async function getTopWeaknesses(userId) {
    const profile = await prisma.careerProfile.findUnique({
        where: { userId },
    });
    if (!profile)
        return [];
    // Parse careerDNA JSON for weakness patterns
    const dna = profile.careerDNA;
    const weaknesses = dna?.weaknesses || [];
    return weaknesses.map((w) => w.title);
}
//# sourceMappingURL=behavioral-memory.js.map