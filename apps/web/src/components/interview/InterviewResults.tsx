"use client"

import Link from "next/link"
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommitteeDecisionReveal } from "./CommitteeDecisionReveal"

/**
 * Replay Allégé - Structure Stricte:
 * Section 1: Ce que vous faites bien (Max 2)
 * Section 2: Le point à corriger (Max 1)
 * Section 3: Exercice recommandé (Max 1, < 5 min)
 */
export function InterviewResults({ session }: { session: any }) {
  const analysis = session.analysis || {}
  const strengths = (analysis.strengths || []).slice(0, 2)
  const improvement = (analysis.improvements || [])[0]
  const recommendedDrill = (analysis.tips || [])[0]

  const committeeDecision = analysis.committeeDecision ?? null

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-16 font-sans antialiased text-ink-900">
      {/* HERO : RASSURER D'ABORD */}
      <section className="text-center space-y-4 py-6">
        <h1 className="text-5xl font-black tracking-tighter leading-tight text-ink-900">
          Vous progressez.
        </h1>
        <p className="text-lg text-ink-500 font-medium italic">
          "Votre calme sous pression est un signal fort."
        </p>
      </section>

      <div className="space-y-8">
        {/* SECTION 1: CE QUE VOUS FAITES BIEN */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-ink-400 uppercase tracking-widest ml-4">
            Ce que vous faites bien
          </h3>
          <div className="grid gap-4">
            {strengths.map((s: string, i: number) => (
              <div
                key={i}
                className="p-8 bg-forest-50 border border-forest-100 rounded-[2rem] flex gap-6 items-center"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-forest-500" />
                </div>
                <p className="text-lg font-bold text-forest-900">{s}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: LE POINT À CORRIGER */}
        <section className="space-y-4">
          <h3 className="text-xs font-black text-ink-400 uppercase tracking-widest ml-4">
            Le point à corriger maintenant
          </h3>
          <div className="p-8 bg-bronze-50 border border-bronze-100 rounded-[2rem] flex gap-6 items-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">
              💡
            </div>
            <div>
              <p className="text-lg font-bold text-bronze-900">
                {improvement || "Travaillez la précision de vos exemples."}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: DECISION DU COMITÉ */}
        {committeeDecision && (
          <section className="space-y-4">
            <CommitteeDecisionReveal 
              decision={committeeDecision} 
              sessionId={session.id}
              overallScore={analysis.overallScore}
              cts={analysis.careerTrajectoryScore}
            />
          </section>
        )}

        {/* SECTION 4: EXERCICE RECOMMANDÉ */}
        <section className="bg-ink-900 rounded-[3rem] p-10 md:p-14 text-ivoire-50 shadow-premium-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Sparkles className="w-48 h-48" />
          </div>
          <div className="relative space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-bronze-400 uppercase tracking-[0.3em]">
                Momentum
              </p>
              <h2 className="text-3xl font-black">Exercice recommandé</h2>
              <p className="text-ink-400 font-medium leading-relaxed">
                {recommendedDrill ||
                  "Pratiquer les réponses concises face au scepticisme."}
              </p>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-2 text-sm font-bold text-ink-400 uppercase tracking-widest">
                <ChevronRight className="w-4 h-4" /> Moins de 5 minutes
              </div>
              <Link href="/dashboard/interview/session">
                <Button
                  size="lg"
                  className="h-16 px-12 rounded-2xl bg-ivoire-50 text-ink-900 font-black text-xl hover:bg-ivoire-100 shadow-premium w-full md:w-auto"
                >
                  Démarrer
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="text-center pt-8">
        <Link
          href="/dashboard"
          className="text-[10px] font-black text-ink-400 uppercase tracking-[0.4em] hover:text-bronze-600 transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </footer>
    </div>
  )
}
