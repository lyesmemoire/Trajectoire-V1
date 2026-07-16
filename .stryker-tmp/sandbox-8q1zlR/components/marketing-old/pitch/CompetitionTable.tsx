// @ts-nocheck
const competitors = [
  { name: "AI Career Copilot", us: true },
  { name: "ChatGPT", us: false },
  { name: "Resume.io", us: false },
  { name: "TopInterview", us: false },
  { name: "LinkedIn Premium", us: false },
];

const criteria = [
  {
    label: "Analyse ATS spécifique offre",
    us: true,
    others: [false, true, false, false],
  },
  {
    label: "Simulation entretien sur-mesure",
    us: true,
    others: [false, false, true, false],
  },
  {
    label: "Évaluation structurée + note",
    us: true,
    others: [false, false, true, false],
  },
  {
    label: "Pay-as-you-go (sans abonnement)",
    us: true,
    others: [false, false, false, false],
  },
  {
    label: "Modèle transactionnel ACID",
    us: true,
    others: [false, false, false, false],
  },
  {
    label: "Prix < 5€/utilisation",
    us: true,
    others: [false, false, false, false],
  },
  {
    label: "RGPD natif (hébergement EU)",
    us: true,
    others: [false, true, false, true],
  },
  {
    label: "Data flywheel (fine-tuning futur)",
    us: true,
    others: [false, false, false, false],
  },
];

function Check({ value }: { value: boolean }) {
  return (
    <span
      className={`text-lg font-bold ${value ? "text-green-400" : "text-gray-700"}`}
      aria-label={value ? "Oui" : "Non"}
    >
      {value ? "✓" : "✗"}
    </span>
  );
}

export default function CompetitionTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-red-900/30">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-red-900/30 bg-black/60">
            <th className="px-4 py-3 text-left font-semibold text-gray-400">
              Critère
            </th>
            {competitors.map((c) => (
              <th
                key={c.name}
                className={`px-4 py-3 text-center font-semibold ${c.us ? "text-red-400" : "text-gray-500"}`}
              >
                {c.us ? (
                  <span className="flex flex-col items-center gap-1">
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                      Nous
                    </span>
                    <span className="text-xs">{c.name}</span>
                  </span>
                ) : (
                  <span className="text-xs">{c.name}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((row, i) => (
            <tr
              key={row.label}
              className={`border-b border-red-900/20 ${i % 2 === 0 ? "bg-black/30" : "bg-black/10"}`}
            >
              <td className="px-4 py-3 text-gray-300">{row.label}</td>
              <td className="px-4 py-3 text-center">
                <Check value={row.us} />
              </td>
              {row.others.map((val, j) => (
                <td key={j} className="px-4 py-3 text-center">
                  <Check value={val} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
