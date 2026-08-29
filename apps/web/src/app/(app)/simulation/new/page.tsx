import Link from "next/link"
import { redirect } from "next/navigation"
import {
  ArrowLeft,
  BrainCircuit,
  Building2,
  FileText,
  Sparkles,
  Target,
} from "lucide-react"

import { buildApplicationContext } from "@/lib/opportunities/buildApplicationContext"
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

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
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
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <BrainCircuit className="h-5 w-5" />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              PrÃ©parer mon entretien
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Lance une simulation d'entretien adaptÃ©e au poste que tu vises.
            </p>

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
                        Trajectoire utilisera ton score de compatibilitÃ© de{" "}
                        {opportunity.matchScore}/100, tes preuves sÃ©lectionnÃ©es
                        et les Ã©carts dÃ©tectÃ©s pour contextualiser l'entretien.
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
              <div>
                <label
                  htmlFor="jobTitle"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Poste ciblÃ©
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

              <div>
                <label
                  htmlFor="jobDescription"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Description de l'offre
                </label>

                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={10}
                  defaultValue={contextualDescription}
                  placeholder="Colle ici la description du poste..."
                  className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />

                {opportunity ? (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    L'offre, les Story Bank sÃ©lectionnÃ©es et les Career Memories
                    confirmÃ©es ont Ã©tÃ© prÃ©remplies automatiquement.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="level"
                    className="mb-2 block text-sm font-bold text-slate-800"
                  >
                    Niveau
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
                    Type d'entretien
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

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
              >
                <Sparkles className="h-4 w-4" />
                DÃ©marrer l'entretien contextualisÃ©
              </button>
            </form>
          </div>

          <aside className="bg-slate-950 p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-300">
              Career Intelligence
            </p>

            <h2 className="mt-4 text-xl font-bold">
              Une simulation qui connaÃ®t le poste.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              L'entretien utilise le poste ciblÃ© et la description de l'offre
              comme contexte au lieu de dÃ©marrer Ã  zÃ©ro.
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                <p className="text-sm text-slate-300">
                  Description de l'offre transmise Ã  la session.
                </p>
              </div>

              <div className="flex gap-3">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                <p className="text-sm text-slate-300">
                  Forces et Ã©carts de l'Opportunity Score disponibles comme
                  contexte.
                </p>
              </div>

              <div className="flex gap-3">
                <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                <p className="text-sm text-slate-300">
                  Le cerveau unifiÃ© existant continue d'enrichir la simulation
                  avec le contexte candidat.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}