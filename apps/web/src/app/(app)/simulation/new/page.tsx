import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  Settings,
  Sparkles,
} from "lucide-react";

import { buildApplicationContext } from "@/lib/opportunities/buildApplicationContext";
import { checkSimulationQuota } from "@/lib/quota/simulation-quota";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    opportunity?: string;
  }>;
};

export default async function NewSimulationPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;

  const opportunityId =
    typeof params.opportunity === "string" ? params.opportunity.trim() : "";

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
    : null;

  const applicationContext = opportunity
    ? buildApplicationContext({
        opportunity: {
          id: opportunity.id,
          title: opportunity.title,
          company: opportunity.company,
          description: opportunity.description,
          matchScore: opportunity.matchScore,
          recommendation: opportunity.recommendationLabel,
          strengths: opportunity.strengths,
          gaps: opportunity.gaps,
        },

        stories: opportunity.stories.map((link) => ({
          ...link.story,
          relevance: link.relevance,
          reason: link.reason,
        })),

        memories: opportunity.memories.map((link) => ({
          id: link.memory.id,
          category: link.memory.category,
          key: link.memory.key,
          value: link.memory.value,
          origin: link.memory.origin,
          confidence: link.memory.confidence,
          relevance: link.relevance,
          reason: link.reason,
        })),
      })
    : null;

  const contextualDescription = applicationContext?.plainText ?? "";

  // Quota check to ensure user doesn't bypass blocks
  const quota = await checkSimulationQuota(user.id);

  return (
    <div className="mx-auto max-w-[760px] space-y-8 pb-16 pt-4 px-4 sm:px-6">
      {/* Script inline pour feedback de chargement sans Client Component */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var form = document.getElementById('sim-form');
              if (form) {
                form.addEventListener('submit', function() {
                  var btn = document.getElementById('sim-btn');
                  var text = document.getElementById('sim-btn-text');
                  if (btn && text) {
                    setTimeout(function() {
                      btn.classList.add('opacity-80', 'pointer-events-none');
                      text.innerText = 'Préparation de votre entretien...';
                    }, 50);
                  }
                });
              }
            });
          `,
        }}
      />

      {/* Breadcrumb */}
      <div>
        <Link
          href={opportunity ? `/opportunities/${opportunity.id}` : "/dashboard"}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {opportunity ? "Retour à l'opportunité" : "Retour"}
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Préparez votre entretien
        </h1>
        <p className="text-base text-slate-600">
          Trajectoire adapte les questions au poste que vous visez et à votre
          profil.
        </p>
      </div>

      {/* Progression visuelle */}
      <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-400 sm:gap-6 py-2">
        <div className="flex items-center gap-2 text-violet-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">
            1
          </span>
          Poste
        </div>
        <div className="h-px w-8 bg-slate-200"></div>
        <div className="flex items-center gap-2 text-violet-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs">
            2
          </span>
          Entretien
        </div>
        <div className="h-px w-8 bg-slate-200"></div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs">
            3
          </span>
          Prêt
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <form
          id="sim-form"
          action="/api/simulation/create"
          method="POST"
          className="space-y-10"
        >
          {/* Section 1 : Poste visé */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Briefcase className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Quel poste visez-vous ?
              </h2>
            </div>

            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              required
              defaultValue={opportunity?.title ?? ""}
              placeholder="Ex. Product Manager, Développeur Full Stack, Consultant..."
              className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
            />
            <p className="mt-2 text-sm text-slate-500">
              Trajectoire utilisera ce poste pour adapter les compétences et les
              questions.
            </p>
          </section>

          {/* Section 2 : Offre d'emploi */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-1 items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Vous avez l'offre d'emploi ?
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Recommandé
                </span>
              </div>
            </div>

            <p className="mb-4 text-sm text-slate-600">
              Ajoutez-la pour obtenir des questions encore plus proches de
              l'entretien réel.
            </p>

            <textarea
              id="jobDescription"
              name="jobDescription"
              rows={6}
              defaultValue={contextualDescription}
              placeholder="Collez ici la description du poste..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
            />
          </section>

          {/* Section 3 : Paramètres d'entretien */}
          <section>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Settings className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Votre entretien
              </h2>
            </div>

            <div className="space-y-8">
              {/* Type d'entretien */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-900">
                  Type d'entretien
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { value: "RH", label: "Entretien RH" },
                    { value: "Technique", label: "Technique" },
                    { value: "Manager", label: "Manager" },
                  ].map((type) => (
                    <label key={type.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="interviewType"
                        value={type.value}
                        defaultChecked={type.value === "RH"}
                        className="peer sr-only"
                      />
                      <div className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 peer-checked:border-violet-600 peer-checked:bg-violet-50 peer-checked:text-violet-700">
                        {type.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Niveau */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-900">
                  Niveau d'expérience
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {[
                    { value: "Junior", label: "Junior" },
                    { value: "Intermédiaire", label: "Confirmé" },
                    { value: "Senior", label: "Senior" },
                    { value: "Lead", label: "Lead" },
                    { value: "Manager", label: "Manager" },
                  ].map((lvl) => (
                    <label key={lvl.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        value={lvl.value}
                        defaultChecked={lvl.value === "Senior"}
                        className="peer sr-only"
                      />
                      <div className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 peer-checked:border-violet-600 peer-checked:bg-violet-50 peer-checked:text-violet-700">
                        {lvl.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Durée */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-900">
                  Durée de la simulation
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { value: "10", label: "10 min" },
                    { value: "15", label: "15 min", badge: "Recommandé" },
                    { value: "20", label: "20 min" },
                    { value: "30", label: "30 min" },
                  ].map((dur) => (
                    <label key={dur.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="duration"
                        value={dur.value}
                        defaultChecked={dur.value === "15"}
                        className="peer sr-only"
                      />
                      <div className="flex h-16 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-2 transition hover:bg-slate-50 peer-checked:border-violet-600 peer-checked:bg-violet-50">
                        <span className="text-sm font-medium text-slate-600 peer-checked:text-violet-700">
                          {dur.label}
                        </span>
                        {dur.badge && (
                          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-600">
                            {dur.badge}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-12 border-t border-slate-100 pt-8 text-center">
            <button
              id="sim-btn"
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] sm:w-auto sm:min-w-[320px]"
            >
              <Sparkles className="h-5 w-5 text-violet-300" />
              <span id="sim-btn-text">Commencer mon entretien</span>
            </button>

            <p className="mt-4 text-sm text-slate-500">
              Vous pourrez arrêter l'entretien à tout moment.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
