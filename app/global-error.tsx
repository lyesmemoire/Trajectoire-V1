'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCFCFC] text-gray-900 px-4">
          <h2 className="text-2xl font-bold mb-4">Erreur Système</h2>
          <p className="text-gray-600 mb-8 max-w-md text-center">
            Trajectoire a rencontré une erreur critique. L'équipe technique a été notifiée.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Recharger l'application
          </button>
        </div>
      </body>
    </html>
  )
}
