// apps/web/src/components/conversion/ConversionPanel.tsx
//
// Panneau principal de conversion
// MVP-009 — Conversion Funnel

'use client'

import { motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { BenefitsList } from './BenefitsList'
import { CTASection } from './CTASection'
import { TrustSection } from './TrustSection'
import { SecuritySection } from './SecuritySection'
import { ProgressSection } from './ProgressSection'
import { FAQSection } from './FAQSection'
import { ConversionPanelProps } from '@/types/conversion'
import { createClient } from '@/lib/supabase'

export function ConversionPanel({
  atsScore,
  onGoogleSignIn,
  onGithubSignIn,
  onEmailSignup,
  onContinue,
  mode = 'conversion',
}: ConversionPanelProps) {
  const handleGoogleSignIn = async () => {
    if (onGoogleSignIn) {
      onGoogleSignIn()
    } else {
      // Default: redirect to Google OAuth via Supabase
      const supabase = createClient()
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
    }
  }

  const handleGithubSignIn = async () => {
    if (onGithubSignIn) {
      onGithubSignIn()
    } else {
      // Default: redirect to Github OAuth via Supabase
      const supabase = createClient()
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
    }
  }

  const handleEmailSignup = async () => {
    if (onEmailSignup) {
      onEmailSignup()
    } else {
      // Default: redirect to signup page
      window.location.href = '/signup-conversion'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-ivoire-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bronze-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-bronze-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-900">
                Votre analyse est prête
              </h2>
              {atsScore && (
                <p className="text-sm text-ink-600">
                  Score ATS : {atsScore}/100
                </p>
              )}
            </div>
          </div>
          {onContinue && (
            <button
              onClick={onContinue}
              className="text-ink-500 hover:text-ink-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Benefits */}
          <BenefitsList />

          {/* CTA */}
          <CTASection
            onGoogleSignIn={handleGoogleSignIn}
            onGithubSignIn={handleGithubSignIn}
            onEmailSignup={handleEmailSignup}
          />

          {/* Progress */}
          <ProgressSection />

          {/* Security */}
          <SecuritySection />

          {/* Trust */}
          <TrustSection />

          {/* FAQ */}
          <FAQSection />
        </div>
      </motion.div>
    </motion.div>
  )
}
