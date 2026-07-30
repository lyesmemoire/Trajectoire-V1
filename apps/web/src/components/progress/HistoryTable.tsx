import { InterviewSessionSummary } from "@/lib/progress-service"

interface HistoryTableProps {
  history: InterviewSessionSummary[]
}

export function HistoryTable({ history }: HistoryTableProps) {
  if (!history || history.length === 0) {
    return null
  }

  // Reverse to show newest first
  const sortedHistory = [...history].reverse()

  return (
    <div className="mt-8 rounded-xl border border-ivoire-200 bg-white/70 backdrop-blur-xl shadow-premium overflow-hidden">
      <div className="px-6 py-4 border-b border-ivoire-200">
        <h3 className="text-lg font-serif font-semibold text-ink-900">
          Historique des Sessions
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-ink-600">
          <thead className="bg-ivoire-50 text-xs uppercase text-ink-500">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Poste visé</th>
              <th className="px-6 py-3">Technical</th>
              <th className="px-6 py-3">Communication</th>
              <th className="px-6 py-3">Confidence</th>
              <th className="px-6 py-3">Stress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ivoire-200">
            {sortedHistory.map((session) => (
              <tr key={session.id} className="hover:bg-ivoire-50/50">
                <td className="px-6 py-4 font-medium text-ink-900">
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
  )
}

function ScoreBadge({ score }: { score: number }) {
  const isHigh = score >= 80
  const isMedium = score >= 50 && score < 80
  const isLow = score < 50 && score > 0

  if (score === 0) return <span className="text-ink-400">-</span>

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isHigh
          ? "bg-forest-100 text-forest-800"
          : isMedium
            ? "bg-terracotta-100 text-terracotta-800"
            : isLow
              ? "bg-brick-100 text-brick-800"
              : "bg-ivoire-100 text-ink-800"
      }`}
    >
      {score}/100
    </span>
  )
}
