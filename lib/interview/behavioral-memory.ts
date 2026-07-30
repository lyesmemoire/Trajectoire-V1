import prisma from "@/lib/prisma";

export interface BehavioralPattern {
  pattern: string;
  frequency: number;
  severity: number;
}

export async function storePattern(userId: string, _pattern: string, _severity: number, ) {
  // Logic to update behavioral patterns in the user profile or dedicated table
  // This helps the AI identify recurring mistakes like "vague answers" or "lack of metrics"
}

export async function getTopWeaknesses(userId: string): Promise<string[]> {
  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
  });

  if (!profile) return [];

  // Parse careerDNA JSON for weakness patterns
  const dna = profile.careerDNA as Record<string, unknown> | null;
  const weaknesses = (dna?.weaknesses as Array<{ title: string }>) || [];
  return weaknesses.map((w: { title: string }) => w.title);
}
