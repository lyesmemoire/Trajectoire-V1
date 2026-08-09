// apps/web/src/components/dashboard/DashboardHero.tsx
//
// Hero section du dashboard
// MVP-011 — Dashboard WOW

'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'
import { DashboardUserData } from '@/types/dashboard'

interface DashboardHeroProps {
  userData: DashboardUserData
}

export function DashboardHero({ userData }: DashboardHeroProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bonjour'
    if (hour < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-2"
          >
            <h1 className="text-4xl font-serif font-bold text-ink-900">
              {getGreeting()}, {userData.firstName} 👋
            </h1>
            <div className="p-2 bg-bronze-100 rounded-full">
              <Sparkles className="w-5 h-5 text-bronze-600" />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-ink-600 text-lg"
          >
            Votre parcours carrière, optimisé par l'IA
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden md:flex items-center gap-2 bg-forest-50 px-4 py-2 rounded-full border border-forest-200"
        >
          <TrendingUp className="w-4 h-4 text-forest-600" />
          <span className="text-sm font-medium text-forest-700">
            Progression en cours
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
