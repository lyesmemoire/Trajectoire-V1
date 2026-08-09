'use client';

export function InterviewReport({ sessionData, onReset }: { sessionData: any; onReset: () => void }) {
  const report = sessionData.report;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Rapport d'entretien</h2>
        <button
          onClick={onReset}
          className="text-blue-600 hover:text-blue-700"
        >
          Nouvel entretien
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="text-5xl font-bold text-green-600 mb-2">
            {report.overallScore}%
          </div>
          <div className="text-gray-600">Score global</div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Feedback</h3>
          <ul className="space-y-2">
            {report.feedback.map((item: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Vos réponses</h3>
          <div className="space-y-4">
            {report.answers.map((answer: string, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">Réponse {index + 1}</div>
                <div className="text-gray-700">{answer}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Télécharger le rapport
          </button>
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Recommencer
          </button>
        </div>
      </div>
    </div>
  );
}
