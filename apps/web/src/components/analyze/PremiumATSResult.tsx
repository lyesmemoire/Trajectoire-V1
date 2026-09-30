'use client'

import { Check, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'

// N'affiche que des valeurs réellement calculées. Les sous-scores (structure,
// mots-clés, impact…), la « probabilité d'entretien » et le percentile ont été
// retirés : ils étaient inventés (valeurs par défaut constantes, ou score ±
// aléatoire). Ils reviendront avec l'analyse complète, calculés pour de vrai.
interface PremiumATSResultProps {
  score: number
  strengths?: string[]
  weaknesses?: string[]
  recommendations?: string[]
  detectedSkills?: string[]
  missingSkills?: string[]
  /** Détail du score (analyse complète) : uniquement des dimensions réellement évaluées. */
  dimensions?: Array<{ label: string; value: number }>
  /** Limites de l'analyse (offre absente ou trop courte, CV très court…). */
  notices?: string[]
  isAuthenticated?: boolean
  hasPremiumAccess?: boolean
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Bon'
  if (score >= 40) return 'Moyen'
  return 'À améliorer'
}

function getScoreTheme(score: number) {
  if (score >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  if (score >= 60) return { bar: 'bg-violet-500', text: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' }
  return { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
}

export function PremiumATSResult({
  score,
  strengths = [],
  weaknesses = [],
  recommendations = [],
  detectedSkills = [],
  missingSkills = [],
  dimensions = [],
  notices = [],
  isAuthenticated = false,
  hasPremiumAccess = false,
}: PremiumATSResultProps) {
  const theme = getScoreTheme(score)
  const label = getScoreLabel(score)

  return (
    <div className="space-y-6">

      {/* ===== HERO RÉSULTAT ===== */}
      <div className={`rounded-xl border ${theme.border} ${theme.bg} p-6 sm:p-8`}>
        <p className="text-xs font-bold uppercase tracking-widest text-foreground-muted">
          Diagnostic ATS
        </p>

        <div className="mt-6 flex items-baseline gap-3">
          <span className={`font-sans text-[110px] font-medium leading-[0.8] tracking-tight ${theme.text}`}>
            {score}
          </span>
          <div>
            <span className="text-2xl font-medium text-foreground-muted">/100</span>
            <p className={`mt-1 text-base font-bold ${theme.text}`}>{label}</p>
          </div>
        </div>

        <div className="mt-8 h-2.5 overflow-hidden rounded-full bg-white/50">
          <div
            className={`h-full rounded-full ${theme.bar} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* ===== DÉTAIL DU SCORE (analyse complète) ===== */}
      {dimensions.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 font-sans text-xl font-medium text-foreground">Détail du score</h2>
          <ul className="space-y-5">
            {dimensions.map(({ label, value }) => {
              const dim = getScoreTheme(value)
              return (
                <li key={label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                    <span className={`font-sans text-lg font-medium ${dim.text}`}>{Math.round(value)}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/40">
                    <div className={`h-full rounded-full ${dim.bar}`} style={{ width: `${Math.round(value)}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* ===== LIMITES DE L'ANALYSE ===== */}
      {notices.length > 0 && (
        <ul className="space-y-1 rounded-lg border border-border bg-surface px-4 py-3 text-xs text-foreground-muted">
          {notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      )}

      {/* ===== CE QUE LE RECRUTEUR VERRA (Forces / Gaps) ===== */}
      {(strengths.length > 0 || (weaknesses.length > 0 && weaknesses[0])) && (
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Forces */}
          {strengths.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100">
                  <Check className="size-4 text-emerald-600" />
                </div>
                <h2 className="font-sans text-xl font-medium text-emerald-900">Vos forces pour ce poste</h2>
              </div>
              <ul className="space-y-4">
                {strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-emerald-800">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Vigilance */}
          {weaknesses.length > 0 && weaknesses[0] && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100">
                  <AlertTriangle className="size-4 text-amber-600" />
                </div>
                <h2 className="font-sans text-xl font-medium text-amber-900">À renforcer</h2>
              </div>
              <p className="mb-6 text-xs text-amber-700">
                Ce qui mérite votre attention avant de candidater.
              </p>
              <ul className="space-y-4">
                {weaknesses.filter(Boolean).map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-amber-800">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* ===== COMPÉTENCES DÉTECTÉES (uniquement si fournies) ===== */}
      {(detectedSkills.length > 0 || missingSkills.length > 0) && (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 font-sans text-xl font-medium text-foreground">Mapping des compétences</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {detectedSkills.length > 0 && (
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-emerald-700">Détectées</p>
                <div className="flex flex-wrap gap-2">
                  {detectedSkills.map((skill) => (
                    <span key={skill} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {missingSkills.length > 0 && (
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-amber-700">Manquantes</p>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <span key={skill} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== RECOMMANDATIONS (uniquement si fournies) ===== */}
      {recommendations.length > 0 && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-100">
              <Sparkles className="size-4 text-violet-600" />
            </div>
            <h2 className="font-sans text-xl font-medium text-violet-900">Recommandations Trajectoire</h2>
          </div>
          <ul className="space-y-4">
            {recommendations.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-violet-800">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-violet-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== ÉTAPE SUIVANTE (si pas d'accès premium) ===== */}
      {!hasPremiumAccess && (
        <div className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-sm">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Étape suivante</p>
                <h3 className="mt-1 font-sans text-lg font-medium text-foreground">Préparez l&apos;entretien</h3>
                <p className="mt-1 text-sm text-foreground-muted">Simulations d&apos;entretien personnalisées et rapport détaillé après chaque simulation.</p>
              </div>
              <Link
                href="/signup-conversion"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-surface-muted px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-border/60"
              >
                Créer mon compte
                <ChevronRight className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Étape suivante</p>
                <h3 className="mt-1 font-sans text-lg font-medium text-foreground">Passez aux simulations d&apos;entretien</h3>
                <p className="mt-1 text-sm text-foreground-muted">Le Pack Entretien ou Pro vous donnent accès aux simulations et aux rapports détaillés.</p>
              </div>
              <Link
                href="/pricing"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-surface-muted px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-border/60"
              >
                Voir les offres
                <ChevronRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
