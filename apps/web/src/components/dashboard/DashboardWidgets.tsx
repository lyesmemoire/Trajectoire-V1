// apps/web/src/components/dashboard/DashboardWidgets.tsx
//
// Composant principal du Dashboard - Layout et orchestration des widgets
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { DashboardHero } from './DashboardHero'
import { DashboardScore } from './DashboardScore'
import { DashboardSkills } from './DashboardSkills'
import { DashboardCareer } from './DashboardCareer'
import { DashboardRecommendations } from './DashboardRecommendations'
import { DashboardHistory } from './DashboardHistory'
import { DashboardActions } from './DashboardActions'
import { DashboardProgress } from './DashboardProgress'
import { DashboardInsights } from './DashboardInsights'
import { DashboardTimeline } from './DashboardTimeline'
import type { DashboardProps } from '@/types/dashboard'

export function DashboardWidgets({
  userData,
  score,
  skills,
  career,
  recommendations,
  history,
  actions,
  progress,
  insights,
  timeline,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-ivoire-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <DashboardHero userData={userData} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Score ATS - Full width on mobile, 1 col on tablet/desktop */}
          <div className="md:col-span-1 lg:col-span-1">
            <DashboardScore score={score} />
          </div>

          {/* Skills - Full width on mobile, 1 col on tablet/desktop */}
          <div className="md:col-span-1 lg:col-span-1">
            <DashboardSkills skills={skills} />
          </div>

          {/* Career - Full width on mobile, 1 col on tablet/desktop */}
          <div className="md:col-span-1 lg:col-span-1">
            <DashboardCareer career={career} />
          </div>

          {/* Recommendations - Full width on mobile, 2 cols on tablet/desktop */}
          <div className="md:col-span-2 lg:col-span-2">
            <DashboardRecommendations recommendations={recommendations} />
          </div>

          {/* History - Full width on mobile, 1 col on tablet/desktop */}
          <div className="md:col-span-1 lg:col-span-1">
            <DashboardHistory history={history} />
          </div>

          {/* Actions - Full width on mobile, 2 cols on tablet/desktop */}
          <div className="md:col-span-2 lg:col-span-2">
            <DashboardActions actions={actions} />
          </div>

          {/* Progress - Full width on mobile, 1 col on tablet/desktop */}
          <div className="md:col-span-1 lg:col-span-1">
            <DashboardProgress progress={progress} />
          </div>

          {/* Insights - Full width on mobile, 1 col on tablet/desktop */}
          <div className="md:col-span-1 lg:col-span-1">
            <DashboardInsights insights={insights} />
          </div>

          {/* Timeline - Full width on mobile, 1 col on tablet/desktop */}
          <div className="md:col-span-1 lg:col-span-1">
            <DashboardTimeline timeline={timeline} />
          </div>
        </div>
      </div>
    </div>
  )
}
