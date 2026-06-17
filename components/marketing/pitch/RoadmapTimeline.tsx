interface Phase {
  quarter: string;
  title: string;
  items: string[];
  status: "done" | "current" | "upcoming";
}

const phases: Phase[] = [
  {
    quarter: "Q1 2025",
    title: "Foundation",
    status: "done",
    items: [
      "Architecture transactionnelle ACID",
      "Moteur ATS + simulation entretien",
      "Landing page + tunnel paiement Stripe",
      "Infrastructure Supabase + Redis + Vercel",
    ],
  },
  {
    quarter: "Q2 2025",
    title: "Product-Market Fit",
    status: "current",
    items: [
      "SEO programmatique (500+ pages)",
      "Dashboard métriques temps réel",
      "Partenariats 3 grandes écoles (test)",
      "NPS target : 70+",
    ],
  },
  {
    quarter: "Q3 2025",
    title: "Scale & B2B",
    status: "upcoming",
    items: [
      "Migration architecture asynchrone (Inngest)",
      "White-label écoles & universités",
      "API publique (intégration ATS tiers)",
      "1 000 utilisateurs actifs",
    ],
  },
  {
    quarter: "Q4 2025",
    title: "Data Flywheel",
    status: "upcoming",
    items: [
      "Fine-tuning modèle sur données propriétaires",
      "Réduction coût IA de 80%",
      "Enterprise plan (10K€/an)",
      "Levée de fonds Série A",
    ],
  },
];

const STATUS_STYLES = {
  done: { dot: "bg-green-500", badge: "text-green-400 bg-green-900/20" },
  current: {
    dot: "bg-red-500 ring-4 ring-red-500/20",
    badge: "text-red-400 bg-red-900/20",
  },
  upcoming: { dot: "bg-gray-600", badge: "text-gray-400 bg-gray-900/40" },
};

const STATUS_LABELS = {
  done: "✓ Livré",
  current: "⚡ En cours",
  upcoming: "À venir",
};

export default function RoadmapTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-green-900/60 via-red-900/60 to-gray-800/60 lg:left-1/2" />
      <div className="space-y-10">
        {phases.map((phase, i) => {
          const s = STATUS_STYLES[phase.status];
          const isRight = i % 2 === 0;
          return (
            <div
              key={phase.quarter}
              className={`relative flex items-start gap-8 lg:gap-0 ${isRight ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            >
              <div
                className={`absolute left-4 top-1.5 z-10 h-4 w-4 shrink-0 -translate-x-1/2 rounded-full ${s.dot} lg:left-1/2`}
              />
              <div
                className={`ml-12 w-full rounded-xl border border-red-900/30 bg-black/50 p-6 lg:ml-0 lg:w-[45%] ${isRight ? "lg:mr-auto lg:pr-10" : "lg:ml-auto lg:pl-10"}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-400">
                    {phase.quarter}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${s.badge}`}
                  >
                    {STATUS_LABELS[phase.status]}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-white">
                  {phase.title}
                </h3>
                <ul className="space-y-1.5">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <span className="mt-1 text-red-400">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
