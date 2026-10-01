'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Mic, MicOff, PhoneOff, Loader2, AlertCircle, Volume2, Clock } from 'lucide-react'
import { useRealtimeInterview, type RealtimeTranscript } from '@/hooks/useRealtimeInterview'

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
  const canResume = !isEnding && (status === 'error' || status === 'disconnected') && transcripts.length > 0
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

  const statusConfig: Record<string, { label: string; dot: string }> = {
    idle         : { label: 'Initialisation…',   dot: 'bg-calm-line-soft' },
    connecting   : { label: 'Connexion…',         dot: 'bg-calm-warn animate-pulse' },
    connected    : { label: 'En ligne',           dot: 'bg-calm-accent' },
    speaking_user: { label: 'Vous parlez…',       dot: 'bg-calm-accent animate-pulse' },
    speaking_ai  : { label: 'Alexandra parle…',   dot: 'bg-calm-surface animate-pulse' },
    disconnected : { label: 'Déconnecté',         dot: 'bg-calm-line' },
    error        : { label: 'Erreur',             dot: 'bg-calm-warn' },
  }
  const { label: statusLabel, dot: statusDot } = statusConfig[status] ?? statusConfig.idle

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
              <span className="sr-only">Temps restant : </span>
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
          className="flex shrink-0 items-center justify-center gap-2 border-b border-calm-warn-line bg-calm-warn-soft px-6 py-2 text-xs text-calm-warn"
        >
          <Clock className="size-3.5" aria-hidden />
          Il reste moins de deux minutes : Alexandra va conclure l&apos;entretien, qui se terminera ensuite automatiquement.
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
                  En train de parler
                </div>
                <SoundWave active color="bg-calm-accent" />
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-calm-secondary">
                <Mic className="size-3" />
                En écoute
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
                    <AlertCircle className="size-7 text-calm-warn" />
                    <p className="max-w-xs text-sm text-calm-secondary">
                      {errorMessage ?? 'Erreur de connexion'}
                    </p>
                    <button
                      onClick={connect}
                      className="rounded-lg bg-calm-accent-soft px-4 py-2 text-xs font-semibold text-calm-secondary transition hover:bg-calm-accent-soft"
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

          <div className="shrink-0 border-t border-calm-line bg-calm-surface/60 px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={`flex size-9 items-center justify-center rounded-full border transition-all duration-300 `+(isUserSpeaking ? 'border-calm-accent-line bg-calm-accent-soft text-calm-accent' : 'border-calm-line bg-calm-accent-wash text-calm-secondary')}>
                  {isUserSpeaking ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                </div>
                <div>
                  <p className="text-xs font-medium text-calm-secondary">{isMuted ? 'Micro coupé' : isUserSpeaking ? 'Vous parlez' : 'En écoute'}</p>
                  <p className="text-xs text-calm-secondary">Détection automatique</p>
                </div>
                <SoundWave active={isUserSpeaking && !isMuted} color="bg-calm-accent" />
              </div>
              <div className="flex items-center gap-2">
                {canResume && (
                  <button
                    type="button"
                    onClick={connect}
                    className="rounded-xl bg-calm-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-accent"
                  >
                    Reprendre l&apos;entretien
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-pressed={isMuted}
                  disabled={isEnding || status === 'idle' || status === 'connecting' || status === 'error' || status === 'disconnected'}
                  className="flex items-center gap-2 rounded-xl border border-calm-line bg-calm-accent-wash px-4 py-2.5 text-sm font-medium text-calm-secondary transition hover:bg-calm-accent-soft disabled:opacity-40 aria-pressed:border-calm-warn-line aria-pressed:text-calm-warn"
                >
                  {isMuted ? <MicOff className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
                  {isMuted ? 'Réactiver le micro' : 'Couper le micro'}
                </button>
                {confirmEnd && !isEnding ? (
                  <>
                    <button
                      type="button"
                      onClick={handleEnd}
                      className="flex items-center gap-2 rounded-xl border border-calm-warn-line bg-calm-warn-soft px-4 py-2.5 text-sm font-semibold text-calm-warn transition hover:bg-calm-warn-soft"
                    >
                      <PhoneOff className="size-4" aria-hidden />
                      Confirmer la fin
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmEnd(false)}
                      className="rounded-xl border border-calm-line bg-calm-accent-wash px-4 py-2.5 text-sm font-medium text-calm-secondary transition hover:bg-calm-accent-soft"
                    >
                      Continuer
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmEnd(true)}
                    disabled={isEnding}
                    className="group flex items-center gap-2 rounded-xl border border-calm-line bg-calm-accent-wash px-5 py-2.5 text-sm font-medium text-calm-secondary transition-all duration-200 hover:border-calm-warn-line hover:bg-calm-warn-soft hover:text-calm-warn disabled:opacity-40"
                  >
                    {isEnding ? <Loader2 className="size-4 animate-spin" /> : <PhoneOff className="size-4" />}
                    {isEnding ? 'Finalisation…' : 'Terminer'}
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-calm-secondary">
              Parlez naturellement : Alexandra détecte automatiquement quand vous avez fini. Alexandra est une IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}