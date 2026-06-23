"use client";

import { FinalReport } from "@/lib/interview/report";
import { PersistedResponse } from "@/lib/interview/report";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  FileEdit,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ReportPageClientProps {
  sessionId: string;
  report: FinalReport;
  responses: PersistedResponse[];
}

// ── Config par verdict ──────────────────────────────────────────────────────────
const VERDICT_CONFIG = {
  READY: {
    label: "Prêt pour l'entretien",
    color: "text-emerald-400",
    border: "border-emerald-500/50",
    bg: "bg-emerald-950/30",
    icon: CheckCircle,
    iconColor: "text-emerald-400",
  },
  NEEDS_WORK: {
    label: "Des points à consolider",
    color: "text-amber-400",
    border: "border-amber-500/50",
    bg: "bg-amber-950/30",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
  },
  NOT_READY: {
    label: "Retour au travail requis",
    color: "text-red-400",
    border: "border-red-500/50",
    bg: "bg-red-950/30",
    icon: XCircle,
    iconColor: "text-red-400",
  },
} as const;

const TARGET_CONFIG = {
  CV: { label: "Corriger le CV", icon: FileEdit, color: "bg-blue-600 hover:bg-blue-500" },
  PREPARATION: { label: "Préparer l'oral", icon: TrendingUp, color: "bg-purple-600 hover:bg-purple-500" },
  BOTH: { label: "CV + Préparation", icon: ArrowRight, color: "bg-orange-600 hover:bg-orange-500" },
};

export function ReportPageClient({
  sessionId,
  report,
  responses,
}: ReportPageClientProps) {
  const router = useRouter();
  const config = VERDICT_CONFIG[report.verdict];
  const VerdictIcon = config.icon;

  const getScoreColor = (v: number) =>
    v >= 75 ? "text-emerald-400" : v >= 50 ? "text-amber-400" : "text-red-400";

  const getBarColor = (v: number) =>
    v >= 75 ? "bg-emerald-500" : v >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-sm font-black tracking-widest uppercase text-slate-400">Rapport d'Entretien</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">

        {/* ── En-tête verdict ──────────────────────────────────────────────── */}
        <div className={cn("border rounded-[2rem] p-8 shadow-2xl", config.border, config.bg)}>
          <div className="flex items-start gap-5">
            <VerdictIcon className={cn("w-12 h-12 shrink-0 mt-1", config.iconColor)} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
                Verdict final
              </p>
              <h1 className={cn("text-3xl font-black mb-4", config.color)}>
                {config.label}
              </h1>
              <p className="text-slate-300 leading-relaxed text-sm font-medium">
                {report.executive_summary}
              </p>
            </div>
          </div>

          {/* Alerte incohérence critique */}
          {report.critical_inconsistency && (
            <div className="mt-6 bg-red-900/40 border border-red-800/50 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm leading-relaxed">
                <span className="font-black">Incohérence critique détectée.</span>{" "}
                Vos chiffres à l'oral ne correspondent pas à votre CV écrit.
                Un recruteur l'aurait relevé immédiatement.
              </p>
            </div>
          )}
        </div>

        {/* ── Scores agrégés ────────────────────────────────────────────────── */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
              Scores de performance
            </h2>
            <span className={cn("text-4xl font-black tabular-nums",
              getScoreColor(report.aggregate_scores.overall))}>
              {report.aggregate_scores.overall}
              <span className="text-lg text-slate-600">/100</span>
            </span>
          </div>

          {(
            [
              ["Cohérence CV / Oral", report.aggregate_scores.coherence, "×0.45"],
              ["Profondeur des réponses", report.aggregate_scores.depth, "×0.35"],
              ["Clarté d'expression", report.aggregate_scores.clarity, "×0.20"],
            ] as const
          ).map(([label, value, weight]) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                <span>
                  {label}
                  <span className="ml-2 text-slate-700">{weight}</span>
                </span>
                <span className={getScoreColor(value)}>{value}/100</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", getBarColor(value))}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* ── Forces validées ──────────────────────────────────────────────── */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-5">
            Ce que vous défendez bien
          </h2>
          <ul className="space-y-3">
            {report.validated_strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Failles critiques ─────────────────────────────────────────────── */}
        {report.critical_gaps.length > 0 && (
          <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-5">
              Failles à corriger
            </h2>
            <ul className="space-y-4">
              {report.critical_gaps.map((gap, i) => (
                <li key={i} className="border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-200 font-medium">{gap.gap}</p>
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold pl-7 uppercase">
                    Question {gap.source_question + 1}
                  </p>
                  {gap.cv_bullet_to_fix && (
                    <div className="pl-7">
                      <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase">Bullet à corriger :</p>
                      <p className="text-xs text-amber-300 bg-amber-900/20 border border-amber-800/50 rounded-xl px-4 py-3 font-mono leading-relaxed">
                        "{gap.cv_bullet_to_fix}"
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Plan d'action ────────────────────────────────────────────────── */}
        <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-5">
            Plan d'action — 3 priorités
          </h2>
          <ol className="space-y-4">
            {report.action_plan
              .sort((a, b) => a.priority - b.priority)
              .map((item) => {
                const targetConf = TARGET_CONFIG[item.target];
                const TargetIcon = targetConf.icon;
                return (
                  <li
                    key={item.priority}
                    className="flex items-start gap-5 border border-slate-800 rounded-2xl p-5"
                  >
                    <span className="text-3xl font-black text-slate-700 tabular-nums w-8 shrink-0 text-center">
                      {item.priority}
                    </span>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-slate-200 font-medium">{item.action}</p>
                      {item.cv_section && (
                        <p className="text-[10px] text-slate-500 font-bold uppercase">
                          Section CV : {item.cv_section}
                        </p>
                      )}
                    </div>
                    <span className={cn(
                      "flex items-center gap-1.5 text-[10px] text-white px-3 py-1.5",
                      "rounded-full shrink-0 font-black uppercase tracking-wider",
                      targetConf.color
                    )}>
                      <TargetIcon className="w-3 h-3" />
                      {targetConf.label}
                    </span>
                  </li>
                );
              })}
          </ol>
        </section>

        {/* ── Transcriptions détaillées ────────────────────────────────────── */}
        <details className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 group cursor-pointer">
          <summary className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black list-none flex justify-between items-center">
            Détail des réponses
            <ArrowRight className="w-4 h-4 text-slate-600 group-open:rotate-90 transition-transform" />
          </summary>
          <div className="mt-6 space-y-6">
            {responses
              .sort((a, b) => a.question_index - b.question_index)
              .map((r) => (
                <div key={r.question_index} className="space-y-3 border-t border-slate-800 pt-6 first:border-0 first:pt-0">
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">
                    Q{r.question_index + 1} — Score{" "}
                    <span className={getScoreColor(r.score.scores.overall)}>
                      {r.score.scores.overall}/100
                    </span>
                  </p>
                  <p className="text-sm text-slate-400 italic font-medium">"{r.question_text}"</p>
                  <p className="text-sm text-slate-300 bg-slate-800/50 rounded-xl p-4 leading-relaxed">
                    {r.transcription}
                  </p>
                </div>
              ))}
          </div>
        </details>

        {/* ── CTA Retour CV ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => router.push("/cv")}
            className="flex-1 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-5 rounded-2xl font-black uppercase tracking-wider text-xs transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-blue-500/20"
          >
            <FileEdit className="w-5 h-5" />
            Corriger mon CV
          </button>
          <button
            onClick={() => router.push(`/interview/session/${sessionId}`)}
            className="flex-1 flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-6 py-5 rounded-2xl font-black uppercase tracking-wider text-xs transition-all duration-200 border border-slate-700 hover:border-slate-600"
          >
            <TrendingUp className="w-5 h-5" />
            Recommencer la simulation
          </button>
        </div>

      </div>
    </div>
  );
}
