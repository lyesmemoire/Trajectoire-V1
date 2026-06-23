"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SimulationBridge() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Animate progress bar while the server computes
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 2));
    }, 50);

    // Call server-authoritative endpoint
    async function runSimulation() {
      try {
        const res = await fetch("/api/executive/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Mock input scores — will be replaced by real IA analysis later
            strategicThinking: 85,
            stakeholderInfluence: 70,
            decisionClarity: 90,
            authorityProjection: 80,
            pressureStability: 65,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Server error ${res.status}`);
        }

        const { sessionId } = await res.json();

        if (!cancelled) {
          setProgress(100);
          // Small delay so the user sees 100% before navigating
          setTimeout(() => {
            router.push(`/simulation/result?id=${sessionId}`);
          }, 300);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "An unexpected error occurred.");
          clearInterval(interval);
        }
      }
    }

    runSimulation();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="max-w-md w-full space-y-8 text-center px-6">
        {error ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-red-400">Simulation Error</h2>
            <p className="text-neutral-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">Analyzing behavioral signals...</h2>
            <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-neutral-500 animate-pulse">
              Mapping cognitive pressure response...
            </p>
          </>
        )}
      </div>
    </main>
  );
}
