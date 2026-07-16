// @ts-nocheck
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/design-system";

interface InterviewFooterProps {
  onEnd: () => void;
}

export function InterviewFooter({ onEnd }: InterviewFooterProps) {
  return (
    <Button variant="outline" onClick={onEnd} className="w-full">
      <ArrowLeft className="mr-2 w-4 h-4" />
      Terminer mon entretien
    </Button>
  );
}
