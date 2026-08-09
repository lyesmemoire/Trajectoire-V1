import prisma from "@/lib/prisma";
/**
 * Aggregates behavioral signals from a user's recent sessions.
 */
export async function computeUserBehavioralAnalytics(userId) {
    const sessions = await prisma.interviewSession.findMany({
        where: { userId },
        include: { InterviewEvent: true },
        orderBy: { createdAt: "desc" },
        take: 5,
    });
    if (sessions.length === 0) {
        return {
            interruptionRate: 0,
            recoveryRate: 0,
            vaguenessFrequency: 0,
            stressCollapseRate: 0,
            metricUsageRate: 0,
        };
    }
    let totalInterruptions = 0;
    let totalRecoveries = 0;
    let totalQuestions = 0;
    sessions.forEach((session) => {
        const answers = session.answers || [];
        totalQuestions += answers.length;
        // Count interruptions from events
        totalInterruptions += session.InterviewEvent.filter((e) => e.type.startsWith("interruption")).length;
        // Recovery detection (score jump > 20)
        answers.forEach((ans, idx) => {
            if (idx > 0 && ans.score > answers[idx - 1].score + 20) {
                totalRecoveries++;
            }
        });
    });
    return {
        interruptionRate: Math.round((totalInterruptions / totalQuestions) * 100),
        recoveryRate: Math.round((totalRecoveries / totalInterruptions || 1) * 100),
        vaguenessFrequency: 0, // Would need NLP detection
        stressCollapseRate: 0, // Detection of score drop under pressure
        metricUsageRate: 0, // Detection of numbers/facts usage
    };
}
//# sourceMappingURL=behavioral-analytics.js.map