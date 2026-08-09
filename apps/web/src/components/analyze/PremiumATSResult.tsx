// apps/web/src/components/analyze/PremiumATSResult.tsx
//
// Composant PremiumATSResult
// MVP-013 — Premium ATS Result UI

'use client'

import { motion } from 'framer-motion'
import { Check, X, TrendingUp, AlertCircle, Lightbulb, Target, Eye, FileText, Key, Briefcase, GraduationCap, Globe, Heart } from 'lucide-react'
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
}

export function PremiumATSResult({
  score,
  radarDimensions = { structure: 70, keywords: 65, impact: 75, clarity: 80, relevance: 70 },
  strengths = ['Expérience professionnelle variée', 'Compétences techniques solides', 'Formation pertinente'],
  weaknesses = ['Section objectifs vague', 'Manque de mots-clés spécifiques', 'Formation peu détaillée'],
  recommendations = ['Ajouter des métriques chiffrées', 'Inclure les technologies spécifiques', 'Détaillez vos projets'],
  detectedSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git'],
  missingSkills = ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
  interviewProbability = 65,
  compatibility = 72,
  readability = 78,
  structure = 68,
  keywords = 55,
  experience = 85,
  education = 60,
  languages = 70,
  softSkills = 75,
}: PremiumATSResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e' // green
    if (score >= 60) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Bon'
    if (score >= 40) return 'Moyen'
    return 'À améliorer'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Analyse ATS
          </h1>
          <p className="text-slate-600">
            Votre CV a été analysé par notre IA
          </p>
        </motion.div>

        {/* Score Circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="12"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke={getScoreColor(score)}
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: score / 100 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-slate-900">{score}</span>
              <span className="text-sm text-slate-600">/ 100</span>
              <span className="text-sm font-medium mt-1" style={{ color: getScoreColor(score) }}>
                {getScoreLabel(score)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Analyse multidimensionnelle</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Structure', value: radarDimensions.structure, icon: FileText },
              { label: 'Mots-clés', value: radarDimensions.keywords, icon: Key },
              { label: 'Impact', value: radarDimensions.impact, icon: TrendingUp },
              { label: 'Lisibilité', value: radarDimensions.clarity, icon: Eye },
              { label: 'Compatibilité', value: radarDimensions.relevance, icon: Target },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <item.icon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <div className="text-2xl font-bold text-slate-900">{item.value}%</div>
                <div className="text-sm text-slate-600">{item.label}</div>
                <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="h-full bg-indigo-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            { label: 'Probabilité entretien', value: interviewProbability, icon: Target },
            { label: 'Compatibilité', value: compatibility, icon: Heart },
            { label: 'Lisibilité', value: readability, icon: Eye },
            { label: 'Structure', value: structure, icon: FileText },
            { label: 'Mots-clés ATS', value: keywords, icon: Key },
            { label: 'Expérience', value: experience, icon: Briefcase },
            { label: 'Formation', value: education, icon: GraduationCap },
            { label: 'Langues', value: languages, icon: Globe },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl shadow-md p-4">
              <item.icon className="w-6 h-6 text-slate-600 mb-2" />
              <div className="text-2xl font-bold text-slate-900">{item.value}%</div>
              <div className="text-sm text-slate-600">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-6"
        >
          {/* Detected Skills */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Compétences détectées
            </h3>
            <div className="flex flex-wrap gap-2">
              {detectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              Compétences manquantes
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Strengths, Weaknesses, Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-3 gap-6 mb-6"
        >
          {/* Strengths */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Points forts
            </h3>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Points faibles
            </h3>
            <ul className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                  <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              Conseils immédiats
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Blurred Content (70%) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden"
        >
          <div className="backdrop-blur-sm bg-white/30 p-8 rounded-xl">
            {/* Blurred placeholder content */}
            <div className="space-y-4 opacity-30">
              <div className="h-8 bg-slate-300 rounded animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-2/3 animate-pulse" />
              <div className="h-8 bg-slate-300 rounded animate-pulse mt-4" />
              <div className="h-4 bg-slate-300 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-4/5 animate-pulse" />
              <div className="h-4 bg-slate-300 rounded w-3/5 animate-pulse" />
            </div>
          </div>

          {/* CTA Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/95">
            <div className="text-center max-w-md px-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Débloquez le rapport complet gratuitement
              </h2>
              <ul className="text-left space-y-3 mb-6 text-slate-700">
                {[
                  'Rapport complet',
                  'Matching IA',
                  'Copilot RH',
                  'Simulation d\'entretien',
                  'Historique',
                  'Recommandations personnalisées',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup-conversion"
                className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Créer mon compte gratuitement
              </Link>
              <p className="text-sm text-slate-500 mt-3">
                Aucune carte bancaire requise
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Conservez toutes vos données après inscription
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
