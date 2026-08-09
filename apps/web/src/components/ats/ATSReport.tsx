// apps/web/src/components/ats/ATSReport.tsx
//
// Composant principal du rapport ATS
// MVP-008 — ATS Experience

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ATSHeader } from './ATSHeader'
import { ATSRadar } from './ATSRadar'
import { StrengthCard } from './StrengthCard'
import { WeaknessCard } from './WeaknessCard'
import { RecommendationCard } from './RecommendationCard'
import { QuickWinCard } from './QuickWinCard'
import { ATSTimeline } from './ATSTimeline'
import { ATSSummary } from './ATSSummary'
import { ATSFooter } from './ATSFooter'
import { ATSReportData, ATSReportProps } from '@/types/ats'
import { Badge, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export function ATSReport({ data, mode = 'preview', onDownloadPDF, onSave, onNewAnalysis }: ATSReportProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-premium border border-ivoire-200 overflow-hidden"
    >
      {/* Header */}
      <ATSHeader data={data} />

      <div className="p-6 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-6">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="recommendations">Conseils</TabsTrigger>
            <TabsTrigger value="timeline">Parcours</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="bg-ivoire-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-ink-900 mb-4">Dimensions du CV</h3>
                <ATSRadar dimensions={data.radarDimensions} />
              </div>

              {/* Recruiter Summary */}
              <ATSSummary summary={data.recruiterSummary} />
            </div>

            {/* Quick Wins */}
            {data.quickWins.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-4 flex items-center gap-2">
                  <Badge className="w-5 h-5" />
                  Actions rapides (Quick Wins)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.quickWins.map((quickWin, index) => (
                    <QuickWinCard key={index} quickWin={quickWin} index={index} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* Strengths */}
            {data.strengths.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-forest-600" />
                  Points forts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.strengths.map((strength, index) => (
                    <StrengthCard key={index} strength={strength} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            {data.weaknesses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-brick-600" />
                  Points à améliorer
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.weaknesses.map((weakness, index) => (
                    <WeaknessCard key={index} weakness={weakness} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Detected Skills */}
            {data.detectedSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-4">Compétences détectées</h3>
                <div className="flex flex-wrap gap-2">
                  {data.detectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm"
                    >
                      {skill.name} ({skill.level}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {data.missingSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Compétences manquantes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-brick-100 text-brick-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {data.languages.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-ink-900 mb-4">Langues</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {data.languages.map((lang, index) => (
                    <div key={index} className="bg-ivoire-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-ink-900">{lang.language}</p>
                      <p className="text-xs text-ink-600">{lang.level}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            {data.recommendations.length > 0 ? (
              data.recommendations.map((recommendation, index) => (
                <RecommendationCard key={index} recommendation={recommendation} index={index} />
              ))
            ) : (
              <div className="text-center py-8 text-ink-500">
                Aucune recommandation disponible
              </div>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <ATSTimeline experiences={data.experiences} education={data.education} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <ATSFooter
        mode={mode}
        onDownloadPDF={onDownloadPDF}
        onSave={onSave}
        onNewAnalysis={onNewAnalysis || (() => window.location.reload())}
      />
    </motion.div>
  )
}
