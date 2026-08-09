// apps/web/src/components/ats/ATSTimeline.tsx
//
// Timeline pour afficher les expériences et formations
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Calendar, Building2 } from 'lucide-react'
import { DetectedExperience, DetectedEducation } from '@/types/ats'

interface ATSTimelineProps {
  experiences: DetectedExperience[]
  education: DetectedEducation[]
}

export function ATSTimeline({ experiences, education }: ATSTimelineProps) {
  const allItems = [
    ...experiences.map(item => ({ ...item, type: 'experience' as const })),
    ...education.map(item => ({ ...item, type: 'education' as const })),
  ].sort((a, b) => {
    // Sort by year descending (education first, then experiences)
    if (a.type === 'education' && b.type === 'education') {
      return (b as DetectedEducation).year - (a as DetectedEducation).year
    }
    if (a.type === 'education') return -1
    if (b.type === 'education') return 1
    return 0
  })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink-900 mb-4">Parcours</h3>
      
      {allItems.length === 0 ? (
        <div className="text-center py-8 text-ink-500 text-sm">
          Aucune information de parcours détectée
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-ivoire-300" />
          
          {allItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-10 pb-6 last:pb-0"
            >
              {/* Timeline dot */}
              <div className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 ${
                item.type === 'experience' 
                  ? 'bg-bronze-100 border-bronze-400' 
                  : 'bg-forest-100 border-forest-400'
              }`} />
              
              {/* Content */}
              <div className="bg-white p-4 rounded-xl border border-ivoire-200">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'experience' 
                      ? 'bg-bronze-100' 
                      : 'bg-forest-100'
                  }`}>
                    {item.type === 'experience' ? (
                      <Briefcase className="w-4 h-4 text-bronze-600" />
                    ) : (
                      <GraduationCap className="w-4 h-4 text-forest-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    {item.type === 'experience' ? (
                      <>
                        <h4 className="text-sm font-semibold text-ink-900">
                          {(item as DetectedExperience).position}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="w-3 h-3 text-ink-500" />
                          <span className="text-xs text-ink-600">
                            {(item as DetectedExperience).company}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-ink-500" />
                          <span className="text-xs text-ink-500">
                            {(item as DetectedExperience).duration} mois
                          </span>
                          <span className={`text-xs font-medium ${
                            (item as DetectedExperience).relevance >= 70 ? 'text-forest-600' :
                            (item as DetectedExperience).relevance >= 40 ? 'text-amber-600' :
                            'text-brick-600'
                          }`}>
                            • Pertinence: {(item as DetectedExperience).relevance}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="text-sm font-semibold text-ink-900">
                          {(item as DetectedEducation).degree}
                        </h4>
                        <p className="text-xs text-ink-600 mt-1">
                          {(item as DetectedEducation).institution}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-ink-500" />
                          <span className="text-xs text-ink-500">
                            {(item as DetectedEducation).year}
                          </span>
                          <span className="text-xs text-ink-500">
                            • {(item as DetectedEducation).field}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
