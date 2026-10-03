export type PollResult<T> = { kind: "value"; value: T } | { kind: "timeout" } | { kind: "aborted" }

/**
 * Interroge `check` à intervalle régulier jusqu'à ce qu'elle renvoie une valeur (autre que `null`), que le
 * délai soit écoulé ou que `signal` soit annulé (démontage du composant). Une erreur de `check` (réseau)
 * compte comme « pas encore » : on réessaie au tour suivant. Le nombre d'essais est borné par
 * `timeoutMs / intervalMs`, le premier essai étant immédiat.
 */
export async function pollUntil<T>(
  check: () => Promise<T | null>,
  options: { intervalMs: number; timeoutMs: number; signal?: AbortSignal },
): Promise<PollResult<T>> {
  const { intervalMs, timeoutMs, signal } = options
  const attempts = Math.max(1, Math.floor(timeoutMs / intervalMs) + 1)

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (signal?.aborted) return { kind: "aborted" }

    let value: T | null = null
    try {
      value = await check()
    } catch {
      value = null
    }
    if (value !== null) return { kind: "value", value }

    if (attempt < attempts - 1) {
      await new Promise<void>(resolve => {
        const timer = setTimeout(resolve, intervalMs)
        signal?.addEventListener(
          "abort",
          () => {
            clearTimeout(timer)
            resolve()
          },
          { once: true },
        )
      })
    }
  }

  return signal?.aborted ? { kind: "aborted" } : { kind: "timeout" }
}
