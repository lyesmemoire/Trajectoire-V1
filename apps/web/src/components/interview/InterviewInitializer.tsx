"use client";

import { useState } from "react";

export default function InterviewInitializer({
  onStart,
}: {
  onStart: (sessionId: string) => void;
}) {
  const [jobOffer, setJobOffer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (!jobOffer.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token") || "";

      const res = await fetch("/api/interviews/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          job_offer_text: jobOffer,
          target_role: "Target Role",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onStart(data.sessionId);
      } else {
        alert(data.error || "Failed to initialize interview.");
        setLoading(false);
      }
    } catch {
      alert("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="interview-init">
      <h1>Contextual Executive Interview</h1>

      <textarea
        placeholder="Paste Job Description..."
        value={jobOffer}
        onChange={(e) => setJobOffer(e.target.value)}
        rows={10}
      />

      <button onClick={handleStart} disabled={loading}>
        {loading ? "Initializing..." : "Begin Interview"}
      </button>
    </div>
  );
}
