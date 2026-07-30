interface Step {
  id: string
  label: string
  completed: boolean
  current: boolean
}

interface ProgressStepsProps {
  steps: Step[]
}

export function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <nav aria-label="Progression" className="flex items-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`
                flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium
                transition-all duration-300
                ${
                  step.completed
                    ? "bg-forest-500 text-white"
                    : step.current
                      ? "bg-ink-900 text-white ring-4 ring-ink-100"
                      : "bg-ivoire-100 text-ink-400"
                }
              `}
            >
              {step.completed ? "✓" : index + 1}
            </div>
            <span
              className={`
                mt-1 text-xs font-medium
                ${step.current ? "text-ink-900" : step.completed ? "text-forest-600" : "text-ink-400"}
              `}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
                mx-2 h-0.5 w-12 transition-colors duration-300
                ${step.completed ? "bg-forest-400" : "bg-ivoire-200"}
              `}
            />
          )}
        </div>
      ))}
    </nav>
  )
}
