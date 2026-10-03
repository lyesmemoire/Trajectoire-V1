'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Mic, MicOff, PhoneOff, Loader2, AlertCircle, Volume2, Clock } from 'lucide-react'
import { endDestination } from '@/lib/interview/report-resolution'
import { useRealtimeInterview, type RealtimeTranscript } from '@/hooks/useRealtimeInterview'

function SoundWave({ active, color = 'bg-indigo-400' }: { active: boolean; color?: string }) {
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
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/60">
          A
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed `+(isAI ? 'bg-white/10 text-white/90' : 'bg-indigo-500/80 text-white')+` `+(!transcript.final ? 'opacity-50' : 'opacity-100')}
      >
        {transcript.text}
        {!transcript.final && (
          <span className="ml-1 animate-pulse text-white/60">…</span>
        )}
      </div>
      {!isAI && (
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-bold text-indigo-300">
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

    let redirectedTo: string | null = null
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

      // Rapport généré : la route redirige vers /report/<id du rapport>. Tout autre cas (génération en échec,
      // conflit, réseau) : l'id de séance, que la page rapport résout ou fait attendre — jamais un 404.
      redirectedTo = res.redirected ? new URL(res.url).pathname : null
    } catch { /* réseau indisponible : destination de repli ci-dessous */ }

    router.push(endDestination({ redirectedTo, sessionId }))
  }
  handleEndRef.current = handleEnd

  const statusConfig: Record<string, { label: string; dot: string }> = {
    idle         : { label: 'Initialisation…',   dot: 'bg-zinc-500' },
    connecting   : { label: 'Connexion…',         dot: 'bg-amber-400 animate-pulse' },
    connected    : { label: 'En ligne',           dot: 'bg-emerald-400' },
    speaking_user: { label: 'Vous parlez…',       dot: 'bg-indigo-400 animate-pulse' },
    speaking_ai  : { label: 'Alexandra parle…',   dot: 'bg-white animate-pulse' },
    disconnected : { label: 'Déconnecté',         dot: 'bg-zinc-600' },
    error        : { label: 'Erreur',             dot: 'bg-red-500' },
  }
  const { label: statusLabel, dot: statusDot } = statusConfig[status] ?? statusConfig.idle

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-zinc-950 text-white md:h-full md:min-h-0">

      <header className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Trajectoire</span>
          <span className="text-white/15">·</span>
          <span className="text-xs text-white/60">Simulation d&apos;entretien</span>
        </div>
        <div className="flex items-center gap-3">
          {clock && (
            <span
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs font-medium tabular-nums text-white/80"
              title="Temps restant sur la durée choisie"
            >
              <Clock className="size-3.5" aria-hidden />
              <span className="sr-only">Temps restant : </span>
              {clock}
            </span>
          )}
          <div role="status" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
            <span className={`size-1.5 rounded-full `+statusDot} aria-hidden />
            {statusLabel}
          </div>
        </div>
      </header>

      {isNearTimeLimit && !isEnding && (
        <div
          role="status"
          className="flex shrink-0 items-center justify-center gap-2 border-b border-amber-400/20 bg-amber-400/10 px-6 py-2 text-xs text-amber-200"
        >
          <Clock className="size-3.5" aria-hidden />
          Il reste moins de deux minutes : Alexandra va conclure l&apos;entretien, qui se terminera ensuite automatiquement.
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">

        <div className="relative h-64 w-full shrink-0 overflow-hidden bg-zinc-900 md:h-auto md:w-[52%]">
          <img
            src="/interviewer.png"
            alt="Alexandra"
            className={`absolute inset-0 size-full object-cover object-top transition-transform duration-700 ease-out `+(isAISpeaking ? 'scale-[1.02]' : 'scale-100')}
          />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-zinc-950/70 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md">
            <span className={`size-1.5 rounded-full `+(isAISpeaking ? 'animate-pulse bg-white' : 'bg-emerald-400')} />
            Alexandra · IA
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-6 py-8">
            {isAISpeaking ? (
              <>
                <div className="flex items-center gap-2 text-xs font-medium text-white/50">
                  <Volume2 className="size-3" />
                  En train de parler
                </div>
                <SoundWave active color="bg-indigo-400" />
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Mic className="size-3" />
                En écoute
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-[26rem] flex-1 flex-col border-t border-white/[0.08] bg-zinc-950 md:min-h-0 md:border-l md:border-t-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
            {transcripts.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                {status === 'connecting' ? (
                  <>
                    <Loader2 className="size-7 animate-spin text-white/60" />
                    <p className="text-sm text-white/60">Connexion à l&apos;entretien…</p>
                    <p className="text-xs text-white/60">Autorisez le microphone si le navigateur le demande</p>
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle className="size-7 text-red-400/70" />
                    <p className="max-w-xs text-sm text-white/60">
                      {errorMessage ?? 'Erreur de connexion'}
                    </p>
                    <button
                      onClick={connect}
                      className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/15"
                    >
                      Réessayer
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <Mic className="size-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">L&apos;entretien va commencer</p>
                      <p className="mt-1 text-xs text-white/60">Alexandra va poser la première question</p>
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

          <div className="shrink-0 border-t border-white/[0.08] bg-zinc-900/60 px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className={`flex size-9 items-center justify-center rounded-full border transition-all duration-300 `+(isUserSpeaking ? 'border-indigo-400/50 bg-indigo-400/15 text-indigo-300' : 'border-white/10 bg-white/5 text-white/60')}>
                  {isUserSpeaking ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60">{isMuted ? 'Micro coupé' : isUserSpeaking ? 'Vous parlez' : 'En écoute'}</p>
                  <p className="text-xs text-white/60">Détection automatique</p>
                </div>
                <SoundWave active={isUserSpeaking && !isMuted} color="bg-indigo-400" />
              </div>
              <div className="flex items-center gap-2">
                {canResume && (
                  <button
                    type="button"
                    onClick={connect}
                    className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                  >
                    Reprendre l&apos;entretien
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-pressed={isMuted}
                  disabled={isEnding || status === 'idle' || status === 'connecting' || status === 'error' || status === 'disconnected'}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 disabled:opacity-40 aria-pressed:border-amber-400/40 aria-pressed:text-amber-200"
                >
                  {isMuted ? <MicOff className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
                  {isMuted ? 'Réactiver le micro' : 'Couper le micro'}
                </button>
                {confirmEnd && !isEnding ? (
                  <>
                    <button
                      type="button"
                      onClick={handleEnd}
                      className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
                    >
                      <PhoneOff className="size-4" aria-hidden />
                      Confirmer la fin
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmEnd(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10"
                    >
                      Continuer
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmEnd(true)}
                    disabled={isEnding}
                    className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                  >
                    {isEnding ? <Loader2 className="size-4 animate-spin" /> : <PhoneOff className="size-4" />}
                    {isEnding ? 'Finalisation…' : 'Terminer'}
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-white/60">
              Parlez naturellement : Alexandra détecte automatiquement quand vous avez fini. Alexandra est une IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}