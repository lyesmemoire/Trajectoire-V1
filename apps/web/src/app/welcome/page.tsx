// apps/web/src/app/welcome/page.tsx
//
// Page de bienvenue après inscription avec récupération preview
// MVP-014 — Welcome Flow

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { PreviewTokenManager } from '@/lib/preview-analysis/previewTokenManager'

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/signup-conversion')
        return
      }

      // Vérifier si une preview a été récupérée
      const previewToken = PreviewTokenManager.getSessionToken()
      if (!previewToken) {
        // Pas de preview, rediriger vers le dashboard
        router.push('/dashboard')
      }
    }

    checkAuth()
  }, [router])

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-slate-900 mb-3"
          >
            Bonne nouvelle !
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-600 mb-2"
          >
            Nous avons récupéré votre analyse ATS.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 mb-8"
          >
            Votre profil est déjà prêt.
          </motion.p>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-50 rounded-xl p-4 mb-8 text-left"
          >
            <ul className="space-y-3">
              {[
                'Analyse ATS récupérée',
                'Profil candidat créé',
                'Compétences détectées',
                'Historique initialisé',
                'Recommandations prêtes',
              ].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-3 text-slate-700"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            onClick={handleContinue}
            className="w-full bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            Continuer
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-sm text-slate-400 mt-4"
          >
            Accédez à votre dashboard personnalisé
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
