export type RadarSourceErrorCode = "AUTH" | "RATE_LIMITED" | "BAD_REQUEST" | "UPSTREAM" | "INVALID_RESPONSE" | "TIMEOUT"

/** Erreur d'une source d'offres : le message ne contient jamais de secret ni de corps de réponse brut. */
export class RadarSourceError extends Error {
  constructor(
    readonly code: RadarSourceErrorCode,
    message: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = "RadarSourceError"
  }
}
