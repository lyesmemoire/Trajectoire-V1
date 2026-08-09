// apps/web/src/components/ats/ATSFooter.tsx
//
// Footer du rapport ATS avec actions
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { Download, Save, Share2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ATSFooterProps {
  mode?: 'preview' | 'full'
  onDownloadPDF?: () => void
  onSave?: () => void
  onShare?: () => void
  onNewAnalysis?: () => void
}

export function ATSFooter({ 
  mode = 'preview', 
  onDownloadPDF, 
  onSave, 
  onShare, 
  onNewAnalysis 
}: ATSFooterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mt-8 pt-6 border-t border-ivoire-200"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Actions principales */}
        <div className="flex flex-wrap gap-3">
          {mode === 'full' && onSave && (
            <Button
              onClick={onSave}
              variant="secondary"
              size="md"
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
          )}
          
          {mode === 'full' && onDownloadPDF && (
            <Button
              onClick={onDownloadPDF}
              variant="secondary"
              size="md"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger PDF
            </Button>
          )}
          
          {onShare && (
            <Button
              onClick={onShare}
              variant="secondary"
              size="md"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          )}
        </div>

        {/* Action secondaire */}
        {onNewAnalysis && (
          <Button
            onClick={onNewAnalysis}
            variant="ghost"
            size="md"
            className="flex items-center gap-2 text-ink-600 hover:text-ink-900"
          >
            <RefreshCw className="w-4 h-4" />
            Nouvelle analyse
          </Button>
        )}
      </div>

      {/* Message de contexte */}
      {mode === 'preview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-ink-500">
            Créez un compte pour sauvegarder cette analyse et accéder à toutes les fonctionnalités
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
