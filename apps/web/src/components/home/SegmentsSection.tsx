"use client"

import { useState } from "react"
import { SEGMENTS } from "./content"

const focusWhite =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

/** Bande « Pour qui » : segments interactifs et questions du segment actif (client). */
export function SegmentsSection() {
  const [active, setActive] = useState(SEGMENTS[0].id)
  const segment = SEGMENTS.find((s) => s.id === active) ?? SEGMENTS[0]

  return (
    <section id="pour-qui" aria-labelledby="pour-qui-titre" className="scroll-mt-20 bg-calm-accent-deep text-white">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-16 min-[900px]:grid-cols-2 min-[900px]:gap-14 min-[900px]:py-20">
        <div>
          <h2 id="pour-qui-titre" className="text-calm-h1 font-semibold">
            Le jour J, vous aurez déjà répondu à <span className="font-accent">ces questions</span>.
          </h2>
          <p className="mt-6 text-base text-white">Vous préparez&nbsp;:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SEGMENTS.map((s) => {
              const on = s.id === active
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(s.id)}
                  className={`tap-target rounded-full border px-5 text-sm font-semibold transition-colors ${focusWhite} ${
                    on
                      ? "border-white bg-white text-calm-accent-deep"
                      : "border-[rgba(255,255,255,0.45)] bg-transparent text-white hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>

        <ul aria-live="polite" className="flex flex-col gap-3">
          {segment.questions.map((q) => (
            <li
              key={q}
              className="rounded-[20px] border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.1)] p-5 text-lg leading-relaxed"
            >
              «&nbsp;{q}&nbsp;»
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
