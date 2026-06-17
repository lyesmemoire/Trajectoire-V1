interface Step {
  id: string;
  label: string;
  completed: boolean;
  current: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
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
                    ? "bg-emerald-500 text-white"
                    : step.current
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-gray-100 text-gray-400"
                }
              `}
            >
              {step.completed ? "✓" : index + 1}
            </div>
            <span
              className={`
                mt-1 text-xs font-medium
                ${step.current ? "text-blue-600" : step.completed ? "text-emerald-600" : "text-gray-400"}
              `}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
                mx-2 h-0.5 w-12 transition-colors duration-300
                ${step.completed ? "bg-emerald-400" : "bg-gray-200"}
              `}
            />
          )}
        </div>
      ))}
    </nav>
  );
}
