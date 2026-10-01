import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { VoiceAuditionPanel } from "@/components/admin/VoiceAuditionPanel"

export const metadata: Metadata = {
  title: "Écoute des voix – Trajectoire",
  description: "Comparer les voix de la recruteuse avant de les figer.",
}

export default async function VoiceAuditionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { AuthorizationModule } = await import("@/lib/authorization/AuthorizationModule")
  const auth = await AuthorizationModule.create(user.id)
  if (!auth.isAdmin()) redirect("/dashboard")

  return (
    <main className="min-h-screen bg-calm-bg px-6 py-10 text-calm-ink">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">Écoute des voix de la recruteuse</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-calm-secondary">
          Chaque lecture appelle la synthèse vocale d&apos;OpenAI (quelques centimes au plus ; une réécoute identique est mise en cache
          par le navigateur). L&apos;aperçu est proche de la voix de l&apos;entretien en direct, pas identique. Le portrait est celui
          d&apos;une femme : privilégiez une voix féminine. Une fois votre choix fait, il se règle dans{" "}
          <code className="rounded bg-calm-accent-soft px-1.5 py-0.5 text-xs">PERSONA_VOICES</code>.
        </p>
        <div className="mt-8">
          <VoiceAuditionPanel />
        </div>
      </div>
    </main>
  )
}
