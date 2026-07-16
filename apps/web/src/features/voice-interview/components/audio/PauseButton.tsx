import React, { memo } from "react";
import { Button } from "../ui/Button";
import { Pause } from "lucide-react";

interface PauseButtonProps {
  onPause: () => void;
  disabled?: boolean;
}

export const PauseButton = memo(function PauseButton({ onPause, disabled }: PauseButtonProps) {
  return (
    <Button 
      variant="outline" 
      size="iconLg" 
      onClick={onPause}
      disabled={disabled}
      aria-label="Mettre l'entretien en pause"
    >
      <Pause className="w-6 h-6 text-slate-700" />
    </Button>
  );
});
