import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Bienvenue – Trajectoire",
  robots: { index: false, follow: false },
}

/** Nom renseigné dans les métadonnées du compte (ex. connexion OAuth), s'il existe. */
function metadataName(metadata: Record<string, unknown> | undefined): string {
  const candidate = metadata?.full_name ?? metadata?.name
  return typeof candidate === "string" ? candidate.trim() : ""
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, onboardingCompleted: true },
  })

  // Garde inverse : un utilisateur déjà onboardé n'a rien à refaire ici.
  if (dbUser?.onboardingCompleted) {
    redirect("/dashboard")
  }

  const initialName = dbUser?.name?.trim() || metadataName(user.user_metadata)

  return <OnboardingWizard initialName={initialName} />
}
