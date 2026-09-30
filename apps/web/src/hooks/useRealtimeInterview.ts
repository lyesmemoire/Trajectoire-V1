/**
 * useRealtimeInterview
 *
 * WebRTC full-duplex avec OpenAI Realtime API.
 * Audio in (micro) → OpenAI → Audio out (speakers) en temps réel.
 * Transcriptions disponibles en parallèle via DataChannel.
 */

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  REALTIME_MODEL,
  REALTIME_MAX_DURATION_MS,
  REALTIME_WARNING_MS,
  REALTIME_FLUSH_TIMEOUT_MS,
} from '@/lib/interview/realtime-config'
import {
  REALTIME_DEFAULT_ERROR,
  REALTIME_SDP_ERROR,
  realtimeSessionErrorMessage,
  realtimeMicErrorMessage,
} from '@/lib/interview/realtime-errors'

/** Erreur dont le message est déjà lisible par l'utilisateur. */
class RealtimeUserError extends Error {}

// ── Types ────────────────────────────────────────────────────────────────────

export type RealtimeStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'speaking_user'
  | 'speaking_ai'
  | 'disconnected'
  | 'error'

export interface RealtimeTranscript {
  role: 'user' | 'assistant'
  text: string
  final: boolean
}

export interface UseRealtimeInterviewOptions {
  sessionId: string                                    // notre session HIIOS
  onTranscript?: (transcript: RealtimeTranscript) => void
  onError?: (message: string) => void
  onConnected?: () => void
  onDisconnected?: () => void
  /** Durée maximale atteinte : à la page de terminer l'entretien (rapport compris). */
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
  /** Vrai à l'approche de la durée maximale (bandeau non bloquant). */
  isNearTimeLimit: boolean
  isConnected: boolean
  isAISpeaking: boolean
  isUserSpeaking: boolean
}

// ── Hook ─────────────────────────────────────────────────────────────────────

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
  const [isNearTimeLimit, setIsNearTimeLimit] = useState(false)

  const pcRef   = useRef<RTCPeerConnection | null>(null)
  const dcRef   = useRef<RTCDataChannel | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Enregistrements de répliques en cours (attendus avant la fin de session)
  const pendingRef = useRef<Set<Promise<unknown>>>(new Set())
  // Question d'ouverture renvoyée par la route : amorce le premier tour d'Alexandra
  const firstQuestionRef = useRef<string | null>(null)
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onMaxDurationRef = useRef(onMaxDuration)
  onMaxDurationRef.current = onMaxDuration

  // Accumulateurs de transcription partielle
  const userPartialRef = useRef('')
  const aiPartialRef   = useRef('')

  // ── Envoi d'événement via DataChannel ──────────────────────────────────────

  const sendEvent = useCallback((event: Record<string, unknown>) => {
    if (dcRef.current?.readyState === 'open') {
      dcRef.current.send(JSON.stringify(event))
    }
  }, [])

  // ── Persistance d'un tour finalisé ─────────────────────────────────────────
  // Sans ça, aucune trace de l'entretien Realtime n'existe en base : le rapport
  // (ReportService.generateReport) lit interview_messages, jamais le state React.

  const persistTranscript = useCallback((transcript: RealtimeTranscript) => {
    const body = JSON.stringify({
      sessionId: sessionId,
      role     : transcript.role,
      content  : transcript.text,
    })

    // Une seule nouvelle tentative, et seulement sur erreur réseau ou 5xx.
    const send = async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch('/api/interview/realtime-message', {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          })
          if (res.ok || res.status < 500) return
        } catch { /* réseau : nouvelle tentative */ }
      }
      console.error('[Realtime] persistance transcript impossible')
    }

    const promise: Promise<void> = send().finally(() => { pendingRef.current.delete(promise) })
    pendingRef.current.add(promise)
  }, [sessionId])

  const flushTranscripts = useCallback(async () => {
    const pending = Array.from(pendingRef.current)
    if (pending.length === 0) return
    // Bornée : une requête bloquée ne doit pas empêcher de terminer l'entretien.
    await Promise.race([
      Promise.allSettled(pending),
      new Promise(resolve => setTimeout(resolve, REALTIME_FLUSH_TIMEOUT_MS)),
    ])
  }, [])

  // ── Libération des ressources (micro, minuteurs) ────────────────────────────

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (maxTimerRef.current) clearTimeout(maxTimerRef.current)
    warningTimerRef.current = null
    maxTimerRef.current = null
  }, [])

  const releaseMicrophone = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
  }, [])

  // ── Gestion des événements OpenAI Realtime ──────────────────────────────────

  const handleRealtimeEvent = useCallback((event: Record<string, unknown>) => {
    const type = event.type as string

    switch (type) {

      // ── Audio de l'IA ──────────────────────────────────────────────────────
      case 'response.audio.started':
      case 'output_audio_buffer.started':
        setStatus('speaking_ai')
        break

      case 'response.audio.done':
      case 'output_audio_buffer.stopped':
        setStatus('connected')
        break

      // ── Détection parole utilisateur ───────────────────────────────────────
      case 'input_audio_buffer.speech_started':
        setStatus('speaking_user')
        userPartialRef.current = ''
        break

      case 'input_audio_buffer.speech_stopped':
        setStatus('connected')
        break

      // ── Transcription utilisateur (partielle) ──────────────────────────────
      case 'conversation.item.input_audio_transcription.delta': {
        const delta = (event.delta as string) ?? ''
        userPartialRef.current += delta
        const partial: RealtimeTranscript = {
          role : 'user',
          text : userPartialRef.current,
          final: false,
        }
        setTranscripts(prev => {
          const last = prev[prev.length - 1]
          if (last && last.role === 'user' && !last.final) {
            return [...prev.slice(0, -1), partial]
          }
          return [...prev, partial]
        })
        onTranscript?.(partial)
        break
      }

      // ── Transcription utilisateur (finale) ────────────────────────────────
      case 'conversation.item.input_audio_transcription.completed': {
        const text = (event.transcript as string) ?? userPartialRef.current
        userPartialRef.current = ''
        const final: RealtimeTranscript = { role: 'user', text, final: true }
        setTranscripts(prev => {
          const last = prev[prev.length - 1]
          if (last && last.role === 'user' && !last.final) {
            return [...prev.slice(0, -1), final]
          }
          return [...prev, final]
        })
        onTranscript?.(final)
        persistTranscript(final)
        break
      }

      // ── Transcription IA (partielle) ───────────────────────────────────────
      case 'response.audio_transcript.delta': {
        const delta = (event.delta as string) ?? ''
        aiPartialRef.current += delta
        const partial: RealtimeTranscript = {
          role : 'assistant',
          text : aiPartialRef.current,
          final: false,
        }
        setTranscripts(prev => {
          const last = prev[prev.length - 1]
          if (last && last.role === 'assistant' && !last.final) {
            return [...prev.slice(0, -1), partial]
          }
          return [...prev, partial]
        })
        onTranscript?.(partial)
        break
      }

      // ── Transcription IA (finale) ──────────────────────────────────────────
      case 'response.audio_transcript.done': {
        const text = (event.transcript as string) ?? aiPartialRef.current
        aiPartialRef.current = ''
        const final: RealtimeTranscript = { role: 'assistant', text, final: true }
        setTranscripts(prev => {
          const last = prev[prev.length - 1]
          if (last && last.role === 'assistant' && !last.final) {
            return [...prev.slice(0, -1), final]
          }
          return [...prev, final]
        })
        onTranscript?.(final)
        persistTranscript(final)
        break
      }

      // ── Erreurs ────────────────────────────────────────────────────────────
      case 'error': {
        const errMsg = (event.error as { message?: string })?.message ?? 'Erreur Realtime'
        console.error('[Realtime]', errMsg)
        const message = 'Le service vocal a signalé une erreur. Réessayez.'
        setErrorMessage(message)
        onError?.(message)
        setStatus('error')
        break
      }
    }
  }, [onTranscript, onError, persistTranscript])

  // ── Connexion WebRTC ────────────────────────────────────────────────────────

  const connect = useCallback(async () => {
    if (status === 'connecting' || status === 'connected') return
    setStatus('connecting')
    setErrorMessage(null)

    try {
      // 1. Token éphémère depuis notre serveur
      const tokenRes = await fetch('/api/interview/realtime-session', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ candidateId: sessionId }),
      })

      if (!tokenRes.ok) throw new RealtimeUserError(realtimeSessionErrorMessage(tokenRes.status))
      const { client_secret, first_question } = await tokenRes.json()
      firstQuestionRef.current = typeof first_question === 'string' ? first_question : null

      // 2. Micro utilisateur
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // 3. PeerConnection
      const pc = new RTCPeerConnection()
      pcRef.current = pc

      // Audio sortant de l'IA → <audio>
      pc.ontrack = (e) => {
        if (!audioRef.current) {
          audioRef.current = new Audio()
          audioRef.current.autoplay = true
        }
        audioRef.current.srcObject = e.streams[0] ?? null
      }

      // Micro → OpenAI
      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      // DataChannel pour les événements
      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc

      dc.addEventListener('open', () => {
        setStatus('connected')
        onConnected?.()

        // Configurer la session côté OpenAI
        sendEvent({
          type: 'session.update',
          session: {
            modalities  : ['audio', 'text'],
            turn_detection: {
              type                : 'server_vad',
              silence_duration_ms : 800,
              threshold           : 0.5,
            },
          },
        })

        // Alexandra ouvre l'entretien : sans response.create, le modèle attend que le
        // candidat parle en premier (server_vad ne déclenche aucune réponse seul).
        const opening = firstQuestionRef.current
        sendEvent({
          type: 'response.create',
          response: opening
            ? {
                instructions:
                  "Ouvre l'entretien maintenant : pose exactement cette première question, " +
                  'sans te présenter longuement : « ' + opening + ' »',
              }
            : {},
        })

        // Durée maximale : avertissement puis fin automatique (déclenchée par la page).
        clearTimers()
        warningTimerRef.current = setTimeout(() => setIsNearTimeLimit(true), REALTIME_WARNING_MS)
        maxTimerRef.current = setTimeout(() => onMaxDurationRef.current?.(), REALTIME_MAX_DURATION_MS)
      })

      dc.addEventListener('message', (e) => {
        try {
          const event = JSON.parse(e.data as string)
          handleRealtimeEvent(event)
        } catch {
          console.warn('[Realtime] Message non parsable', e.data)
        }
      })

      dc.addEventListener('close', () => {
        setStatus('disconnected')
        onDisconnected?.()
      })

      // 4. Offer SDP
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      // 5. Envoi à OpenAI Realtime
      const sdpRes = await fetch(
        'https://api.openai.com/v1/realtime?model=' + REALTIME_MODEL,
        {
          method : 'POST',
          headers: {
            Authorization  : `Bearer ${client_secret}`,
            'Content-Type' : 'application/sdp',
          },
          body: offer.sdp,
        },
      )

      if (!sdpRes.ok) throw new RealtimeUserError(REALTIME_SDP_ERROR)

      const answerSdp = await sdpRes.text()
      await pc.setRemoteDescription({
        type: 'answer',
        sdp : answerSdp,
      })

    } catch (err: unknown) {
      console.error('[Realtime] connect error:', err)
      const message =
        err instanceof RealtimeUserError
          ? err.message
          : realtimeMicErrorMessage(err) ?? REALTIME_DEFAULT_ERROR
      // Rien ne doit rester ouvert après un échec (micro allumé, connexion à moitié établie).
      dcRef.current?.close()
      pcRef.current?.close()
      dcRef.current = null
      pcRef.current = null
      releaseMicrophone()
      clearTimers()
      setErrorMessage(message)
      onError?.(message)
      setStatus('error')
    }
  }, [status, sessionId, sendEvent, handleRealtimeEvent, onConnected, onDisconnected, onError, clearTimers, releaseMicrophone])

  // ── Déconnexion ─────────────────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    dcRef.current?.close()
    pcRef.current?.close()
    dcRef.current = null
    pcRef.current = null
    releaseMicrophone()
    clearTimers()
    setIsNearTimeLimit(false)

    if (audioRef.current) {
      audioRef.current.srcObject = null
      audioRef.current = null
    }

    setStatus('disconnected')
    onDisconnected?.()
  }, [onDisconnected, releaseMicrophone, clearTimers])

  // ── Cleanup au unmount ──────────────────────────────────────────────────────

  useEffect(() => {
    return () => { disconnect() }
  }, [disconnect])

  // ── Retour ──────────────────────────────────────────────────────────────────

  return {
    status,
    transcripts,
    connect,
    disconnect,
    flushTranscripts,
    errorMessage,
    isNearTimeLimit,
    isConnected   : status === 'connected' || status === 'speaking_user' || status === 'speaking_ai',
    isAISpeaking  : status === 'speaking_ai',
    isUserSpeaking: status === 'speaking_user',
  }
}
