import { prisma } from "@/lib/prisma"

export async function checkUserQuota(userId: string): Promise<{
  allowed: boolean
  remaining: number
  resetDate: Date
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      monthlyAnalysisCount: true,
      monthlyResetDate: true,
    },
  })

  if (!user) {
    return { allowed: false, remaining: 0, resetDate: new Date() }
  }

  // Premium = illimité
  if (user.plan !== "FREE") {
    return { allowed: true, remaining: -1, resetDate: new Date() }
  }

  const now = new Date()
  const needsReset = !user.monthlyResetDate || now > user.monthlyResetDate

  // Calcul dynamique - PAS d'UPDATE ici
  const effectiveCount = needsReset ? 0 : user.monthlyAnalysisCount
  const MAX_FREE = 3

  return {
    allowed: effectiveCount < MAX_FREE,
    remaining: Math.max(0, MAX_FREE - effectiveCount),
    resetDate: needsReset ? getNextMonthStart() : user.monthlyResetDate,
  }
}

function getNextMonthStart(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
}
