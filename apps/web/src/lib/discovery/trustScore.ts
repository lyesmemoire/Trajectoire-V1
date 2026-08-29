import type {
  DiscoveryLivenessStatus,
} from "./liveness"

import type {
  DiscoveryProvider,
} from "./types"

export type DiscoveryTrustInput = {
  status: DiscoveryLivenessStatus
  providers: readonly DiscoveryProvider[]
  descriptionLength: number
  hasApplyUrl: boolean
  publishedAt: Date | null
  lastSeenAt: Date
  now?: Date
}

export type DiscoveryTrustBand =
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "UNTRUSTED"

export type DiscoveryTrustResult = {
  score: number
  band: DiscoveryTrustBand
  reasons: string[]
  signals: {
    liveness: number
    providerAgreement: number
    recency: number
    completeness: number
    applyPath: number
  }
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  )
}

function uniqueProviders(
  providers: readonly DiscoveryProvider[],
): DiscoveryProvider[] {
  return Array.from(
    new Set(
      providers,
    ),
  )
}

function differenceInDays(
  newer: Date,
  older: Date,
): number {
  const milliseconds =
    newer.getTime() -
    older.getTime()

  return Math.max(
    0,
    milliseconds /
      86_400_000,
  )
}

function scoreLiveness(
  status: DiscoveryLivenessStatus,
): number {
  switch (status) {
    case "LIVE":
      return 35

    case "STALE":
      return 15

    case "CLOSED":
      return 0
  }
}

function scoreProviderAgreement(
  count: number,
): number {
  if (count >= 3) {
    return 20
  }

  if (count === 2) {
    return 14
  }

  if (count === 1) {
    return 6
  }

  return 0
}

function scoreRecency({
  publishedAt,
  lastSeenAt,
  now,
}: {
  publishedAt: Date | null
  lastSeenAt: Date
  now: Date
}): number {
  const lastSeenAge =
    differenceInDays(
      now,
      lastSeenAt,
    )

  let seenScore = 0

  if (lastSeenAge <= 1) {
    seenScore = 10
  }
  else if (lastSeenAge <= 3) {
    seenScore = 8
  }
  else if (lastSeenAge <= 7) {
    seenScore = 5
  }
  else if (lastSeenAge <= 14) {
    seenScore = 2
  }

  if (!publishedAt) {
    return seenScore
  }

  const publishedAge =
    differenceInDays(
      now,
      publishedAt,
    )

  let publishedScore = 0

  if (publishedAge <= 7) {
    publishedScore = 10
  }
  else if (publishedAge <= 14) {
    publishedScore = 8
  }
  else if (publishedAge <= 30) {
    publishedScore = 5
  }
  else if (publishedAge <= 60) {
    publishedScore = 2
  }

  return clamp(
    seenScore +
      publishedScore,
    0,
    20,
  )
}

function scoreCompleteness(
  descriptionLength: number,
): number {
  const length =
    Math.max(
      0,
      descriptionLength,
    )

  if (length >= 2_000) {
    return 15
  }

  if (length >= 1_000) {
    return 12
  }

  if (length >= 500) {
    return 9
  }

  if (length >= 200) {
    return 5
  }

  if (length > 0) {
    return 2
  }

  return 0
}

function scoreApplyPath(
  hasApplyUrl: boolean,
): number {
  return hasApplyUrl
    ? 10
    : 0
}

function trustBand(
  score: number,
  status: DiscoveryLivenessStatus,
): DiscoveryTrustBand {
  if (status === "CLOSED") {
    return "UNTRUSTED"
  }

  if (score >= 80) {
    return "HIGH"
  }

  if (score >= 55) {
    return "MEDIUM"
  }

  if (score >= 30) {
    return "LOW"
  }

  return "UNTRUSTED"
}

export function scoreDiscoveryTrust({
  status,
  providers,
  descriptionLength,
  hasApplyUrl,
  publishedAt,
  lastSeenAt,
  now = new Date(),
}: DiscoveryTrustInput): DiscoveryTrustResult {
  const providerList =
    uniqueProviders(
      providers,
    )

  const liveness =
    scoreLiveness(
      status,
    )

  const providerAgreement =
    scoreProviderAgreement(
      providerList.length,
    )

  const recency =
    scoreRecency({
      publishedAt,
      lastSeenAt,
      now,
    })

  const completeness =
    scoreCompleteness(
      descriptionLength,
    )

  const applyPath =
    scoreApplyPath(
      hasApplyUrl,
    )

  const score =
    clamp(
      Math.round(
        liveness +
          providerAgreement +
          recency +
          completeness +
          applyPath,
      ),
      0,
      100,
    )

  const reasons: string[] = []

  if (status === "LIVE") {
    reasons.push(
      "Offre confirmée active lors du dernier scan.",
    )
  }
  else if (status === "STALE") {
    reasons.push(
      "Offre absente du dernier scan et en attente de confirmation.",
    )
  }
  else {
    reasons.push(
      "Offre considérée fermée après plusieurs scans manqués.",
    )
  }

  if (providerList.length >= 2) {
    reasons.push(
      `Présence confirmée par ${providerList.length} sources ATS distinctes.`,
    )
  }
  else if (providerList.length === 1) {
    reasons.push(
      "Présence confirmée par une seule source ATS.",
    )
  }

  if (recency >= 15) {
    reasons.push(
      "Signal de récence fort.",
    )
  }
  else if (recency <= 5) {
    reasons.push(
      "Récence limitée ou date de publication ancienne.",
    )
  }

  if (completeness >= 12) {
    reasons.push(
      "Description suffisamment détaillée.",
    )
  }
  else if (completeness <= 5) {
    reasons.push(
      "Description peu détaillée.",
    )
  }

  if (hasApplyUrl) {
    reasons.push(
      "Lien de candidature direct disponible.",
    )
  }
  else {
    reasons.push(
      "Aucun lien de candidature direct confirmé.",
    )
  }

  return {
    score,

    band:
      trustBand(
        score,
        status,
      ),

    reasons,

    signals: {
      liveness,
      providerAgreement,
      recency,
      completeness,
      applyPath,
    },
  }
}