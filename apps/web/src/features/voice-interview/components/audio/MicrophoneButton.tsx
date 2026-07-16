import React, { memo, useCallback } from "react";
import { Button } from "../ui/Button";
import { Mic, MicOff } from "lucide-react";
import { usePermissions } from "../../hooks";

interface MicrophoneButtonProps {
  onStart: () => void;
  disabled?: boolean;
}

export const MicrophoneButton = memo(function MicrophoneButton({ onStart, disabled }: MicrophoneButtonProps) {
  const { permission, requestMicrophoneAccess } = usePermissions();

  const handleClick = useCallback(async () => {
    if (permission !== "granted") {
      const granted = await requestMicrophoneAccess();
      if (!granted) return;
    }
    onStart();
  }, [permission, requestMicrophoneAccess, onStart]);

  const isDenied = permission === "denied";

  return (
    <Button 
      size="lg" 
      onClick={handleClick}
      disabled={disabled || isDenied}
      className="gap-3 rounded-full h-16 px-8 text-lg"
      aria-label="Commencer l'entretien"
    >
      {isDenied ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      {isDenied ? "Microphone refusé" : "Commencer l'entretien"}
    </Button>
  );
});
