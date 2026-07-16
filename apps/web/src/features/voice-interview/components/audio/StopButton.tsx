import React, { memo } from "react";
import { Button } from "../ui/Button";
import { Square } from "lucide-react";

interface StopButtonProps {
  onStop: () => void;
  disabled?: boolean;
}

export const StopButton = memo(function StopButton({ onStop, disabled }: StopButtonProps) {
  return (
    <Button 
      variant="destructive" 
      size="iconLg" 
      onClick={onStop}
      disabled={disabled}
      aria-label="Terminer l'entretien définitivement"
    >
      <Square className="w-6 h-6" fill="currentColor" />
    </Button>
  );
});
