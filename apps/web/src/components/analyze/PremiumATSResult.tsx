'use client'

import { Check, Target, FileText, Key, TrendingUp, Eye, Layers, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PremiumATSResultProps {
  score: number
  radarDimensions?: {
    structure: number
    keywords: number
    impact: number
    clarity: number
    relevance: number
  }
  strengths?: string[]
  weaknesses?: string[]
  recommendations?: string[]
  detectedSkills?: string[]
  missingSkills?: string[]
  interviewProbability?: number
  compatibility?: number
  readability?: number
  structure?: number
  keywords?: number
  experience?: number
  education?: number
  languages?: number
  softSkills?: number
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

function MiniBar({ value, color = 'bg-violet-500' }: { value: number; color?: string }) {
  return (
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/40">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${Math.round(value)}%` }} />
    </div>
  )
}

const dimensionConfig = [
  { key: 'structure', label: 'Structure', icon: Layers },
  { key: 'keywords', label: 'Mots-clés', icon: Key },
  { key: 'impact', label: 'Impact', icon: TrendingUp },
  { key: 'clarity', label: 'Lisibilité', icon: Eye },
  { key: 'relevance', label: 'Compatibilité', icon: Target },
] as const

export function PremiumATSResult({
  score,
  radarDimensions = { structure: 70, keywords: 65, impact: 75, clarity: 80, relevance: 70 },
  strengths = [],
  weaknesses = [],
  recommendations = [],
  detectedSkills = [],
  missingSkills = [],
  interviewProbability = 65,
  compatibility = 72,
  readability = 78,
  structure = 68,
  keywords = 55,
  experience = 85,
  education = 60,
  languages = 70,
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

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-3">
            <span className={`font-serif text-[110px] font-medium leading-[0.8] tracking-tight ${theme.text}`}>
              {score}
            </span>
            <div>
              <span className="text-2xl font-medium text-foreground-muted">/100</span>
              <p className={`mt-1 text-base font-bold ${theme.text}`}>{label}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-lg bg-white/60 px-5 py-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-sky-100">
                <Target className="size-5 text-sky-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground-muted">Probabilité entretien</p>
                <p className="text-xl font-bold text-foreground">{Math.round(interviewProbability)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/60 px-5 py-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-violet-100">
                <Layers className="size-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground-muted">Compatibilité profil</p>
                <p className="text-xl font-bold text-foreground">{Math.round(compatibility)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 h-2.5 overflow-hidden rounded-full bg-white/50">
          <div
            className={`h-full rounded-full ${theme.bar} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* ===== VOTRE PROFIL FACE À L'OFFRE (Dimensions + Métriques) ===== */}
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-100">
            <Eye className="size-4 text-violet-600" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground">Votre profil face à l'offre</h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">

          {/* LEFT: Dimensions Principales */}
          <div className="space-y-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
              Dimensions principales
            </p>
            {dimensionConfig.map(({ key, label }) => {
              const val = radarDimensions[key]
              const dim = getScoreTheme(val)
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-32 shrink-0">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                  </div>
                  <div className="flex-1">
                    <MiniBar value={val} color={dim.bar} />
                  </div>
                  <div className="w-12 shrink-0 text-right">
                    <span className={`font-serif text-lg font-medium ${dim.text}`}>{Math.round(val)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* RIGHT: Métriques complémentaires */}
          <div>
            <p className="mb-6 text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
              Métriques complémentaires
            </p>
            <div className="space-y-4">
              {[
                { label: 'Lisibilité', value: readability },
                { label: 'Structure', value: structure },
                { label: 'Mots-clés', value: keywords },
                { label: 'Expérience', value: experience },
                { label: 'Formation', value: education },
                { label: 'Langues', value: languages },
              ].map(({ label, value }) => {
                const t = getScoreTheme(value)
                return (
                  <div key={label} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-foreground-muted">{label}</span>
                    <span className={`font-serif text-lg font-medium ${t.text}`}>{Math.round(value)}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

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
                <h2 className="font-serif text-xl font-medium text-emerald-900">Vos forces pour ce poste</h2>
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
                <h2 className="font-serif text-xl font-medium text-amber-900">À renforcer</h2>
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

      {/* ===== COMPÉTENCES DETECTÉES ===== */}
      {(detectedSkills.length > 0 || missingSkills.length > 0) && (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 font-serif text-xl font-medium text-foreground">Mapping des compétences</h2>
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

      {/* ===== RECOMMANDATIONS TRAJECTOIRE ===== */}
      {recommendations.length > 0 && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-100">
              <Sparkles className="size-4 text-violet-600" />
            </div>
            <h2 className="font-serif text-xl font-medium text-violet-900">Recommandations Trajectoire</h2>
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

      {/* ===== PAYWALL (Secondaire si non premium) ===== */}
      {!hasPremiumAccess && (
        <div className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-sm">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Préparation premium</p>
                <h3 className="mt-1 font-serif text-lg font-medium text-foreground">Débloquez l'analyse complète</h3>
                <p className="mt-1 text-sm text-foreground-muted">Matching IA, simulations d'entretien, recommandations illimitées.</p>
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
                <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Préparation premium</p>
                <h3 className="mt-1 font-serif text-lg font-medium text-foreground">Allez plus loin dans votre préparation</h3>
                <p className="mt-1 text-sm text-foreground-muted">Matching IA, simulations d'entretien, suivi avancé.</p>
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
