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
            ? "Retour à l'opportunité"
            : "Retour"}
        </Link>
      </div>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ── Formulaire ── */}
          <div className="p-6 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <BrainCircuit className="h-5 w-5" />
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
              Préparez votre entretien
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Créez une simulation personnalisée à partir de l&apos;offre que vous visez.
            </p>

            {/* Bandeau opportunité connectée */}
            {opportunity ? (
              <div className="mt-6 rounded-[22px] border border-violet-100 bg-violet-50/60 p-5">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
                      Opportunité connectée
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
                          ? "preuve sélectionnée"
                          : "preuves sélectionnées"}{" "}
                        seront utilisées pendant la préparation.
                      </p>
                    ) : null}

                    {opportunity.matchScore !== null ? (
                      <p className="mt-3 text-sm font-semibold text-violet-800">
                        Trajectoire utilisera votre score de compatibilité de{" "}
                        {opportunity.matchScore}/100, vos preuves sélectionnées
                        et les écarts détectés pour contextualiser l&apos;entretien.
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-violet-800">
                        La description de cette offre sera automatiquement
                        transmise à la simulation.
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
              {/* Poste visé */}
              <div>
                <label
                  htmlFor="jobTitle"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Poste visé
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
                  Collez l&apos;offre complète pour que l&apos;entretien soit adapté au poste.
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
                    L&apos;offre, les Story Bank sélectionnées et les Career Memories
                    confirmées ont été préremplies automatiquement.
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
                    Niveau d&apos;expérience
                  </label>

                  <select
                    id="level"
                    name="level"
                    defaultValue="Senior"
                    required
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Intermédiaire">Intermédiaire</option>
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

              {/* Durée */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Durée
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
              <button
                type="submit"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                Commencer l&apos;entretien
              </button>
            </form>
          </div>

          {/* ── Panneau droit ── */}
          <aside className="bg-slate-950 p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-300">
              Career Intelligence
            </p>

            <h2 className="mt-4 text-xl font-bold leading-snug">
              Une simulation qui connaît le poste.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              L&apos;entretien utilise l&apos;offre et votre profil pour poser des questions
              réellement adaptées au contexte.
            </p>

            <div className="mt-7 space-y-5">
              <div className="flex gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                <p className="text-sm leading-6 text-slate-300">
                  L&apos;offre est transmise à la simulation.
                </p>
              </div>

              <div className="flex gap-3">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                <p className="text-sm leading-6 text-slate-300">
                  Vos forces et axes d&apos;amélioration sont utilisés comme contexte.
                </p>
              </div>

              <div className="flex gap-3">
                <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                <p className="text-sm leading-6 text-slate-300">
                  Votre profil enrichit les questions posées pendant l&apos;entretien.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}