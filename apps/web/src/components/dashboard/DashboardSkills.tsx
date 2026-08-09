// apps/web/src/components/dashboard/DashboardSkills.tsx
//
// Widget Compétences du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Code, Users, Globe } from 'lucide-react'
import { DashboardSkill } from '@/types/dashboard'

interface DashboardSkillsProps {
  skills: DashboardSkill[]
}

export function DashboardSkills({ skills }: DashboardSkillsProps) {
  const getCategoryIcon = (category: DashboardSkill['category']) => {
    switch (category) {
      case 'technical':
        return <Code className="w-4 h-4" />
      case 'soft':
        return <Users className="w-4 h-4" />
      case 'language':
        return <Globe className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: DashboardSkill['category']) => {
    switch (category) {
      case 'technical':
        return 'bg-bronze-100 text-bronze-700'
      case 'soft':
        return 'bg-forest-100 text-forest-700'
      case 'language':
        return 'bg-sky-100 text-sky-700'
    }
  }

  const getTrendIcon = (trend?: DashboardSkill['trend']) => {
    if (!trend) return null
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-forest-600" />
      case 'down':
        return <TrendingDown className="w-3 h-3 text-brick-600" />
      default:
        return null
    }
  }

  const topSkills = skills.slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white p-6 rounded-2xl border border-ivoire-200 shadow-premium"
    >
      <h3 className="text-sm font-medium text-ink-600 mb-4">Vos compétences</h3>

      <div className="space-y-4">
        {topSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${getCategoryColor(skill.category)}`}>
                  {getCategoryIcon(skill.category)}
                </div>
                <span className="text-sm font-medium text-ink-900">{skill.name}</span>
                {getTrendIcon(skill.trend)}
              </div>
              <span className="text-sm font-semibold text-ink-900">{skill.level}%</span>
            </div>
            <div className="w-full h-2 bg-ivoire-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                className={`h-full rounded-full ${
                  skill.level >= 80
                    ? 'bg-forest-500'
                    : skill.level >= 60
                    ? 'bg-bronze-500'
                    : skill.level >= 40
                    ? 'bg-sky-500'
                    : 'bg-brick-500'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {skills.length > 6 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-sm text-ink-500 mt-4 text-center"
        >
          +{skills.length - 6} autres compétences
        </motion.p>
      )}
    </motion.div>
  )
}
