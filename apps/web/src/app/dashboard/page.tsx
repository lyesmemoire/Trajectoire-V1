import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { checkUserQuota } from "@/lib/quota/simple-quota"
import { DashboardContent } from "./DashboardContent"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Récupérer la dernière analyse
  const lastAnalysis = await prisma.cVAnalysis.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  // Récupérer l'analyse précédente pour l'évolution
  const previousAnalysis = await prisma.cVAnalysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    skip: 1,
    take: 1,
  })

  // Vérifier quota
  const quota = await checkUserQuota(user.id)

  return (
    <DashboardContent
      user={user}
      lastAnalysis={lastAnalysis}
      previousAnalysis={previousAnalysis[0] || null}
      quota={quota}
    />
  )
}
