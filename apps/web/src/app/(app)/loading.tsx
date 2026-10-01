/**
 * Écran de chargement de l'espace connecté (thème sombre hérité de (app)/layout).
 * Affiché pendant le rendu serveur d'une page : évite un écran vide.
 */
export default function AppLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="mx-auto w-full max-w-5xl">
      <span className="sr-only">Chargement en cours…</span>

      <div className="space-y-6" aria-hidden="true">
        <div className="space-y-3">
          <div className="h-3 w-24 rounded bg-calm-accent-wash motion-safe:animate-pulse" />
          <div className="h-8 w-2/3 max-w-md rounded-lg bg-calm-accent-soft motion-safe:animate-pulse" />
          <div className="h-4 w-full max-w-lg rounded bg-calm-accent-wash motion-safe:animate-pulse" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-calm-line bg-calm-surface motion-safe:animate-pulse"
            />
          ))}
        </div>

        <div className="h-64 rounded-2xl border border-calm-line bg-calm-surface motion-safe:animate-pulse" />
      </div>
    </div>
  )
}
