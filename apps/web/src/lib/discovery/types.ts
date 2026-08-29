export type DiscoveryProvider =
  | "GREENHOUSE"
  | "LEVER"
  | "ASHBY"
  | "OTHER"

export type DiscoverySourceContext = {
  company: string
  boardKey: string
}

export type NormalizedDiscoveredJob = {
  provider: DiscoveryProvider
  sourceKey: string
  externalId: string
  boardKey: string
  title: string
  company: string
  location: string | null
  department: string | null
  employmentType: string | null
  workplaceType: string | null
  description: string
  sourceUrl: string
  applyUrl: string | null
  fingerprint: string
  publishedAt: Date | null
  rawPayload: Record<string, unknown>
}

export type DiscoveryCluster = {
  fingerprint: string
  canonical: NormalizedDiscoveredJob
  sources: NormalizedDiscoveredJob[]
}