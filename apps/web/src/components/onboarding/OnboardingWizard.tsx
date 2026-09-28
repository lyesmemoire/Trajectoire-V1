"use client"

import { useCallback, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion"
import { ArrowLeft, ArrowRight, Target } from "lucide-react"

import { Card } from "@/components/ui/Card"
import { CompleteOnboardingSchema } from "@/validation/CompleteOnboardingSchema"
import {
  BUTTON_GHOST,
  BUTTON_PRIMARY,
  INITIAL_FORM_DATA,
  STEP_COUNT,
  STEP_TITLES,
  type OnboardingFormData,
} from "./constants"
import { StepGoal } from "./StepGoal"
import { StepProfile } from "./StepProfile"
import { StepTargetJob } from "./StepTargetJob"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

// `custom` = direction (1 = vers l'avant, -1 = retour) : le contenu glisse dans le sens de la navigation.
const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 32 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction * -32 }),
}

// Message affiché sous le bouton « Continuer » tant que l'étape est incomplète.
const STEP_HINTS = [
  "Renseignez le poste, le secteur et votre niveau pour continuer.",
  "Renseignez votre nom pour continuer.",
] as const

interface OnboardingWizardProps {
  /** Nom déjà connu (profil ou compte), pour préremplir l'étape 2. */
  initialName?: string
}

export function OnboardingWizard({ initialName = "" }: OnboardingWizardProps) {
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState<OnboardingFormData>({
    ...INITIAL_FORM_DATA,
    name: initialName,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const contentRef = useRef<HTMLDivElement>(null)
  // Le premier affichage ne doit pas voler le focus : seuls les changements d'étape le déplacent.
  const skipInitialFocus = useRef(true)

  const update = useCallback((patch: Partial<OnboardingFormData>) => {
    setData((previous) => ({ ...previous, ...patch }))
  }, [])

  const stepValid = [
    data.title.trim().length > 0 && data.sector !== "" && data.level !== "",
    data.name.trim().length > 0 && data.cvStatus !== "uploading",
    data.interviewType !== "",
  ]

  function goTo(target: number) {
    setDirection(target > step ? 1 : -1)
    setStep(target)
    setError(null)
  }

  function focusHeading() {
    contentRef.current
      ?.querySelector<HTMLElement>("[data-step-heading]")
      ?.focus({ preventScroll: true })
  }

  async function submit() {
    const parsed = CompleteOnboardingSchema.safeParse({
      targetJob: {
        title: data.title,
        sector: data.sector,
        level: data.level,
      },
      name: data.name,
      goal: { interviewType: data.interviewType },
      cvProvided: data.cvStatus === "ready",
    })

    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          "Certaines informations sont invalides.",
      )
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      })

      if (response.ok) {
        // `submitting` reste vrai pendant la redirection : pas de double envoi.
        router.push("/dashboard")
        router.refresh()
        return
      }

      if (response.status === 401) {
        setError("Votre session a expiré. Reconnectez-vous puis réessayez.")
      } else if (response.status === 409) {
        setError(
          "Votre profil n'est pas encore prêt. Rechargez la page puis réessayez.",
        )
      } else {
        const payload = (await response.json().catch(() => null)) as {
          error?: { message?: string }
        } | null
        setError(
          payload?.error?.message ??
            "Impossible d'enregistrer vos réponses. Réessayez.",
        )
      }
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau puis réessayez.")
    }

    setSubmitting(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!stepValid[step] || submitting) return

    if (step < STEP_COUNT - 1) {
      goTo(step + 1)
      return
    }

    void submit()
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-full">
        {/* Halo d'ambiance */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.16),transparent_70%)]"
        />

        <div className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-8 sm:py-12">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="grid size-[30px] place-items-center rounded-lg bg-indigo-500 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_6px_18px_-6px_rgba(99,102,241,0.7)]">
                <Target className="size-[15px]" strokeWidth={2} aria-hidden />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-white/80">
                Trajectoire
              </span>
            </div>
            <p className="text-xs font-medium text-white/50">
              Étape {step + 1} sur {STEP_COUNT}
              <span className="text-white/30"> · {STEP_TITLES[step]}</span>
            </p>
          </header>

          <div
            role="progressbar"
            aria-label="Progression de l'onboarding"
            aria-valuemin={1}
            aria-valuemax={STEP_COUNT}
            aria-valuenow={step + 1}
            aria-valuetext={`Étape ${step + 1} sur ${STEP_COUNT} : ${STEP_TITLES[step]}`}
            className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]"
          >
            <motion.div
              className="h-full rounded-full bg-indigo-500"
              initial={false}
              animate={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 flex flex-1 flex-col"
          >
            <Card className="p-6 sm:p-8">
              <div ref={contentRef} className="-mx-1 overflow-x-clip px-1">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: EASE }}
                    onAnimationComplete={(definition) => {
                      if (definition !== "center") return
                      if (skipInitialFocus.current) {
                        skipInitialFocus.current = false
                        return
                      }
                      focusHeading()
                    }}
                  >
                    {step === 0 ? (
                      <StepTargetJob data={data} onChange={update} />
                    ) : step === 1 ? (
                      <StepProfile data={data} onChange={update} />
                    ) : (
                      <StepGoal
                        data={data}
                        onChange={update}
                        onEdit={goTo}
                        onBack={() => goTo(step - 1)}
                        submitting={submitting}
                        error={error}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {step < STEP_COUNT - 1 ? (
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => goTo(step - 1)}
                      className={BUTTON_GHOST}
                    >
                      <ArrowLeft className="size-4" aria-hidden />
                      Retour
                    </button>
                  ) : (
                    <span aria-hidden />
                  )}

                  <div className="flex flex-col items-stretch gap-2 sm:items-end">
                    <button
                      type="submit"
                      disabled={!stepValid[step]}
                      aria-describedby={
                        stepValid[step] ? undefined : "onboarding-step-hint"
                      }
                      className={BUTTON_PRIMARY}
                    >
                      Continuer
                      <ArrowRight className="size-4" aria-hidden />
                    </button>
                    {!stepValid[step] ? (
                      <p id="onboarding-step-hint" className="text-xs text-white/40">
                        {data.cvStatus === "uploading" && step === 1
                          ? "Lecture du CV en cours…"
                          : STEP_HINTS[step]}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </Card>
          </form>
        </div>
      </main>
    </MotionConfig>
  )
}
