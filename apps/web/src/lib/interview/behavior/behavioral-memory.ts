import prisma from "@/lib/prisma";

export async function updateBehavioralMemory(userId: string, analysis: any, ) {
  // Logic to identify recurring patterns
  const patterns = [];

  if (analysis.specificity < 40) {
    patterns.push({ pattern: "vague_answers", severity: 0.7 });
  }

  if (analysis.confidence < 40) {
    patterns.push({ pattern: "low_assurance", severity: 0.6 });
  }

  for (const p of patterns) {
    await prisma.behavioralPattern
      .upsert({
        where: { id: `${userId}_${p.pattern}` }, // Simplified ID logic for example
        create: {
          userId,
          pattern: p.pattern,
          severity: p.severity,
        },
        update: {
          frequency: { increment: 1 },
          lastSeenAt: new Date(),
        },
      })
      .catch(() => {
        // Fallback if unique constraint fails or logic needs refined
      });
  }
}
