'use client';

import React from 'react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelectQuestion }: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onSelectQuestion(question)}
          className="text-sm bg-calm-line-soft hover:bg-calm-line-soft text-calm-ink px-3 py-2 rounded-lg transition-colors"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
