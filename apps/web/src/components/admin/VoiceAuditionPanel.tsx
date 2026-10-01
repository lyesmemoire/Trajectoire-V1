"use client"

import { useState } from "react"
import { AUDITION_SAMPLES, AUDITION_VOICES, PERSONAS } from "@/lib/interview/voice-audition"
import { PERSONA_LABELS, PERSONA_VOICES, type Persona } from "@/lib/interview/session-setup"

/**
 * Écoute des voix : chaque style avec la voix actuellement choisie, et un menu pour essayer les autres.
 * Les `<audio>` pointent vers la route admin (même origine, compatible avec la CSP).
 */
export function VoiceAuditionPanel() {
  const [voices, setVoices] = useState<Record<Persona, string>>({ ...PERSONA_VOICES })

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {PERSONAS.map(persona => {
        const voice = voices[persona]
        return (
          <li key={persona} className="rounded-2xl border border-calm-line bg-calm-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-calm-ink">{PERSONA_LABELS[persona].label}</h2>
                <p className="text-sm text-calm-secondary">{PERSONA_LABELS[persona].hint}</p>
              </div>
              <label className="text-xs text-calm-secondary">
                <span className="sr-only">Voix pour le style {PERSONA_LABELS[persona].label}</span>
                <select
                  value={voice}
                  onChange={e => setVoices(v => ({ ...v, [persona]: e.target.value }))}
                  className="rounded-lg border border-calm-line bg-calm-bg px-2 py-1.5 text-sm text-calm-ink"
                >
                  {AUDITION_VOICES.map(v => (
                    <option key={v} value={v}>
                      {v}
                      {v === PERSONA_VOICES[persona] ? " (actuelle)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-calm-secondary">« {AUDITION_SAMPLES[persona].text} »</p>
            {/* key : recharge le lecteur quand la voix change */}
            <audio
              key={persona + voice}
              controls
              preload="none"
              className="mt-4 w-full"
              src={`/api/admin/voice-preview?persona=${persona}&voice=${voice}`}
            />
          </li>
        )
      })}
    </ul>
  )
}
