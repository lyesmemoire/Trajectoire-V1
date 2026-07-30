"use client"

import { motion } from "framer-motion"
import { AnimatedScore } from "@/components/AnimatedScore"
import { ScoreCircle } from "@/components/ScoreCircle"
import { RadarChart } from "@/components/RadarChart"

interface Props {
  preview: any
  onContinue: () => void
}

const getCultInsight = (preview: any): string => {
  const { score, strengths, weakness, percentile } = preview
  
  // Basé sur les forces détectées
  if (strengths && strengths.length > 0) {
    const topStrength = strengths[0]
    if (score >= 80) {
      return `Votre ${topStrength.toLowerCase()} est votre atout majeur. C'est précisément ce que les recruteurs recherchent en priorité.`
    }
    if (score >= 65) {
      return `Vous avez une ${topStrength.toLowerCase()} solide. C'est un excellent point de départ pour vous différencier.`
    }
  }
  
  // Basé sur la faiblesse détectée
  if (weakness && score < 70) {
    return `Le point principal à améliorer est : ${weakness.toLowerCase()}. Nous savons exactement comment le transformer en atout.`
  }
  
  // Basé sur le percentile
  if (percentile >= 80) {
    return "Vous êtes dans le top 20% des candidats. Quelques ajustements stratégiques vous positionneraient dans l'élite."
  }
  if (percentile >= 60) {
    return "Votre profil se situe au-dessus de la moyenne. Les recruteurs perçoivent clairement votre valeur ajoutée."
  }
  
  // Fallback basé sur le score
  if (score >= 85) return "Votre profil est dans le top 5% des candidats que nous analysons."
  if (score >= 75) return "Vous avez un profil solide. Quelques ajustements vous positionneraient dans l'élite."
  if (score >= 60) return "Votre profil a du potentiel. Les recruteurs voient ce que vous pouvez apporter."
  return "Votre profil mérite d'être mieux mis en avant. Nous savons exactement comment."
}

export function ScoreReveal({ preview, onContinue }: Props) {
  const cultInsight = getCultInsight(preview)

  return (
    <div className="flex flex-col items-center text-center space-y-10">
      <ScoreCircle value={preview.score} />

      <div>
        <p className="text-text-secondary text-sm mb-1">
          Compatibilité avec l'offre
        </p>
        <AnimatedScore value={preview.score} />
      </div>

      {/* Moment culte - Insight personnalisé avec signature visuelle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="max-w-md relative"
      >
        {/* Lueur subtile derrière */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-xl"
        />
        
        <div className="relative bg-accent-primary/10 border border-accent-primary/20 rounded-xl p-6">
          {/* Icône discrète */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="absolute -top-3 -left-3 w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </motion.div>
          
          <p className="text-white font-medium leading-relaxed">
            {cultInsight}
          </p>
        </div>
      </motion.div>

      {preview.percentile && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-text-secondary"
        >
          Vous performez mieux que{" "}
          <span className="text-white font-medium">
            {preview.percentile}%
          </span>{" "}
          des candidats.
        </motion.p>
      )}

      {preview.gapToOptimal && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-status-warning text-sm"
        >
          Il vous manque {preview.gapToOptimal} points pour atteindre le seuil
          recommandé.
        </motion.p>
      )}

      {preview.radarDimensions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <RadarChart data={[
            preview.radarDimensions.structure,
            preview.radarDimensions.keywords,
            preview.radarDimensions.impact,
            preview.radarDimensions.clarity,
            preview.radarDimensions.relevance,
          ]} />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="space-y-4 w-full max-w-sm"
      >
        <button
          onClick={onContinue}
          className="
            w-full py-4 rounded-xl
            bg-accent-primary text-white font-medium
            shadow-[0_0_30px_rgba(99,102,241,0.25)]
            hover:shadow-[0_0_40px_rgba(99,102,241,0.45)]
            transition-all duration-200
          "
        >
          Découvrir comment optimiser votre profil
        </button>
        <p className="text-xs text-text-muted">
          3 analyses gratuites par mois. Sans carte bancaire.
        </p>
      </motion.div>
    </div>
  )
}
