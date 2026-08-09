import prisma from "@/lib/prisma";
export async function generateCareerInsights(userId) {
    // Placeholder implementation
    const insights = (await prisma.careerInsight?.findMany?.({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
    })) || [];
    return insights;
}
//# sourceMappingURL=generate-insights.js.map