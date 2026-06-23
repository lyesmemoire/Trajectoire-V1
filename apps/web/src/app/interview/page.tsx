"use client";

import { useState } from "react";
import InterviewInitializer from "@/components/interview/InterviewInitializer";
import InterviewRoom from "@/components/interview/InterviewRoom";

export default function InterviewPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  return (
    <div className="interview-container">
      {!sessionId ? (
        <InterviewInitializer onStart={setSessionId} />
      ) : (
        <InterviewRoom sessionId={sessionId} />
      )}
    </div>
  );
}
