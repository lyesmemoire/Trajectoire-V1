// apps/web/src/components/conversion/CTASection.tsx
//
// Section CTA avec boutons d'authentification
// MVP-009 — Conversion Funnel

'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mail, Chrome, Github } from 'lucide-react'

interface CTASectionProps {
  onGoogleSignIn?: () => void
  onGithubSignIn?: () => void
  onEmailSignup?: () => void
  loading?: boolean
  defaultEmailRedirect?: string
}

export function CTASection({ 
  onGoogleSignIn, 
  onGithubSignIn, 
  onEmailSignup,
  loading = false,
  defaultEmailRedirect = '/signup-conversion'
}: CTASectionProps) {
  const handleEmailSignup = () => {
    if (onEmailSignup) {
      onEmailSignup()
    } else {
      window.location.href = defaultEmailRedirect
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-3"
    >
      {/* Google Sign In */}
      {onGoogleSignIn && (
        <Button
          onClick={onGoogleSignIn}
          disabled={loading}
          variant="secondary"
          className="w-full h-12 text-base font-medium"
        >
          <Chrome className="w-5 h-5 mr-2" />
          Continuer avec Google
        </Button>
      )}

      {/* Github Sign In */}
      {onGithubSignIn && (
        <Button
          onClick={onGithubSignIn}
          disabled={loading}
          variant="secondary"
          className="w-full h-12 text-base font-medium"
        >
          <Github className="w-5 h-5 mr-2" />
          Continuer avec Github
        </Button>
      )}

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ivoire-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-ink-500">ou</span>
        </div>
      </div>

      {/* Email Signup */}
      <Button
        onClick={handleEmailSignup}
        disabled={loading}
        className="w-full h-12 text-base font-medium bg-ink-900 hover:bg-ink-800"
      >
        <Mail className="w-5 h-5 mr-2" />
        Créer mon compte
      </Button>

      {/* Terms */}
      <p className="text-xs text-ink-500 text-center mt-4">
        En continuant, vous acceptez nos{' '}
        <a href="/terms" className="underline hover:text-ink-700">
          conditions d'utilisation
        </a>{' '}
        et notre{' '}
        <a href="/privacy" className="underline hover:text-ink-700">
          politique de confidentialité
        </a>
      </p>
    </motion.div>
  )
}
