import { Button } from "@/components/design-system/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function StepNavigation({
  currentStepIndex,
  totalSteps,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Précédent
      </Button>

      <div className="text-sm text-gray-500">
        Étape {currentStepIndex + 1} sur {totalSteps}
      </div>

      <Button
        onClick={onNext}
        disabled={!canGoNext}
        className="flex items-center gap-2"
      >
        {currentStepIndex === totalSteps - 1 ? "Terminer" : "Suivant"}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
