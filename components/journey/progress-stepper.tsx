import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStepIndex: number;
  completedSteps: string[];
}

export function ProgressStepper({ steps, currentStepIndex, completedSteps }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = index === currentStepIndex;
        const isPending = index > currentStepIndex;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}
                  ${isCurrent ? "bg-blue-500 border-blue-500 text-white" : ""}
                  ${isPending ? "bg-gray-100 border-gray-300 text-gray-400" : ""}
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
              </div>
              <span
                className={`
                  mt-2 text-sm font-medium text-center
                  ${isCurrent ? "text-blue-600" : ""}
                  ${isPending ? "text-gray-400" : ""}
                  ${isCompleted ? "text-green-600" : ""}
                `}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-2 transition-colors
                  ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
