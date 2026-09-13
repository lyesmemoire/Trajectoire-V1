import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowLeft,
  BrainCircuit,
  Building2,
  FileText,
  Lightbulb,
  Lock,
  Sparkles,
  Target,
} from "lucide-react"

import { buildApplicationContext } from "@/lib/opportunities/buildApplicationContext"
import { checkSimulationQuota } from "@/lib/quota/simulation-quota"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{
    opportunity?: string
  }>
}

export default async function NewSimulationPage({
  searchParams,
}: PageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const params = await searchParams

  const opportunityId =
    typeof params.opportunity === "string"
      ? params.opportunity.trim()
      : ""

  const opportunity = opportunityId
    ? await prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          userId: user.id,
        },
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
          matchScore: true,
          recommendationLabel: true,
          strengths: true,
          gaps: true,

          stories: {
            where: {
              selected: true,
            },
            orderBy: [
              {
                relevance: "desc",
              },
              {
                updatedAt: "desc",
              },
            ],
            select: {
              relevance: true,
              reason: true,
              story: {
                select: {
                  id: true,
                  title: true,
                  situation: true,
                  task: true,
                  action: true,
                  result: true,
                  skills: true,
                  tags: true,
                },
              },
            },
          },

          memories: {
            where: {
              selected: true,
              memory: {
                userId: user.id,
                status: "CONFIRMED",
              },
            },
            orderBy: [
              {
                relevance: "desc",
              },
              {
                updatedAt: "desc",
              },
            ],
            select: {
              relevance: true,
              reason: true,
              memory: {
                select: {
                  id: true,
                  category: true,
                  key: true,
                  value: true,
                  origin: true,
                  confidence: true,
                },
              },
            },
          },
        },
      })
    : null

  const applicationContext = opportunity
    ? buildApplicationContext({
        opportunity: {
          id: opportunity.id,
          title: opportunity.title,
          company: opportunity.company,
          description: opportunity.description,
          matchScore: opportunity.matchScore,
          recommendation:
            opportunity.recommendationLabel,
          strengths: opportunity.strengths,
          gaps: opportunity.gaps,
        },

        stories: opportunity.stories.map(
          (link) => ({
            ...link.story,
            relevance: link.relevance,
            reason: link.reason,
          }),
        ),

        memories: opportunity.memories.map(
          (link) => ({
            id: link.memory.id,
            category: link.memory.category,
            key: link.memory.key,
            value: link.memory.value,
            origin: link.memory.origin,
            confidence:
              link.memory.confidence,
            relevance: link.relevance,
            reason: link.reason,
          }),
        ),
      })
    : null

  const contextualDescription =
    applicationContext?.plainText ?? ""

  const quota = await checkSimulationQuota(user.id)

  function quotaBadgeText(): string {
    if (quota.isUnlimited) return "Simulations illimitÃ©es"

    if (quota.plan === "FREE") {
      return quota.remaining === 0
        ? "Simulation dÃ©couverte utilisÃ©e"
        : "1 simulation dÃ©couverte disponible"
    }

    if (quota.plan === "INTERVIEW_PACK") {
      return quota.remaining === 0
        ? "Quota Ã©puisÃ©"
        : `${quota.remaining} simulations restantes`
    }

    // PRO
    return quota.remaining === 0
      ? "Quota Ã©puisÃ© ce mois-ci"
      : `${quota.remaining} simulations restantes`
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Breadcrumb */}
      <div>
        <Link
          href={
            opportunity
              ? `/opportunities/${opportunity.id}`
              : "/dashboard"
          }
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {opportunity
            ? "Retour Ã  l'opportunitÃ©"
            : "Retour"}
        </Link>
      </div>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* â”€â”€ Formulaire (colonne gauche) â”€â”€ */}
          <div className="p-6 sm:p-8">
            {/* IcÃ´ne + eyebrow */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
                  Simulation d&apos;entretien
                </p>
              </div>
              {/* Badge quota discret */}
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                quota.remaining === 0 && !quota.isUnlimited
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-100 text-slate-500"
              }`}>
                {quotaBadgeText()}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              PrÃ©parez votre entretien
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              CrÃ©ez une simulation personnalisÃ©e Ã  partir de l&apos;offre que vous visez.
            </p>

            {/* Bandeau opportunitÃ© connectÃ©e */}
            {opportunity ? (
              <div className="mt-6 rounded-[22px] border border-violet-100 bg-violet-50/60 p-5">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                      OpportunitÃ© connectÃ©e
                    </p>

                    <p className="mt-2 font-bold text-slate-950">
                      {opportunity.title}
                    </p>

                    {opportunity.company ? (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                        <Building2 className="h-4 w-4" />
                        {opportunity.company}
                      </p>
                    ) : null}

                    {applicationContext &&
                    applicationContext.evidenceCount > 0 ? (
                      <p className="mt-2 text-xs font-semibold text-violet-700">
                        {applicationContext.evidenceCount}{" "}
                        {applicationContext.evidenceCount === 1
                          ? "preuve sÃ©lectionnÃ©e"
                          : "preuves sÃ©lectionnÃ©es"}{" "}
                        seront utilisÃ©es pendant la prÃ©paration.
                      </p>
                    ) : null}

                    {opportunity.matchScore !== null ? (
                      <p className="mt-3 text-sm font-semibold text-violet-800">
                        Trajectoire utilisera votre score de compatibilitÃ© de{" "}
                        {opportunity.matchScore}/100, vos preuves sÃ©lectionnÃ©es
                        et les Ã©carts dÃ©tectÃ©s pour contextualiser l&apos;entretien.
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-violet-800">
                        La description de cette offre sera automatiquement
                        transmise Ã  la simulation.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            <form
              action="/api/simulation/create"
              method="POST"
              className="mt-8 space-y-6"
            >
              {/* Poste visÃ© */}
              <div>
                <label
                  htmlFor="jobTitle"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Poste visÃ©
                </label>

                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  required
                  defaultValue={opportunity?.title ?? ""}
                  placeholder="Ex. Product Manager Senior"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              {/* Description de l'offre */}
              <div>
                <label
                  htmlFor="jobDescription"
                  className="mb-1 block text-sm font-bold text-slate-800"
                >
                  Description de l&apos;offre
                </label>

                <p className="mb-2 text-xs leading-5 text-slate-400">
                  Collez l&apos;offre complÃ¨te pour que l&apos;entretien soit adaptÃ© au poste.
                </p>

                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={10}
                  defaultValue={contextualDescription}
                  placeholder="Collez ici la description du poste..."
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />

                {opportunity ? (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    L&apos;offre, les Story Bank sÃ©lectionnÃ©es et les Career Memories
                    confirmÃ©es ont Ã©tÃ© prÃ©remplies automatiquement.
                  </p>
                ) : null}
              </div>

              {/* Niveau + Type */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="level"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Niveau d&apos;expÃ©rience
                  </label>

                  <select
                    id="level"
                    name="level"
                    defaultValue="Senior"
                    required
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="Junior">Junior</option>
                    <option value="IntermÃ©diaire">IntermÃ©diaire</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="interviewType"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Type d&apos;entretien
                  </label>

                  <select
                    id="interviewType"
                    name="interviewType"
                    defaultValue="RH"
                    required
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="RH">RH</option>
                    <option value="Technique">Technique</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
              </div>

              {/* DurÃ©e */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  DurÃ©e
                </label>

                <select
                  id="duration"
                  name="duration"
                  defaultValue="15"
                  required
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                >
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  Commencer l&apos;entretien
                </button>

                {/* Mention confidentialitÃ© discrÃ¨te */}
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <Lock className="h-3 w-3 shrink-0" />
                  Vos informations servent Ã  personnaliser cette simulation.
                </p>
              </div>
            </form>
          </div>

          {/* â”€â”€ Panneau contexte (colonne droite) â€” fond clair premium â”€â”€ */}
          <aside className="border-t border-slate-100 bg-violet-50/50 p-6 sm:p-7 lg:border-l lg:border-t-0">
            {/* Header */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
              Trajectoire AI
            </p>

            <h2 className="mt-3 text-lg font-bold leading-snug tracking-tight text-slate-900">
              Une simulation qui<br />connaÃ®t le poste.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              L&apos;entretien utilise l&apos;offre et votre profil pour poser des questions
              rÃ©ellement adaptÃ©es au contexte.
            </p>

            {/* Les 3 bÃ©nÃ©fices */}
            <div className="mt-7 space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <FileText className="h-4 w-4" />
                </span>
                <p className="pt-1.5 text-sm leading-5 text-slate-700">
                  L&apos;offre est transmise Ã  la simulation.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Target className="h-4 w-4" />
                </span>
                <p className="pt-1.5 text-sm leading-5 text-slate-700">
                  Vos forces et axes d&apos;amÃ©lioration sont utilisÃ©s comme contexte.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <BrainCircuit className="h-4 w-4" />
                </span>
                <p className="pt-1.5 text-sm leading-5 text-slate-700">
                  Votre profil enrichit les questions posÃ©es pendant l&apos;entretien.
                </p>
              </div>
            </div>

            {/* SÃ©parateur + bloc conseil */}
            <div className="mt-7 border-t border-violet-100 pt-6">
              <div className="rounded-xl border border-violet-100 bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                    <Lightbulb className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Conseil</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Plus la description de l&apos;offre est complÃ¨te, plus la simulation
                      sera pertinente et rÃ©aliste.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </section>
    </div>
  )
}
