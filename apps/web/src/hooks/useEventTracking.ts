// apps/web/src/hooks/useEventTracking.ts
//
// Hook React pour le tracking d'événements
// Facilite l'enregistrement d'événements côté client

'use client'

import { callbackify } from 'util'
import { EventType, EventPayload } from '@/types/events'

/**
 * Hook React pour le tracking d'événements
 * Facilite l'enregistrement d'événements côté client
 */
export function useEventTracking() {
  /**
   * Enregistre un événement
   * 
   * @param payload - Payload de l'événement
   */
  const trackEvent = async (payload: EventPayload) => {
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error('Failed to track event:', await response.text())
      }
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }

  /**
   * Enregistre un événement signup
   */
  const trackSignup = async (email: string, referralCode?: string) => {
    await trackEvent({
      type: EventType.SIGNUP,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      email,
      referralCode,
    })
  }

  /**
   * Enregistre un événement login
   */
  const trackLogin = async (method?: 'email' | 'google' | 'github') => {
    await trackEvent({
      type: EventType.LOGIN,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      method,
    })
  }

  /**
   * Enregistre un événement email confirmed
   */
  const trackEmailConfirmed = async () => {
    await trackEvent({
      type: EventType.EMAIL_CONFIRMED,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
    })
  }

  /**
   * Enregistre un événement first CV upload
   */
  const trackFirstCVUpload = async (fileName: string, fileSize: number, fileType: string) => {
    await trackEvent({
      type: EventType.FIRST_CV_UPLOAD,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      fileName,
      fileSize,
      fileType,
    })
  }

  /**
   * Enregistre un événement first job upload
   */
  const trackFirstJobUpload = async (fileName: string, fileSize: number, fileType: string) => {
    await trackEvent({
      type: EventType.FIRST_JOB_UPLOAD,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      fileName,
      fileSize,
      fileType,
    })
  }

  /**
   * Enregistre un événement first matching
   */
  const trackFirstMatching = async (score: number, jobTitle?: string) => {
    await trackEvent({
      type: EventType.FIRST_MATCHING,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      score,
      jobTitle,
    })
  }

  /**
   * Enregistre un événement first copilot
   */
  const trackFirstCopilot = async (query: string, persona?: string) => {
    await trackEvent({
      type: EventType.FIRST_COPILOT,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      query,
      persona,
    })
  }

  /**
   * Enregistre un événement first search
   */
  const trackFirstSearch = async (query: string, resultsCount: number) => {
    await trackEvent({
      type: EventType.FIRST_SEARCH,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      query,
      resultsCount,
    })
  }

  /**
   * Enregistre un événement premium clicked
   */
  const trackPremiumClicked = async (source: 'modal' | 'dashboard' | 'pricing_page' | 'cta', feature?: string) => {
    await trackEvent({
      type: EventType.PREMIUM_CLICKED,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      source,
      feature,
    })
  }

  /**
   * Enregistre un événement upgrade started
   */
  const trackUpgradeStarted = async (plan: string, source: string) => {
    await trackEvent({
      type: EventType.UPGRADE_STARTED,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      plan,
      source,
    })
  }

  /**
   * Enregistre un événement upgrade completed
   */
  const trackUpgradeCompleted = async (plan: string, amount: number, currency: string) => {
    await trackEvent({
      type: EventType.UPGRADE_COMPLETED,
      userId: '', // Sera remplacé par le serveur
      timestamp: new Date(),
      plan,
      amount,
      currency,
    })
  }

  return {
    trackEvent,
    trackSignup,
    trackLogin,
    trackEmailConfirmed,
    trackFirstCVUpload,
    trackFirstJobUpload,
    trackFirstMatching,
    trackFirstCopilot,
    trackFirstSearch,
    trackPremiumClicked,
    trackUpgradeStarted,
    trackUpgradeCompleted,
  }
}
