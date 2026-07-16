import React, { ReactNode } from "react";
import { InterviewHeader } from "./InterviewHeader";

interface InterviewShellProps {
  children: ReactNode;
}

export function InterviewShell({ children }: InterviewShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans selection:bg-primary-soft selection:text-text-primary">
      <InterviewHeader />
      
      <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
