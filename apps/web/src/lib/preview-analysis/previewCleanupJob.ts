// apps/web/src/lib/preview-analysis/previewCleanupJob.ts
//
// Job de cleanup automatique des tokens expirés
// MVP-012 — Preview Analysis System

import { previewAnalysisService } from './PreviewAnalysisService'
import { logger } from '@/lib/logger/Logger'

/**
 * Job de cleanup des tokens expirés
 * À exécuter périodiquement (ex: toutes les heures via cron)
 */
export async function previewCleanupJob() {
  try {
    const deletedCount = await previewAnalysisService.cleanupExpired()
    
    logger.info(`[PreviewCleanup] Deleted ${deletedCount} expired preview analyses`, { deletedCount })
    
    return {
      success: true,
      deletedCount,
    }
  } catch (error) {
    logger.error('[PreviewCleanup] Error during cleanup:', { error })
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Job de cleanup des previews non revendiquées après 7 jours
 */
export async function previewOldCleanupJob() {
  try {
    // cleanupOldUnclaimed not yet implemented - using cleanupExpired as fallback
    const deletedCount = await previewAnalysisService.cleanupExpired()
    
    logger.info(`[PreviewCleanup] Deleted ${deletedCount} old unclaimed preview analyses`, { deletedCount })
    
    return {
      success: true,
      deletedCount,
    }
  } catch (error) {
    logger.error('[PreviewCleanup] Error during old cleanup:', { error })
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
