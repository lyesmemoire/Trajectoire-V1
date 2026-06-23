"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";

// Reusable Section Component for the blurred breakdown
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <h3 className="font-semibold text-lg">{title}</h3>
    <div className="blur-sm opacity-60 select-none pointer-events-none space-y-2 text-sm text-neutral-400 leading-relaxed">
      {children}
    </div>
  </div>
);

export default function RevealLockedPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id") ?? "";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Detailed Strategic Breakdown
          </h1>
          <p className="text-neutral-400">
            Deep analysis of your cognitive patterns under pressure.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 space-y-8">
          <Section title="Strategic Framing Depth">
            <p>
              Your responses indicate operational precision but limited
              cross-layer strategic abstraction. When pressed on long-term
              implications, your focus defaults to tactical execution rather than
              high-level vision framing.
            </p>
          </Section>

          <Section title="Stakeholder Influence Mapping">
            <p>
              Influence language markers: moderate dominance, low executive
              brevity. You tend to over-explain when challenged by peers, missing
              opportunities to use silence and conciseness as authority anchors.
            </p>
          </Section>

          <Section title="Board-Level Response Simulation">
            <p>
              Under acute questioning, your pressure stability metric shows minor
              fluctuations. While recovery is swift, initial defensive positioning
              reduces perceived ownership of the narrative.
            </p>
          </Section>

          <Section title="Competitive Positioning Index">
            <p>
              Compared to top 20% Director candidates, your authority projection
              under pressure remains below optimal threshold. Closing the
              persuasion gap requires structural shifts in communication vectors.
            </p>
            <div className="h-4 w-full bg-neutral-800 rounded-full mt-4">
              <div className="h-full bg-blue-500 w-3/4 rounded-full" />
            </div>
          </Section>
        </div>

        {/* CTA Premium Final */}
        <div className="mt-16 text-center">
          <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 relative overflow-hidden shadow-2xl">
            {/* Background subtle glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-40 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 bg-neutral-950 rounded-full flex items-center justify-center border border-neutral-800 shadow-inner">
                <Lock className="w-6 h-6 text-neutral-400" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-white">
              Unlock Your Full Executive Analysis
            </h2>

            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Access detailed strategic breakdown, influence mapping, and
              Director-level readiness tracking.
            </p>

            <Link
              href={`/auth/signup?plan=executive_trial&source=reveal&session=${sessionId}`}
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 transition-colors rounded-lg text-lg font-medium text-white shadow-lg shadow-blue-900/20"
            >
              Start 7-Day Executive Access
            </Link>

            <p className="text-xs text-neutral-500 mt-6">
              No commitment. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
