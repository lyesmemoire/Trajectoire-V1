import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Nouvelle simulation – Trajectoire",
  description: "Configurez et lancez une simulation d'entretien.",
}

export default async function SimulationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const careerProfile = await prisma.careerProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  })

  if (!careerProfile) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-ink-600 hover:text-ink-900 mb-4 transition-colors"
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-serif font-bold text-ink-900 mb-2">Nouvelle simulation</h1>
        <p className="text-ink-600">Configurez votre entretien pour commencer.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-ivoire-200/60 p-8 shadow-premium">
        <form action="/api/simulation/create" method="POST" className="space-y-6">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-ink-700 mb-2">
              Poste recherché *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              required
              placeholder="Ex: Développeur Full Stack"
              className="w-full px-4 py-3 border border-ivoire-300 rounded-xl focus:ring-2 focus:ring-ink-400 focus:border-ink-400 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-ink-700 mb-2">
              Niveau *
            </label>
            <select
              id="level"
              name="level"
              required
              className="w-full px-4 py-3 border border-ivoire-300 rounded-xl focus:ring-2 focus:ring-ink-400 focus:border-ink-400 outline-none transition-all"
            >
              <option value="">Sélectionnez un niveau</option>
              <option value="Junior">Junior</option>
              <option value="Mid">Mid</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div>
            <label htmlFor="interviewType" className="block text-sm font-medium text-ink-700 mb-2">
              Type d&apos;entretien *
            </label>
            <select
              id="interviewType"
              name="interviewType"
              required
              className="w-full px-4 py-3 border border-ivoire-300 rounded-xl focus:ring-2 focus:ring-ink-400 focus:border-ink-400 outline-none transition-all"
            >
              <option value="">Sélectionnez un type</option>
              <option value="RH">RH</option>
              <option value="Technique">Technique</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-ink-700 mb-2">
              Durée *
            </label>
            <select
              id="duration"
              name="duration"
              required
              className="w-full px-4 py-3 border border-ivoire-300 rounded-xl focus:ring-2 focus:ring-ink-400 focus:border-ink-400 outline-none transition-all"
            >
              <option value="">Sélectionnez une durée</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
            </select>
          </div>

          <Button type="submit" className="w-full" size="md">
            Commencer
          </Button>
        </form>
      </div>
    </div>
  )
}
