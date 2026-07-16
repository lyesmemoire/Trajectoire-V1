import React, { memo, useRef, useEffect } from "react";
import { TranscriptLine } from "./TranscriptLine";
import { useTranscript } from "../../hooks";

export const TranscriptPanel = memo(function TranscriptPanel() {
  const { transcript } = useTranscript();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  // For this exercise, we assume transcript contains the latest turns
  // Since the SDK might just expose the current partial string in useTranscript,
  // we would display it here. If we had a list of lines, we'd map them.
  // We'll just display the current user partial for now, or you could extend the store
  // to keep a history of turns.

  if (!transcript.trim()) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
      {/* 
        This is a simplified view showing the current ongoing transcript.
        In a full implementation, the store would hold an array of messages.
      */}
      <TranscriptLine speaker="user" text={transcript} />
      
      <div ref={bottomRef} />
    </div>
  );
});
