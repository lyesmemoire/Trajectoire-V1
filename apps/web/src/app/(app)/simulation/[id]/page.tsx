'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Mic, Check, RotateCcw, PhoneOff, Loader2, AlertCircle, Volume2, Clock } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/modal'
import { WrittenAnswer } from '@/components/simulation/WrittenAnswer'
import { useRealtimeInterview, type RealtimeTranscript } from '@/hooks/useRealtimeInterview'
import {
  SIMULATION_REASSURANCE,
  SIMULATION_UI_COPY,
  deriveSimulationUiState,
  friendlyVoiceError,
  isWrittenFallbackVisible,
  shouldAutoMute,
  type SimulationUiState,
} from '@/lib/interview/simulation-ui-state'

function SoundWave({ active, color = 'bg-calm-accent' }: { active: boolean; color?: string }) {
  const heights = [3, 6, 10, 7, 14, 9, 12, 6, 10, 4]
  return (
    <div className="flex items-end gap-[3px]" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-[3px] rounded-full `+color+` transition-all`}
          style={{
            height            : active ? h * 2.5 + 'px' : '3px',
            transitionDuration: (120 + i * 20) + 'ms',
            transitionDelay   : active ? (i * 30) + 'ms' : '0ms',
          }}
        />
      ))}
    </div>
  )
}

function TranscriptBubble({ transcript }: { transcript: RealtimeTranscript }) {
  const isAI = transcript.role === 'assistant'
  return (
    <div className={`flex gap-3 `+(isAI ? 'justify-start' : 'justify-end')}>
      {isAI && (
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-calm-accent-soft text-xs font-bold text-calm-secondary">
          A
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed `+(isAI ? 'bg-calm-accent-soft text-calm-ink' : 'bg-calm-accent-soft text-calm-ink')+` `+(!transcript.final ? 'opacity-50' : 'opacity-100')}
      >
        {transcript.text}
        {!transcript.final && (
          <span className="ml-1 animate-pulse text-calm-secondary">…</span>
        )}
      </div>
      {!isAI && (
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-calm-accent-soft text-xs font-bold text-calm-accent">
          V
        </div>
      )}
    </div>
  )
}

export default function SimulationPage() {
  const params    = useParams()
  const router    = useRouter()
  const sessionId = (params?.id as string) ?? 'anonymous'
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isEnding, setIsEnding] = useState(false)
  const handleEndRef = useRef<() => Promise<void>>(async () => {})

  const {
    status,
    transcripts,
    connect,
    disconnect,
    flushTranscripts,
    errorMessage,
    isNearTimeLimit,
    remainingSeconds,
    isMuted,
    toggleMute,
    isAISpeaking,
    isUserSpeaking,
  } = useRealtimeInterview({
    sessionId,
    onError       : (msg) => console.error('[Simulation]', msg),
    onConnected   : () => console.info('[Simulation] connecte'),
    onDisconnected: () => console.info('[Simulation] deconnecte'),
    // Durée maximale atteinte : on termine l'entretien comme si le candidat avait cliqué.
    onMaxDuration : () => { void handleEndRef.current() },
  })

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [transcripts])

  useEffect(() => { connect() }, []) // eslint-disable-line

  // Fin de séance : un premier clic demande confirmation (le quota est déjà consommé et le rapport généré
  // sur ce qui a été dit), un second confirme. La fin automatique (durée atteinte) passe directement.
  const [confirmEnd, setConfirmEnd] = useState(false)
  const lastTranscript = transcripts.length > 0 ? transcripts[transcripts.length - 1] : null
  const uiState = deriveSimulationUiState({ status, isMuted, isEnding, lastTranscript })
  const copy = SIMULATION_UI_COPY[uiState]

  // À la fin de la question, le micro est coupé : la candidate prend le temps de réfléchir, puis appuie sur « Répondre ».
  const previousUiState = useRef<SimulationUiState>(uiState)
  useEffect(() => {
    if (shouldAutoMute(previousUiState.current, uiState, isMuted)) toggleMute()
    previousUiState.current = uiState
  }, [uiState, isMuted, toggleMute])
  const clock = remainingSeconds === null
    ? null
    : String(Math.floor(remainingSeconds / 60)).padStart(2, '0') + ':' + String(remainingSeconds % 60).padStart(2, '0')

  async function handleEnd() {
    if (isEnding) return
    setConfirmEnd(false)
    setIsEnding(true)
    disconnect()

    // Les dernières répliques (dont celle d'Alexandra) s'enregistrent en arrière-plan :
    // on les attend, sinon le rapport est généré sans elles.
    await flushTranscripts()

    try {
      // /api/simulation/end bascule le statut de la session, puis appelle
      // lui-même /api/report/generate en interne : pas d'appel séparé requis.
      // La réponse est un redirect HTTP (jamais du JSON) vers /report/<id>
      // en cas de succès, ou /dashboard si la génération du rapport a échoué.
      const formData = new FormData()
      formData.append('sessionId', sessionId)

      const res = await fetch('/api/simulation/end', {
        method: 'POST',
        body  : formData,
      })

      if (res.redirected) {
        router.push(new URL(res.url).pathname)
        return
      }
    } catch { /* réseau indisponible : redirection de repli ci-dessous */ }

    router.push('/report/' + sessionId)
  }
  handleEndRef.current = handleEnd

  const dotByState: Record<SimulationUiState, string> = {
    connecting        : 'bg-calm-secondary animate-pulse',
    recruiter_speaking: 'bg-calm-accent-deep animate-pulse',
    ready             : 'bg-calm-accent',
    listening         : 'bg-calm-accent animate-pulse',
    processing        : 'bg-calm-secondary animate-pulse',
    error             : 'bg-calm-secondary',
  }
  const statusLabel = copy.subtitle
  const statusDot = dotByState[uiState]

  // Action du bouton du micro, selon l'état (libellés dans lib/interview/simulation-ui-state.ts).
  const onMicClick = () => {
    if (copy.mic.action === 'retry') void connect()
    else if (copy.mic.action === 'mute' || copy.mic.action === 'unmute') toggleMute()
  }
  const MicIcon = copy.mic.action === 'retry' ? RotateCcw
    : copy.mic.action === 'mute' ? Check
    : copy.mic.action === 'none' && uiState !== 'recruiter_speaking' ? Loader2
    : Mic
  const voiceError = friendlyVoiceError(errorMessage)
  const lastAssistantText = [...transcripts].reverse().find((t) => t.role === 'assistant')?.text ?? null

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-calm-bg text-calm-ink md:h-full md:min-h-0">

      <header className="flex shrink-0 items-center justify-between border-b border-calm-line px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-calm-secondary">Trajectoire</span>
          <span className="text-calm-tertiary">·</span>
          <span className="text-xs text-calm-secondary">Simulation d&apos;entretien</span>
        </div>
        <div className="flex items-center gap-3">
          {clock && (
            <span
              className="flex items-center gap-1.5 rounded-full border border-calm-line bg-calm-accent-wash px-3 py-1.5 font-mono text-xs font-medium tabular-nums text-calm-ink"
              title="Temps restant sur la durée choisie"
            >
              <Clock className="size-3.5" aria-hidden />
              <span className="sr-only">Temps restant : </span>
              {clock}
            </span>
          )}
          <div role="status" className="flex items-center gap-2 rounded-full border border-calm-line bg-calm-accent-wash px-3 py-1.5 text-xs font-medium text-calm-secondary">
            <span className={`size-1.5 rounded-full `+statusDot} aria-hidden />
            {statusLabel}
          </div>
        </div>
      </header>

      {isNearTimeLimit && !isEnding && (
        <div
          role="status"
          className="flex shrink-0 items-center justify-center gap-2 border-b border-calm-accent-line bg-calm-accent-wash px-6 py-2 text-sm text-calm-ink"
        >
          <Clock className="size-3.5" aria-hidden />
          Il reste moins de deux minutes : Alexandra va conclure l&apos;entretien, qui se terminera ensuite automatiquement.
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">

        <div className="relative h-64 w-full shrink-0 overflow-hidden bg-calm-surface md:h-auto md:w-[52%]">
          <img
            src="/interviewer.png"
            alt="Alexandra"
            className={`absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-out `+(isAISpeaking ? 'scale-[1.02]' : 'scale-100')}
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-calm-bg/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-calm-bg via-calm-bg/70 to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-calm-accent-line bg-calm-bg/70 px-3 py-1.5 text-xs font-medium text-calm-ink backdrop-blur-md">
            <span className={`size-1.5 rounded-full `+(isAISpeaking ? 'animate-pulse bg-calm-surface' : 'bg-calm-accent')} />
            Alexandra · IA
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-6 py-8">
            {isAISpeaking ? (
              <>
                <div className="flex items-center gap-2 text-xs font-medium text-calm-secondary">
                  <Volume2 className="size-3" />
                  Alexandra parle
                </div>
                <SoundWave active color="bg-calm-accent" />
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-calm-secondary">
                <Mic className="size-3" />
                {copy.subtitle}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-[26rem] flex-1 flex-col border-t border-calm-line bg-calm-bg md:min-h-0 md:border-l md:border-t-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
            {transcripts.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                {status === 'connecting' ? (
                  <>
                    <Loader2 className="size-7 animate-spin text-calm-secondary" />
                    <p className="text-sm text-calm-secondary">Connexion à l&apos;entretien…</p>
                    <p className="text-xs text-calm-secondary">Autorisez le microphone si le navigateur le demande</p>
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle className="size-7 text-calm-secondary" />
                    <p className="max-w-xs text-sm text-calm-secondary">
                      {voiceError}
                    </p>
                    <button
                      onClick={connect}
                      className="tap-target rounded-xl bg-calm-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-calm-accent-deep"
                    >
                      Réessayer
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex size-14 items-center justify-center rounded-full border border-calm-line bg-calm-accent-wash">
                      <Mic className="size-5 text-calm-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-calm-secondary">L&apos;entretien va commencer</p>
                      <p className="mt-1 text-xs text-calm-secondary">Alexandra va poser la première question</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-5" role="log" aria-live="polite" aria-label="Transcription de l'entretien">
                {transcripts.map((t, i) => (
                  <TranscriptBubble key={i} transcript={t} />
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-calm-line bg-calm-surface px-6 py-6">
            <div className="flex flex-col items-center gap-4">
              <div className="min-h-[52px] text-center" aria-live="polite">
                {copy.title && <p className="text-sm font-semibold text-calm-ink">{copy.title}</p>}
                <p className="text-sm text-calm-secondary">{copy.subtitle}</p>
              </div>

              {uiState === 'error' && (
                <p role="alert" className="max-w-sm text-center text-sm text-calm-ink">{voiceError}</p>
              )}

              <button
                type="button"
                onClick={onMicClick}
                disabled={copy.mic.disabled}
                className="flex min-h-[72px] w-full max-w-sm items-center justify-center gap-3 rounded-full bg-calm-accent px-8 text-lg font-semibold text-white shadow-calm transition-colors hover:bg-calm-accent-deep disabled:opacity-50"
              >
                <MicIcon className={`size-6 ${copy.mic.disabled && uiState !== 'recruiter_speaking' ? 'animate-spin' : ''}`} aria-hidden />
                {copy.mic.label}
              </button>

              <SoundWave active={uiState === 'listening' && isUserSpeaking} color="bg-calm-accent" />

              {/* Repli écrit : voix indisponible (micro refusé ou absent, connexion ou jeton en échec). */}
              {isWrittenFallbackVisible(uiState) && !isEnding && (
                <WrittenAnswer
                  sessionId={sessionId}
                  knownQuestion={lastAssistantText}
                  onEnded={() => { void handleEndRef.current() }}
                />
              )}

              <p className="text-center text-sm text-calm-secondary">
                {SIMULATION_REASSURANCE}
              </p>

              <button
                type="button"
                onClick={() => setConfirmEnd(true)}
                disabled={isEnding}
                className="tap-target inline-flex items-center gap-2 rounded-xl px-3 text-sm text-calm-secondary underline underline-offset-4 transition-colors hover:text-calm-ink disabled:opacity-40"
              >
                {isEnding ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <PhoneOff className="size-4" aria-hidden />}
                {isEnding ? 'Finalisation…' : 'Terminer l’entretien'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmEnd}
        onClose={() => { if (!isEnding) setConfirmEnd(false) }}
        onConfirm={() => { void handleEnd() }}
        title="Terminer l’entretien ?"
        message="Le rapport sera généré à partir de ce qui a été dit. La simulation prendra fin : vous ne pourrez plus y répondre."
        confirmText="Oui, terminer"
        cancelText="Continuer"
        variant="info"
        isLoading={isEnding}
      />    </div>
  )
}