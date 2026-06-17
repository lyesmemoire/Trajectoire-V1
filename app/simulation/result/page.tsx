"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SessionData {
  id: string;
  overall: number;
  percentile: number;
  level: string;
  scores: {
    strategicThinking: number;
    stakeholderInfluence: number;
    decisionClarity: number;
    authorityProjection: number;
    pressureStability: number;
  };
}

export default function SimulationResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");

  const [session, setSession] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session identifier.");
      setLoading(false);
      return;
    }

    async function fetchSession() {
      try {
        const res = await fetch(`/api/executive/session?id=${sessionId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Session not found.");
        }
        const data = await res.json();
        setSession(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
        <p className="animate-pulse text-neutral-400">Loading your results...</p>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-400">Unable to load results</h2>
          <p className="text-neutral-400">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-sm font-medium"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const persuasionGap = 100 - session.scores.stakeholderInfluence;

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-sm uppercase tracking-widest text-neutral-500 font-semibold">
            Your Pressure Profile
          </h1>
          <div className="text-6xl md:text-7xl font-bold tracking-tighter">
            {session.overall}<span className="text-3xl text-neutral-500">%</span>
          </div>
          <p className="text-neutral-400 text-lg">Executive Readiness Index™</p>

          <p className="text-neutral-400 mt-6">
            You performed above{" "}
            <span className="text-white font-semibold">{session.percentile}%</span>{" "}
            of managers preparing for Director roles.
          </p>

          <div className="mt-8 text-neutral-400 max-w-xl mx-auto">
            <p>
              At your current performance level, promotion to Director would require
              stronger multi-layer strategic framing and stakeholder influence under
              pressure.
            </p>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
            <span className="text-neutral-400">Current Positioning</span>
            <span className="font-semibold text-lg">{session.level}</span>
          </div>

          <div className="flex justify-between items-center pb-4">
            <span className="text-neutral-400">Gap to Director</span>
            <span className="font-semibold text-lg text-yellow-500">
              {session.overall >= 80
                ? "Minimal"
                : session.overall >= 65
                ? "Moderate"
                : "Significant"}
            </span>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="text-sm uppercase tracking-widest text-neutral-500 font-semibold mb-4">
              Core Axes
            </h3>

            {Object.entries(session.scores).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-neutral-400">{value}/100</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(value)}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border border-neutral-800 p-6 rounded-lg bg-neutral-900/50">
          <h3 className="text-lg font-medium mb-2">Executive Gap Analysis</h3>
          <p className="text-neutral-400">
            Your influence projection shows a persuasion gap of{" "}
            <span className="text-white font-semibold">{persuasionGap}%</span>.
          </p>
          <p className="text-neutral-500 text-sm mt-2">
            Director-level interviews assess cross-functional authority and
            stakeholder control.
          </p>
        </div>

        <div className="text-center">
          <Link
            href={`/simulation/reveal?id=${session.id}`}
            className="mt-12 inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-lg font-medium shadow-lg shadow-blue-900/20"
          >
            View Full Executive Breakdown
          </Link>
        </div>
      </div>
    </main>
  );
}
