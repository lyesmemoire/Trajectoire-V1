import { InterviewSessionSummary } from "@/lib/progress-service";

interface HistoryTableProps {
  history: InterviewSessionSummary[];
}

export function HistoryTable({ history }: HistoryTableProps) {
  if (!history || history.length === 0) {
    return null;
  }

  // Reverse to show newest first
  const sortedHistory = [...history].reverse();

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Historique des Sessions
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Poste visé</th>
              <th className="px-6 py-3">Technical</th>
              <th className="px-6 py-3">Communication</th>
              <th className="px-6 py-3">Confidence</th>
              <th className="px-6 py-3">Stress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedHistory.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {new Date(session.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">{session.jobTitle}</td>
                <td className="px-6 py-4">
                  <ScoreBadge score={session.technicalScore} />
                </td>
                <td className="px-6 py-4">
                  <ScoreBadge score={session.communicationScore} />
                </td>
                <td className="px-6 py-4">
                  <ScoreBadge score={session.confidenceScore} />
                </td>
                <td className="px-6 py-4">
                  <ScoreBadge score={session.stressScore} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const isHigh = score >= 80;
  const isMedium = score >= 50 && score < 80;
  const isLow = score < 50 && score > 0;

  if (score === 0) return <span className="text-gray-400">-</span>;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isHigh
          ? "bg-emerald-100 text-emerald-800"
          : isMedium
            ? "bg-amber-100 text-amber-800"
            : isLow
              ? "bg-rose-100 text-rose-800"
              : "bg-gray-100 text-gray-800"
      }`}
    >
      {score}/100
    </span>
  );
}
