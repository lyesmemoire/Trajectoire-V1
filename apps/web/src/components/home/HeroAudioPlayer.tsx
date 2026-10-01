"use client"

import { useRef, useState } from "react"
import { Pause, Play } from "lucide-react"

const BARS = [6, 12, 18, 10, 22, 14, 8, 20, 12, 16, 9, 18, 7, 13, 20, 10, 15, 8, 12, 6]

/**
 * Lecteur « Écouter Alexandra » : prêt mais MASQUÉ (SHOW_HERO_AUDIO = false) tant qu'aucun extrait audio réel
 * n'existe. Aucun fichier n'est chargé avant le premier clic.
 */
export function HeroAudioPlayer({ src = "/audio/alexandra-extrait.mp3" }: { src?: string }) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!audio.current) {
      audio.current = new Audio(src)
      audio.current.addEventListener("ended", () => setPlaying(false))
    }
    if (playing) {
      audio.current.pause()
      setPlaying(false)
    } else {
      void audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  return (
    <div className="mt-4 flex items-center gap-4 rounded-[20px] border border-calm-line bg-calm-surface p-3">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Mettre en pause l’extrait" : "Écouter Alexandra (20 s)"}
        className="tap-target flex size-12 shrink-0 items-center justify-center rounded-full bg-calm-accent text-white transition-colors hover:bg-calm-accent-deep"
      >
        {playing ? <Pause className="size-5" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-calm-ink">Écouter Alexandra (20&nbsp;s)</p>
        <div className="mt-1 flex h-6 items-center gap-[3px]" aria-hidden="true">
          {BARS.map((h, i) => (
            <span key={i} className="w-[3px] rounded-full bg-calm-accent-line" style={{ height: h }} />
          ))}
        </div>
      </div>
    </div>
  )
}
