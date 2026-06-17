"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InterviewEntryPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (jobDescription.trim().length < 50) return;
    setIsStarting(true);
    
    try {
      // In a real flow, we'd save this job description to a new session in DB
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await response.json();
      
      if (data.sessionId) {
        router.push(`/interview/${data.sessionId}`);
      } else {
        // Fallback for UI simulation if API isn't wired up yet
        setTimeout(() => {
          router.push(`/interview/demo-session`);
        }, 1500);
      }
    } catch (error) {
      setTimeout(() => {
        router.push(`/interview/demo-session`);
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F14] text-[#E5E7EB] font-sans antialiased flex flex-col selection:bg-neutral-800 selection:text-white">
      {/* HEADER MINIMAL */}
      <header className="w-full px-8 py-10 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="flex flex-col hover:opacity-80 transition-opacity">
          <div className="font-serif text-xl font-semibold tracking-[0.08em] uppercase text-primary">
            TRAJECTOIRE
          </div>
          <div className="text-[10px] uppercase tracking-widest text-secondary font-mono mt-1">
            Executive Assessment System
          </div>
        </Link>
      </header>

      {/* ENTRY FORM */}
      <section className="flex-1 flex flex-col justify-center items-center px-8 py-12 max-w-2xl mx-auto w-full">
        <div className="w-full space-y-12">
          
          <div className="space-y-4">
            <h1 className="font-serif text-3xl font-semibold tracking-wide text-primary">
              Contextual Executive Interview
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-[#9CA3AF]">
              Collez l'offre d'emploi correspondant au poste ciblé.
            </p>
          </div>

          <div className="space-y-8">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Description du poste visé..."
              className="w-full h-64 p-6 bg-[#10151C] border border-white/10 rounded-none text-sm font-sans text-[#E5E7EB] focus:outline-none focus:border-white/20 resize-none transition-colors"
            />

            <button
              onClick={handleStart}
              disabled={isStarting || jobDescription.trim().length < 50}
              className={`w-full py-4 text-sm font-mono uppercase tracking-widest transition-colors ${
                jobDescription.trim().length >= 50 && !isStarting
                  ? "bg-[#E5E7EB] text-[#0B0F14] hover:bg-white cursor-pointer"
                  : "bg-white/5 text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              {isStarting ? "Initialisation..." : "Commencer l'évaluation"}
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER MINIMAL */}
      <footer className="w-full px-8 py-10 border-t border-white/5 text-[#9CA3AF] text-xs font-mono uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="font-serif font-semibold tracking-[0.08em] text-primary">TRAJECTOIRE</span>
          <span className="ml-3 text-[10px]">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-8 items-center text-[10px]">
          <Link href="/manifeste" className="hover:text-primary transition-colors">Manifeste</Link>
          <span>Strictement Confidentiel</span>
        </div>
      </footer>
    </main>
  );
}
