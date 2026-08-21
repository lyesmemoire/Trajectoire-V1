"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScoreCircle } from "@/components/ScoreCircle"

interface Props {
  user: any
  lastAnalysis: any
  previousAnalysis: any
  quota: any
}

const getCultInsight = (analysis: any): string => {
  if (!analysis) return "Commencez par analyser votre CV pour découvrir votre profil."
  
  const strengths = analysis.strengths || []
  if (strengths.length > 0) {
    const topStrength = strengths[0]
    return `Votre ${topStrength.toLowerCase()} est votre atout majeur. C'est précisément ce que les recruteurs recherchent en priorité.`
  }
  
  return "Votre profil a du potentiel. Les recruteurs perçoivent clairement votre valeur ajoutée."
}

export function DashboardContent({ user, lastAnalysis, previousAnalysis, quota }: Props) {
  const userName = user.email?.split("@")[0] || "Utilisateur"
  const lastScore = lastAnalysis?.atsScoreAfter || 0
  const percentile = lastAnalysis?.percentile || 0
  const previousScore = previousAnalysis?.atsScoreAfter || 0
  const evolution = lastScore - previousScore
  const cultInsight = getCultInsight(lastAnalysis)

  return (
    <main
      className="
        min-h-screen bg-ivoire-50
        text-ink-900
        px-6 py-12
        relative overflow-hidden
      "
    >
      {/* Lumières d'ambiance premium */}
      <div className="absolute top-[-10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-bronze-100/25 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-bronze-50/30 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto mb-12 flex items-center justify-between relative z-10">
        <Link href="/" className="text-lg font-serif font-semibold tracking-tight text-ink-900">
          Trajectoire
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-ink-600">{user.email}</span>
          <Link
            href="/api/auth/logout"
            className="text-sm text-ink-600 hover:text-ink-900 transition-colors"
          >
            Déconnexion
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        {/* Welcome émotionnel */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-ink-600 text-sm">Bienvenue,</p>
          <h1 className="text-3xl font-serif font-semibold mt-1 text-ink-900">
            {userName}.
          </h1>
          <p className="text-ink-600 mt-2">
            Voici votre progression.
          </p>
        </motion.header>

        {/* Carte score signature */}
        {lastAnalysis ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="
              relative
              bg-white/70 backdrop-blur-xl
              border border-ivoire-200/60
              rounded-3xl
              p-10
              overflow-hidden
              shadow-premium
            "
          >
            {/* Background glow bronze */}
            <div
              className="
                absolute -top-20 -right-20
                w-72 h-72
                bg-bronze-100/20
                rounded-full
                blur-3xl
              "
            />

            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              {/* Score */}
              <div className="flex flex-col items-center text-center">
                <p className="text-ink-600 text-sm mb-2">
                  Score actuel
                </p>
                <ScoreCircle value={lastScore} />
                <p className="text-ink-600 mt-4">
                  Vous performez mieux que{" "}
                  <span className="text-ink-900 font-medium">
                    {percentile}%
                  </span>{" "}
                  des candidats.
                </p>
              </div>

              {/* Evolution */}
              <div className="space-y-6">
                <div>
                  <p className="text-ink-600 text-sm">
                    Évolution
                  </p>
                  <p className="text-2xl font-serif font-semibold mt-1 text-ink-900">
                    {evolution > 0 ? "+" : ""}
                    {evolution} points
                  </p>
                  <p className="text-forest-700 text-sm mt-1">
                    depuis votre dernière analyse
                  </p>
                </div>

                <div className="h-px bg-ivoire-200" />

                <div>
                  <p className="text-ink-600 text-sm">
                    Prochaine étape
                  </p>
                  <p className="text-ink-900 mt-1">
                    Atteindre 80/100 pour rejoindre le top 20%.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="
              bg-white/70 backdrop-blur-xl
              border border-ivoire-200/60
              rounded-3xl
              p-10
              text-center
              shadow-premium
            "
          >
            <h2 className="text-2xl font-serif font-semibold mb-4 text-ink-900">
              Commencez par analyser votre CV
            </h2>
            <p className="text-ink-600 mb-6">
              Découvrez votre score en 30 secondes
            </p>
            <Link href="/analyze">
              <Button size="lg">
                Analyser mon CV
              </Button>
            </Link>
          </motion.section>
        )}

        {/* Insight signature */}
        {lastAnalysis && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="
              relative
              bg-gradient-to-br
              from-bronze-50
              to-ivoire-100/50
              border border-bronze-200/50
              rounded-2xl
              p-8
            "
          >
            <div
              className="
                absolute top-6 right-6
                w-10 h-10
                flex items-center justify-center
                rounded-full
                bg-bronze-100
                shadow-premium
              "
            >
              <span className="text-bronze-700 text-lg">★</span>
            </div>

            <p className="text-ink-600 text-sm">Insight</p>
            <p className="text-xl text-ink-900 mt-3 leading-relaxed">
              {cultInsight}
            </p>
          </motion.section>
        )}

        {/* CTA évolution */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <Link href="/analyze">
            <Button size="lg">
              Faire évoluer mon score →
            </Button>
          </Link>
          <p className="text-ink-400 text-xs mt-3">
            {quota.remaining > 0 
              ? `${quota.remaining} analyse${quota.remaining > 1 ? 's' : ''} gratuite${quota.remaining > 1 ? 's' : ''} ce mois`
              : "Votre quota mensuel est épuisé"
            }
          </p>
        </motion.section>
      </div>
    </main>
  )
}