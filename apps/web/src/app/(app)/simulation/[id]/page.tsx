'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Mic, MicOff, PhoneOff, Loader2, AlertCircle, Volume2 } from 'lucide-react'
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
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">
          A
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed `+(isAI ? 'bg-white/10 text-white/90' : 'bg-indigo-500/80 text-white')+` `+(!transcript.final ? 'opacity-50' : 'opacity-100')}
      >
        {transcript.text}
        {!transcript.final && (
          <span className="ml-1 animate-pulse text-white/40">…</span>
        )}
      </div>
      {!isAI && (
        <div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-[10px] font-bold text-indigo-300">
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

  const {
    status,
    transcripts,
    connect,
    disconnect,
    isAISpeaking,
    isUserSpeaking,
  } = useRealtimeInterview({
    sessionId,
    onError       : (msg) => console.error('[Simulation]', msg),
    onConnected   : () => console.info('[Simulation] connecte'),
    onDisconnected: () => console.info('[Simulation] deconnecte'),
  })

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [transcripts])

  useEffect(() => { connect() }, []) // eslint-disable-line

  async function handleEnd() {
    if (isEnding) return
    setIsEnding(true)
    disconnect()

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

  const statusConfig: Record<string, { label: string; dot: string }> = {
    idle         : { label: 'Initialisation...',  dot: 'bg-zinc-500' },
    connecting   : { label: 'Connexion...',        dot: 'bg-amber-400 animate-pulse' },
    connected    : { label: 'En ligne',            dot: 'bg-emerald-400' },
    speaking_user: { label: 'Vous parlez...',      dot: 'bg-indigo-400 animate-pulse' },
    speaking_ai  : { label: 'Alexandra parle...',  dot: 'bg-white animate-pulse' },
    disconnected : { label: 'Deconnecte',          dot: 'bg-zinc-600' },
    error        : { label: 'Erreur',              dot: 'bg-red-500' },
  }
  const { label: statusLabel, dot: statusDot } = statusConfig[status] ?? statusConfig.idle

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-white">

      <header className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/30">Trajectoire</span>
          <span className="text-white/15">·</span>
          <span className="text-xs text-white/50">Simulation d entretien</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70">
          <span className={`size-1.5 rounded-full `+statusDot} />
          {statusLabel}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="relative w-[52%] shrink-0 overflow-hidden bg-zinc-900">
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
                <div className="flex items-center gap-2 text-[11px] font-medium text-white/50">
                  <Volume2 className="size-3" />
                  En train de parler
                </div>
                <SoundWave active color="bg-indigo-400" />
              </>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-white/30">
                <Mic className="size-3" />
                En ecoute
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col border-l border-white/[0.08] bg-zinc-950">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
            {transcripts.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                {status === 'connecting' ? (
                  <>
                    <Loader2 className="size-7 animate-spin text-white/30" />
                    <p className="text-sm text-white/40">Connexion a l entretien...</p>
                    <p className="text-xs text-white/20">Autorisez le microphone si demande</p>
                  </>
                ) : status === 'error' ? (
                  <>
                    <AlertCircle className="size-7 text-red-400/70" />
                    <p className="text-sm text-white/50">Erreur de connexion</p>
                    <button
                      onClick={connect}
                      className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/15"
                    >
                      Reessayer
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <Mic className="size-5 text-white/30" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">L entretien va commencer</p>
                      <p className="mt-1 text-xs text-white/25">Alexandra va poser la premiere question</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {transcripts.map((t, i) => (
                  <TranscriptBubble key={i} transcript={t} />
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-white/[0.08] bg-zinc-900/60 px-6 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex size-9 items-center justify-center rounded-full border transition-all duration-300 `+(isUserSpeaking ? 'border-indigo-400/50 bg-indigo-400/15 text-indigo-300' : 'border-white/10 bg-white/5 text-white/30')}>
                  {isUserSpeaking ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60">{isUserSpeaking ? 'Vous parlez' : 'En ecoute'}</p>
                  <p className="text-[10px] text-white/25">Detection automatique</p>
                </div>
                <SoundWave active={isUserSpeaking} color="bg-indigo-400" />
              </div>
              <button
                type="button"
                onClick={handleEnd}
                disabled={isEnding}
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/50 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
              >
                {isEnding ? <Loader2 className="size-4 animate-spin" /> : <PhoneOff className="size-4" />}
                {isEnding ? 'Finalisation...' : 'Terminer'}
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] text-white/20">
              Parlez naturellement - Alexandra detecte automatiquement quand vous avez fini
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}