'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/posthog'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface CommitteeDecision {
  executiveSummary: string
  strategicCredibility: number; // 0-100
  shortlistProbability: number; // 0-100
  hiringSignal: 'strong_yes' | 'yes' | 'maybe' | 'no'
}

function HiringSignalBadge({ signal }: { signal: CommitteeDecision['hiringSignal'] }) {
  const config = {
    strong_yes: { label: 'Décision très favorable', classes: 'bg-forest-100 text-forest-800 ring-forest-500/30' },
    yes: { label: 'Avis positif', classes: 'bg-forest-50 text-forest-700 ring-forest-600/20' },
    maybe: { label: 'Avis mitigé', classes: 'bg-terracotta-50 text-terracotta-700 ring-terracotta-600/20' },
    no: { label: 'Avis défavorable', classes: 'bg-brick-50 text-brick-700 ring-brick-600/20' }
  }
  
  const { label, classes } = config[signal] || config.no
  
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-bold ring-1 ring-inset uppercase tracking-wider ${classes}`}>
      {label}
    </span>
  )
}

interface Props {
  decision: CommitteeDecision
  overallScore?: number
  sessionId?: string
  cts?: { score: number; delta: number; label: string }
  delayMs?: number; // défaut 1200
}

export function CommitteeDecisionReveal({ decision, overallScore, sessionId, cts, delayMs = 1200 }: Props) {
  const [phase, setPhase] = useState<'idle' | 'deliberating' | 'revealed'>('idle')

  useEffect(() => {
    if (phase === 'revealed') {
      trackEvent('committee_decision_generated', {
        hiring_signal: decision.hiringSignal,
        shortlist_probability: decision.shortlistProbability,
        strategic_credibility: decision.strategicCredibility,
        overall_score: overallScore || 0,
        session_id: sessionId || 'unknown'
      })

      if (cts) {
        trackEvent('career_trajectory_updated', {
          new_cts: cts.score,
          delta: cts.delta,
          label: cts.label,
          session_id: sessionId || 'unknown'
        })
      }
    }
  }, [phase, decision, overallScore, sessionId, cts])

  const startDeliberation = () => {
    setPhase('deliberating')
    // On simule la délibération même si la donnée est déjà prête.
    setTimeout(() => setPhase('revealed'), delayMs)
  }

  return (
    <div className="mt-8 rounded-[2rem] bg-ivoire-50 p-8 ring-1 ring-ivoire-200">
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="cta"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center"
          >
            <button
              onClick={startDeliberation}
              className="rounded-2xl bg-ink-900 px-8 py-4 text-sm font-medium
                         text-ivoire-50 transition-colors hover:bg-ink-800 shadow-premium"
            >
              Voir la décision simulée du comité
            </button>
          </motion.div>
        )}

        {phase === 'deliberating' && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6 py-4"
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-ink-400"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <p className="text-sm font-bold tracking-widest text-ink-500 uppercase mt-2">Comité en délibération…</p>
          </motion.div>
        )}

        {phase === 'revealed' && (
          <motion.div
            key="decision"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
            }}
            className={`space-y-8 ${decision.hiringSignal === 'strong_yes' ? 'relative' : ''}`}
          >
            {decision.hiringSignal === 'strong_yes' && (
              <div className="absolute inset-0 bg-forest-500/5 blur-3xl rounded-[3rem] -z-10 pointer-events-none" />
            )}
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div>
                <p className="text-xs uppercase font-black tracking-widest text-ink-400">
                  Décision simulée du comité
                </p>
                <p className="mt-3 text-xl font-bold leading-snug text-ink-900">
                  {decision.executiveSummary}
                </p>
              </div>
              <motion.div 
                className="shrink-0 pt-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.9 }}
              >
                <HiringSignalBadge signal={decision.hiringSignal} />
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 pt-6 border-t border-ivoire-200">
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <p className="text-xs uppercase font-black tracking-widest text-ink-400">
                  Crédibilité Stratégique
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-3xl font-black text-ink-900">
                    {decision.strategicCredibility}
                  </p>
                  <span className="text-sm font-medium text-ink-500">/ 100</span>
                </div>
              </motion.div>
              
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                <p className="text-xs uppercase font-black tracking-widest text-ink-400">
                  Probabilité de Shortlist
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-3xl font-black text-ink-900">
                    {decision.shortlistProbability}
                  </p>
                  <span className="text-sm font-medium text-ink-500">%</span>
                </div>
              </motion.div>
            </div>
            
            {/* CTS et CTA de rétention (Phase 4) */}
            <motion.div 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1.5 } } }}
              className="pt-6 border-t border-ivoire-100 space-y-6"
            >
              {cts && (
                <div className="bg-ivoire-50/50 rounded-2xl p-5 border border-ivoire-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-ink-400 uppercase tracking-widest">
                      Career Trajectory Score
                    </p>
                    <p className="font-bold text-ink-800 mt-1">{cts.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-ink-900">{cts.score}</p>
                    <p className={`text-sm font-bold ${cts.delta >= 0 ? 'text-forest-600' : 'text-brick-600'}`}>
                      {cts.delta > 0 ? '+' : ''}{cts.delta}
                    </p>
                  </div>
                </div>
              )}

              {(decision.hiringSignal === 'maybe' || decision.hiringSignal === 'no') && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-ink-500 italic">
                    {decision.hiringSignal === 'maybe' 
                      ? "💡 Une amélioration ciblée pourrait significativement augmenter vos chances."
                      : "💡 Le comité estime qu'un travail structuré permettrait d'atteindre un niveau compétitif."}
                  </p>
                  <Link 
                    href="/simulation/new?focus=weakness"
                    onClick={() => {
                      trackEvent('committee_cta_clicked', { session_id: sessionId || 'unknown' })
                    }}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-ivoire-50 bg-ink-900 rounded-xl hover:bg-ink-800 transition-colors shadow-premium shadow-ink-900/20"
                  >
                    Travailler les points faibles identifiés
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
