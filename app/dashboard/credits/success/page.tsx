import { Suspense } from "react";
import Link from "next/link";

// Ce composant est séparé pour utiliser useSearchParams côté client
function SuccessContent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center space-y-6">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full
          bg-emerald-100 mx-auto"
        >
          <span className="text-5xl">✅</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Paiement confirmé !
          </h1>
          <p className="mt-3 text-gray-500">
            Vos crédits ont été ajoutés à votre compte instantanément. Vous
            pouvez maintenant continuer à optimiser votre candidature.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700 font-medium">
            💡 Conseil : Commencez par analyser votre score ATS, puis optimisez
            votre CV avant de simuler un entretien.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold
              text-white text-center hover:bg-blue-700 transition-colors"
          >
            Retour au tableau de bord
          </Link>
          <Link
            href="/dashboard/interview"
            className="w-full rounded-lg border border-gray-200 py-3 text-sm
              font-medium text-gray-700 text-center hover:bg-gray-50 transition-colors"
          >
            🎤 Simuler un entretien maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4
          border-blue-600 border-t-transparent"
          />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
