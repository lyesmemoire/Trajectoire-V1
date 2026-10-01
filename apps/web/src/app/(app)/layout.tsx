import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app/AppSidebar"
import { AppMobileNav } from "@/components/app/AppMobileNav"
import { logger } from "@/lib/logger"
import { shouldRedirectToOnboarding } from "@/lib/onboarding/shouldRedirectToOnboarding"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export default async function AppGroupLayout({ children }: { children: ReactNode }) {
  // Garde d'onboarding : un compte récent qui n'a pas terminé l'onboarding y est renvoyé.
  //
  // - /onboarding vit HORS de (app)/ : ce layout ne s'exécute jamais pour cette route,
  //   donc aucune boucle de redirection possible.
  // - L'authentification reste gérée par le middleware et par chaque page : sans session
  //   ici, on ne fait rien.
  // - Ce n'est pas une barrière de sécurité, seulement un confort d'usage : en cas
  //   d'erreur (base indisponible…), on laisse passer plutôt que de bloquer toute l'app.
  // - redirect() lève une exception spéciale de Next : il doit rester HORS du try/catch.
  let sendToOnboarding = false

  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (authUser) {
      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
        select: { onboardingCompleted: true, createdAt: true },
      })

      sendToOnboarding = shouldRedirectToOnboarding(user)
    }
  } catch (error) {
    logger.error({ err: error }, "Onboarding guard failed")
  }

  if (sendToOnboarding) {
    redirect("/onboarding")
  }

  return (
    <div
      className="min-h-dvh bg-calm-bg text-calm-ink selection:bg-calm-accent-soft selection:text-calm-ink"
    >
      {/* Sous 1024 px la barre latérale est masquée : en-tête + tiroir à la place. */}
      <AppMobileNav />

      <div className="mx-auto flex w-full max-w-[1440px]">
        <AppSidebar />

        <main
          id="main"
          className="min-w-0 flex-1 px-6 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
