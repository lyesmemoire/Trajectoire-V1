"use client"

import { useState } from "react"
import { FOR_WHOM, SEGMENTS } from "./content"

/**
 * Bloc de droite de « Pour qui » : segments (boutons rectangulaires) et trois questions du segment actif.
 * Client uniquement pour le choix du segment.
 */
export function SegmentPicker() {
  const [active, setActive] = useState(SEGMENTS[0].id)
  const segment = SEGMENTS.find((s) => s.id === active) ?? SEGMENTS[0]

  return (
    <article className="flex min-h-[400px] flex-col gap-[22px] bg-calm-alt p-[clamp(24px,3vw,36px)]">
      <h3 className="m-0 text-[clamp(22px,2.1vw,26px)] leading-[1.15] tracking-[-0.02em]">{FOR_WHOM.pickerTitle}</h3>
      <div role="group" aria-label={FOR_WHOM.pickerLabel} className="flex flex-wrap gap-2">
        {SEGMENTS.map((s) => {
          const on = s.id === active
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(s.id)}
              className={`min-h-11 rounded-[4px] border px-[15px] py-[9px] text-sm font-semibold transition-colors ${
                on
                  ? "border-calm-accent bg-calm-accent text-white"
                  : "border-calm-field bg-transparent text-calm-ink hover:border-calm-accent"
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>
      <ul aria-live="polite" className="m-0 mt-auto list-none border-t border-calm-field p-0">
        {segment.questions.map((q) => (
          <li
            key={q}
            className="border-b border-calm-field py-4 text-[clamp(19px,1.8vw,22px)] font-medium leading-[1.25] tracking-[-0.01em]"
          >
            «&nbsp;{q}&nbsp;»
          </li>
        ))}
      </ul>
    </article>
  )
}
