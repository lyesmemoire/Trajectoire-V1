import { prisma } from "@/lib/prisma"

export async function checkUserQuota(userId: string): Promise<{
  allowed: boolean
  remaining: number
}> {
  // Pour MVP : compter les CVAnalysis créés ce mois
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const count = await prisma.cVAnalysis.count({
    where: {
      userId,
      createdAt: { gte: monthStart },
    },
  })

  const MAX_FREE = 3
  const remaining = Math.max(0, MAX_FREE - count)

  return {
    allowed: remaining > 0,
    remaining,
  }
}
