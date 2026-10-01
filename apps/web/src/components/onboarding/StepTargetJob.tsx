"use client"

import { Input } from "@/components/ui/input"
import {
  LEVELS,
  OPTION_CARD,
  SECTORS,
  type OnboardingFormData,
} from "./constants"

interface StepTargetJobProps {
  data: OnboardingFormData
  onChange: (patch: Partial<OnboardingFormData>) => void
}

function OptionGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onSelect,
  gridClass,
}: {
  legend: string
  name: string
  options: readonly T[]
  value: T | ""
  onSelect: (value: T) => void
  gridClass: string
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-calm-ink">{legend}</legend>
      <div className={`grid gap-2 ${gridClass}`}>
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onSelect(option)}
              className="peer sr-only"
            />
            <span className={OPTION_CARD}>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function StepTargetJob({ data, onChange }: StepTargetJobProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2
          data-step-heading
          tabIndex={-1}
          className="text-2xl font-semibold tracking-tight text-calm-ink outline-none"
        >
          Quel poste visez-vous ?
        </h2>
        <p className="text-sm leading-relaxed text-calm-secondary">
          Nous adaptons vos entretiens au poste, au secteur et à votre niveau
          d&apos;expérience.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="onboarding-title"
          className="block text-sm font-medium text-calm-ink"
        >
          Intitulé du poste
        </label>
        <Input
          id="onboarding-title"
          value={data.title}
          onChange={(event) => onChange({ title: event.target.value })}
          maxLength={100}
          autoComplete="off"
          placeholder="Ex. Product Manager, Développeur full stack, Consultant…"
        />
      </div>

      <OptionGroup
        legend="Secteur"
        name="onboarding-sector"
        options={SECTORS}
        value={data.sector}
        onSelect={(sector) => onChange({ sector })}
        gridClass="grid-cols-2 sm:grid-cols-4"
      />

      <OptionGroup
        legend="Niveau d'expérience"
        name="onboarding-level"
        options={LEVELS}
        value={data.level}
        onSelect={(level) => onChange({ level })}
        gridClass="grid-cols-2 sm:grid-cols-5"
      />
    </div>
  )
}
