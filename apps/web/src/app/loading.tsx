/** Écran de chargement du site public (thème clair) : évite un écran vide pendant le rendu serveur. */
export default function RootLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-background"
    >
      <span className="sr-only">Chargement en cours…</span>
      <div
        aria-hidden="true"
        className="h-8 w-8 rounded-full border-2 border-primary-200 border-t-primary-600 motion-safe:animate-spin"
      />
    </div>
  )
}
