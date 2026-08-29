export type DiscoveryLivenessStatus =
  | "LIVE"
  | "STALE"
  | "CLOSED"

export type DiscoveryLivenessInput = {
  currentlySeen: boolean
  previousStatus: DiscoveryLivenessStatus
  previousMissCount: number
}

export type DiscoveryLivenessDecision = {
  status: DiscoveryLivenessStatus
  missCount: number
  shouldClose: boolean
}

export const DISCOVERY_CLOSE_AFTER_MISSES =
  2

export function decideDiscoveryLiveness({
  currentlySeen,
  previousStatus,
  previousMissCount,
}: DiscoveryLivenessInput): DiscoveryLivenessDecision {
  if (currentlySeen) {
    return {
      status: "LIVE",
      missCount: 0,
      shouldClose: false,
    }
  }

  if (previousStatus === "CLOSED") {
    return {
      status: "CLOSED",
      missCount: Math.max(
        previousMissCount,
        DISCOVERY_CLOSE_AFTER_MISSES,
      ),
      shouldClose: false,
    }
  }

  const missCount =
    Math.max(
      0,
      previousMissCount,
    ) + 1

  if (
    missCount >=
    DISCOVERY_CLOSE_AFTER_MISSES
  ) {
    return {
      status: "CLOSED",
      missCount,
      shouldClose: true,
    }
  }

  return {
    status: "STALE",
    missCount,
    shouldClose: false,
  }
}