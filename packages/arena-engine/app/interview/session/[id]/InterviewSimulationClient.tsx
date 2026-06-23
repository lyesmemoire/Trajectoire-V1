"use client";

import { useState } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceResponsePanel } from "@/components/interview/VoiceResponsePanel";
import { ResponseScore } from "@/lib/interview/scoring";

export function InterviewSimulationClient({ session }: { session: any }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState<ResponseScore | null>(null);

  const questions = typeof session.questions === "string" ? JSON.parse(session.questions) : session.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentScore(null);
    } else {
      // Todo: Aller vers le rapport final
      window.location.href = `/interview/session/${session.id}/report`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Barre de Progression */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-slate-500">
          Question {currentQuestionIndex + 1} sur {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_: any, i: number) => (
            <div key={i} className={`h-1.5 w-8 rounded-full ${i <= currentQuestionIndex ? "bg-red-500" : "bg-slate-800"}`}></div>
          ))}
        </div>
      </div>
      
      {/* Voice Panel pour la question actuelle */}
      <VoiceResponsePanel 
        sessionId={session.id}
        questionIndex={currentQuestionIndex}
        question={currentQuestion}
        onScoreReceived={(score) => setCurrentScore(score)}
      />

      {/* Action Suivante une fois scoré */}
      {currentScore && (
        <div className="flex justify-end mt-8 animate-in fade-in">
          <Button 
            onClick={handleNext}
            className="bg-slate-100 hover:bg-white text-slate-900 rounded-xl px-8 py-6 font-black tracking-wider uppercase text-xs"
          >
            {currentQuestionIndex < questions.length - 1 ? "Question Suivante" : "Voir le rapport final"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
