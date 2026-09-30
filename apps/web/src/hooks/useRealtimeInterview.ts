/**
 * useRealtimeInterview
 *
 * Conversation vocale avec l'API Realtime d'OpenAI (version GA) en WebRTC :
 *   1. jeton éphémère et consignes depuis notre serveur (/api/interview/realtime-session) ;
 *   2. offre SDP envoyée à POST /v1/realtime/calls avec ce jeton ;
 *   3. événements sur le canal de données « oai-events » (interprétés par lib/interview/realtime-events).
 *
 * La recruteuse parle la première. La durée choisie pilote la séance : consigne de clôture à T-2 min, puis
 * fin automatique (la page termine l'entretien et génère le rapport). Les répliques finales sont enregistrées
 * (une requête par tour) ; `flushTranscripts` permet d'attendre les dernières avant de clôturer.
 */

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  REALTIME_CALLS_URL,
  REALTIME_FLUSH_TIMEOUT_MS,
  REALTIME_WRAP_UP_SECONDS,
  realtimeTimeline,
} from '@/lib/interview/realtime-config'
import {
  EMPTY_ACCUMULATORS,
  interpretRealtimeEvent,
  mergeTranscript,
  type PartialAccumulators,
  type RealtimeStatus,
  type RealtimeTranscript,
} from '@/lib/interview/realtime-events'
import { WRAP_UP_INSTRUCTIONS, openingResponseInstructions } from '@/lib/interview/realtime-instructions'
import { mandatoryQuestionResponseInstructions } from '@/lib/interview/session-setup'
import {
  REALTIME_DEFAULT_ERROR,
  REALTIME_SDP_ERROR,
  realtimeSessionErrorMessage,
  realtimeMicErrorMessage,
} from '@/lib/interview/realtime-errors'

export type { RealtimeStatus, RealtimeTranscript }

/** Erreur dont le message est déjà lisible par l'utilisateur. */
class RealtimeUserError extends Error {}

export interface UseRealtimeInterviewOptions {
  sessionId: string
  onTranscript?: (transcript: RealtimeTranscript) => void
  onError?: (message: string) => void
  onConnected?: () => void
  onDisconnected?: () => void
  /** Durée choisie atteinte (plus le délai de conclusion) : à la page de terminer l'entretien. */
  onMaxDuration?: () => void
}

export interface UseRealtimeInterviewReturn {
  status: RealtimeStatus
  transcripts: RealtimeTranscript[]
  connect: () => Promise<void>
  disconnect: () => void
  /** Attend l'enregistrement des dernières répliques (à appeler avant simulation/end). */
  flushTranscripts: () => Promise<void>
  /** Message d'erreur lisible pour l'utilisateur, ou null. */
  errorMessage: string | null
  /** Vrai quand il reste moins de deux minutes (bandeau non bloquant). */
  isNearTimeLimit: boolean
  /** Secondes restantes sur la durée choisie ; null avant la connexion. */
  remainingSeconds: number | null
  isMuted: boolean
  toggleMute: () => void
  isConnected: boolean
  isAISpeaking: boolean
  isUserSpeaking: boolean
}

interface SessionPayload {
  client_secret?: string
  first_question?: string
  opening_persisted?: boolean
  resumed?: boolean
  mandatory_question?: string | null
  duration_seconds?: number
}

export function useRealtimeInterview({
  sessionId,
  onTranscript,
  onError,
  onConnected,
  onDisconnected,
  onMaxDuration,
}: UseRealtimeInterviewOptions): UseRealtimeInterviewReturn {
  const [status, setStatus] = useState<RealtimeStatus>('idle')
  const [transcripts, setTranscripts] = useState<RealtimeTranscript[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(false)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const statusRef = useRef<RealtimeStatus>('idle')
  const connectingRef = useRef(false)
  const accRef = useRef<PartialAccumulators>(EMPTY_ACCUMULATORS)

  // Enregistrements de répliques en cours (attendus avant la fin de session)
  const pendingRef = useRef<Set<Promise<unknown>>>(new Set())
  // La question d'ouverture est déjà enregistrée par la création de la séance : sa version parlée n'est pas rajoutée
  const skipOpeningPersistRef = useRef(false)

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onMaxDurationRef = useRef(onMaxDuration)
  onMaxDurationRef.current = onMaxDuration

  const updateStatus = useCallback((next: RealtimeStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const sendEvent = useCallback((event: Record<string, unknown>) => {
    if (dcRef.current?.readyState === 'open') dcRef.current.send(JSON.stringify(event))
  }, [])

  // ── Enregistrement d'un tour finalisé ──────────────────────────────────────
  // Sans cela, aucune trace de l'entretien n'existe en base : le rapport lit interview_messages, jamais l'état React.

  const persistTranscript = useCallback(
    (transcript: RealtimeTranscript) => {
      const body = JSON.stringify({ sessionId, role: transcript.role, content: transcript.text })

      // Une seule nouvelle tentative, et seulement sur erreur réseau ou 5xx.
      const send = async () => {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const res = await fetch('/api/interview/realtime-message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body,
            })
            if (res.ok || res.status < 500) return
          } catch {
            /* réseau : nouvelle tentative */
          }
        }
        console.error('[Realtime] persistance transcript impossible')
      }

      const promise: Promise<void> = send().finally(() => {
        pendingRef.current.delete(promise)
      })
      pendingRef.current.add(promise)
    },
    [sessionId],
  )

  const flushTranscripts = useCallback(async () => {
    const pending = Array.from(pendingRef.current)
    if (pending.length === 0) return
    // Bornée : une requête bloquée ne doit pas empêcher de terminer l'entretien.
    await Promise.race([Promise.allSettled(pending), new Promise(resolve => setTimeout(resolve, REALTIME_FLUSH_TIMEOUT_MS))])
  }, [])

  // ── Événements du canal de données ─────────────────────────────────────────

  const handleRealtimeEvent = useCallback(
    (event: Record<string, unknown>) => {
      const outcome = interpretRealtimeEvent(event, accRef.current)
      accRef.current = outcome.accumulators

      if (outcome.error) {
        const message = 'Le service vocal a signalé une erreur. Réessayez.'
        console.error('[Realtime]', outcome.error)
        setErrorMessage(message)
        onError?.(message)
      }
      if (outcome.status) updateStatus(outcome.status)

      const t = outcome.transcript
      if (!t) return
      setTranscripts(prev => mergeTranscript(prev, t))
      onTranscript?.(t)

      if (t.final) {
        if (t.role === 'assistant' && skipOpeningPersistRef.current) {
          skipOpeningPersistRef.current = false
          return
        }
        persistTranscript(t)
      }
    },
    [onError, onTranscript, persistTranscript, updateStatus],
  )

  // ── Libération des ressources ──────────────────────────────────────────────

  const cleanup = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current)
    tickRef.current = null
    dcRef.current?.close()
    pcRef.current?.close()
    dcRef.current = null
    pcRef.current = null
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (audioRef.current) {
      audioRef.current.srcObject = null
      audioRef.current = null
    }
    accRef.current = EMPTY_ACCUMULATORS
  }, [])

  // ── Chronologie de la séance (durée choisie) ───────────────────────────────

  const startTimeline = useCallback(
    (durationSeconds: number | undefined, mandatoryQuestion?: string | null) => {
      if (tickRef.current) clearInterval(tickRef.current)
      const { wrapUpAtMs, endAtMs } = realtimeTimeline(durationSeconds)
      const plannedMs = Math.min(endAtMs, (durationSeconds && durationSeconds > 0 ? durationSeconds : 15 * 60) * 1000)
      const startedAt = Date.now()
      let wrapUpSent = false
      let mandatorySent = !mandatoryQuestion
      let endSent = false
      setRemainingSeconds(Math.round(plannedMs / 1000))

      tickRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAt
        setRemainingSeconds(Math.max(0, Math.round((plannedMs - elapsed) / 1000)))

        // Question imposée : une seule fois, vers la moitié du temps, quand personne ne parle.
        if (!mandatorySent && !wrapUpSent && elapsed >= plannedMs / 2 && statusRef.current === 'connected') {
          mandatorySent = true
          sendEvent({ type: 'response.create', response: { instructions: mandatoryQuestionResponseInstructions(mandatoryQuestion as string) } })
        }

        // Consigne de clôture : dès que le candidat ne parle pas (sinon à la prochaine seconde).
        if (!wrapUpSent && elapsed >= wrapUpAtMs && statusRef.current !== 'speaking_user') {
          wrapUpSent = true
          sendEvent({ type: 'response.create', response: { instructions: WRAP_UP_INSTRUCTIONS } })
        }
        if (!endSent && elapsed >= endAtMs) {
          endSent = true
          onMaxDurationRef.current?.()
        }
      }, 1000)
    },
    [sendEvent],
  )

  // ── Connexion ──────────────────────────────────────────────────────────────

  const connect = useCallback(async () => {
    if (connectingRef.current || ['connected', 'speaking_user', 'speaking_ai'].includes(statusRef.current)) return
    connectingRef.current = true
    cleanup()
    updateStatus('connecting')
    setErrorMessage(null)

    try {
      // 1. Jeton éphémère et consignes depuis notre serveur
      const tokenRes = await fetch('/api/interview/realtime-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: sessionId }),
      })
      if (!tokenRes.ok) throw new RealtimeUserError(realtimeSessionErrorMessage(tokenRes.status))
      const session = (await tokenRes.json()) as SessionPayload
      if (!session.client_secret) throw new RealtimeUserError(REALTIME_DEFAULT_ERROR)

      skipOpeningPersistRef.current = Boolean(session.opening_persisted)

      // 2. Micro
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      streamRef.current = stream

      // 3. Connexion WebRTC
      const pc = new RTCPeerConnection()
      pcRef.current = pc

      pc.ontrack = e => {
        if (!audioRef.current) {
          audioRef.current = new Audio()
          audioRef.current.autoplay = true
        }
        audioRef.current.srcObject = e.streams[0] ?? null
      }

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed') {
          setErrorMessage("La connexion a été interrompue. Reprenez l'entretien : il repartira là où vous en étiez.")
          updateStatus('error')
        }
      }

      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc

      dc.addEventListener('open', () => {
        updateStatus('connected')
        onConnected?.()
        // La recruteuse parle la première (ou reprend après une coupure) ; le modèle n'initie jamais seul.
        sendEvent({
          type: 'response.create',
          response: { instructions: openingResponseInstructions(session.first_question ?? '', Boolean(session.resumed)) },
        })
        startTimeline(session.duration_seconds, session.mandatory_question)
      })

      dc.addEventListener('message', e => {
        try {
          handleRealtimeEvent(JSON.parse(e.data as string))
        } catch {
          console.warn('[Realtime] Message non parsable')
        }
      })

      dc.addEventListener('close', () => {
        if (tickRef.current) clearInterval(tickRef.current)
        tickRef.current = null
        if (statusRef.current !== 'error') updateStatus('disconnected')
        onDisconnected?.()
      })

      // 4. Offre SDP → OpenAI (le modèle et la configuration sont portés par le jeton)
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      const sdpRes = await fetch(REALTIME_CALLS_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.client_secret}`, 'Content-Type': 'application/sdp' },
        body: offer.sdp,
      })
      if (!sdpRes.ok) throw new RealtimeUserError(REALTIME_SDP_ERROR)

      await pc.setRemoteDescription({ type: 'answer', sdp: await sdpRes.text() })
    } catch (err: unknown) {
      console.error('[Realtime] connect error:', err)
      const message = err instanceof RealtimeUserError ? err.message : (realtimeMicErrorMessage(err) ?? REALTIME_DEFAULT_ERROR)
      // Rien ne doit rester ouvert après un échec (micro allumé, connexion à moitié établie).
      cleanup()
      setErrorMessage(message)
      onError?.(message)
      updateStatus('error')
    } finally {
      connectingRef.current = false
    }
  }, [cleanup, handleRealtimeEvent, onConnected, onDisconnected, onError, sendEvent, sessionId, startTimeline, updateStatus])

  // ── Déconnexion ────────────────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    cleanup()
    setIsMuted(false)
    updateStatus('disconnected')
    onDisconnected?.()
  }, [cleanup, onDisconnected, updateStatus])

  const toggleMute = useCallback(() => {
    const tracks = streamRef.current?.getAudioTracks() ?? []
    if (tracks.length === 0) return
    const nextMuted = tracks[0].enabled // activé → on coupe
    tracks.forEach(track => {
      track.enabled = !nextMuted
    })
    setIsMuted(nextMuted)
  }, [])

  // ── Nettoyage au démontage ─────────────────────────────────────────────────

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  return {
    status,
    transcripts,
    connect,
    disconnect,
    flushTranscripts,
    errorMessage,
    isNearTimeLimit: remainingSeconds !== null && remainingSeconds <= REALTIME_WRAP_UP_SECONDS && status !== 'disconnected',
    remainingSeconds,
    isMuted,
    toggleMute,
    isConnected: status === 'connected' || status === 'speaking_user' || status === 'speaking_ai',
    isAISpeaking: status === 'speaking_ai',
    isUserSpeaking: status === 'speaking_user',
  }
}
