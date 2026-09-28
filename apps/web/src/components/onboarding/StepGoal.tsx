"use client"

import { ArrowLeft, Check, Loader2, Pencil } from "lucide-react"

import {
  BUTTON_GHOST,
  BUTTON_PRIMARY,
  FOCUS_RING,
  INTERVIEW_TYPES,
  INTERVIEW_TYPE_OPTIONS,
  type OnboardingFormData,
} from "./constants"

interface StepGoalProps {
  data: OnboardingFormData
  onChange: (patch: Partial<OnboardingFormData>) => void
  /** Revient sur une étape précédente pour corriger une réponse. */
  onEdit: (step: number) => void
  onBack: () => void
  submitting: boolean
  error: string | null
}

function RecapRow({
  label,
  value,
  onEdit,
  editLabel,
}: {
  label: string
  value: string
  onEdit: () => void
  editLabel: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wider text-white/40">
          {label}
        </dt>
        <dd className="mt-0.5 truncate text-sm text-white/80">{value}</dd>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={editLabel}
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-md text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80 ${FOCUS_RING}`}
      >
        <Pencil className="size-3.5" aria-hidden />
      </button>
    </div>
  )
}

export function StepGoal({
  data,
  onChange,
  onEdit,
  onBack,
  submitting,
  error,
}: StepGoalProps) {
  const canSubmit = data.interviewType !== "" && !submitting

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2
          data-step-heading
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight text-white/80 outline-none"
        >
          Quel est votre premier objectif ?
        </h2>
        <p className="text-sm leading-relaxed text-white/50">
          Choisissez le type de simulation par lequel commencer. Vous pourrez
          en lancer d&apos;autres à tout moment.
        </p>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-medium text-white/80">
          Type d&apos;entretien
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {INTERVIEW_TYPES.map((type) => {
            const option = INTERVIEW_TYPE_OPTIONS[type]
            return (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  name="onboarding-interview-type"
                  value={type}
                  checked={data.interviewType === type}
                  onChange={() => onChange({ interviewType: type })}
                  className="peer sr-only"
                />
                <span className="block h-full rounded-lg border border-white/[0.1] bg-zinc-950 p-4 transition-colors hover:bg-white/[0.04] peer-checked:border-indigo-500 peer-checked:bg-indigo-500/10 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-zinc-900">
                  <span className="block text-sm font-semibold text-white/80">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-white/50">
                    {option.description}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <section aria-labelledby="onboarding-recap-title" className="space-y-3">
        <h3
          id="onboarding-recap-title"
          className="text-sm font-medium text-white/80"
        >
          Récapitulatif
        </h3>
        <dl className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.08] bg-zinc-950">
          <RecapRow
            label="Poste visé"
            value={data.title.trim()}
            onEdit={() => onEdit(0)}
            editLabel="Modifier le poste visé"
          />
          <RecapRow
            label="Secteur · Niveau"
            value={`${data.sector} · ${data.level}`}
            onEdit={() => onEdit(0)}
            editLabel="Modifier le secteur et le niveau"
          />
          <RecapRow
            label="Nom"
            value={data.name.trim()}
            onEdit={() => onEdit(1)}
            editLabel="Modifier le nom"
          />
          <RecapRow
            label="CV"
            value={
              data.cvStatus === "ready"
                ? `Lu · ${data.cvFileName}`
                : "Non fourni"
            }
            onEdit={() => onEdit(1)}
            editLabel="Modifier le CV"
          />
        </dl>
      </section>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className={BUTTON_GHOST}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour
        </button>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <button
            type="submit"
            disabled={!canSubmit}
            aria-describedby={data.interviewType === "" ? "onboarding-goal-hint" : undefined}
            className={BUTTON_PRIMARY}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Enregistrement…
              </>
            ) : (
              <>
                <Check className="size-4" aria-hidden />
                Terminer et accéder au tableau de bord
              </>
            )}
          </button>
          {data.interviewType === "" ? (
            <p id="onboarding-goal-hint" className="text-xs text-white/40">
              Choisissez un type d&apos;entretien pour terminer.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
