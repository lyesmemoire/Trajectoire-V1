import React, { memo } from "react";
import { Button } from "../ui/Button";
import { Play } from "lucide-react";

interface ResumeButtonProps {
  onResume: () => void;
  disabled?: boolean;
}

export const ResumeButton = memo(function ResumeButton({ onResume, disabled }: ResumeButtonProps) {
  return (
    <Button 
      variant="default" 
      size="lg" 
      onClick={onResume}
      disabled={disabled}
      className="gap-3 rounded-full h-16 px-8 text-lg"
      aria-label="Reprendre l'entretien"
    >
      <Play className="w-6 h-6" />
      Reprendre
    </Button>
  );
});
