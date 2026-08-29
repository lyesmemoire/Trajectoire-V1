import {
  createHash,
} from "node:crypto"

import type {
  DiscoveryCluster,
  DiscoveryProvider,
  DiscoverySourceContext,
  NormalizedDiscoveredJob,
} from "./types"

type UnknownRecord =
  Record<string, unknown>

function asRecord(
  value: unknown,
): UnknownRecord | null {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return null
  }

  return value as UnknownRecord
}

function scalarString(
  value: unknown,
): string {
  if (typeof value === "string") {
    return value.trim()
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value)
  }

  return ""
}

function optionalString(
  value: unknown,
): string | null {
  const result =
    scalarString(value)

  return result || null
}

function nestedString(
  value: unknown,
  key: string,
): string | null {
  const record =
    asRecord(value)

  if (!record) {
    return null
  }

  return optionalString(
    record[key],
  )
}

function firstNamedValue(
  value: unknown,
): string | null {
  if (!Array.isArray(value)) {
    return null
  }

  for (const item of value) {
    const record =
      asRecord(item)

    if (!record) continue

    const name =
      optionalString(
        record.name,
      )

    if (name) {
      return name
    }
  }

  return null
}

function normalizeWhitespace(
  value: string,
): string {
  return value
    .replace(/\s+/g, " ")
    .trim()
}

function stripHtml(
  value: string,
): string {
  return normalizeWhitespace(
    value.replace(
      /<[^>]*>/g,
      " ",
    ),
  )
}

function normalizeFingerprintPart(
  value: string | null,
): string {
  return (value ?? "")
    .normalize("NFKD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim()
}

function hash(
  value: string,
): string {
  return createHash("sha256")
    .update(value)
    .digest("hex")
}

function validateContext(
  context: DiscoverySourceContext,
): DiscoverySourceContext {
  const company =
    normalizeWhitespace(
      context.company,
    )

  const boardKey =
    normalizeWhitespace(
      context.boardKey,
    )

  if (!company) {
    throw new Error(
      "Discovery source company is required.",
    )
  }

  if (!boardKey) {
    throw new Error(
      "Discovery source boardKey is required.",
    )
  }

  return {
    company,
    boardKey,
  }
}

function parseDate(
  value: unknown,
): Date | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    const parsed =
      new Date(value)

    return Number.isNaN(
      parsed.getTime(),
    )
      ? null
      : parsed
  }

  const text =
    scalarString(value)

  if (!text) {
    return null
  }

  const parsed =
    new Date(text)

  return Number.isNaN(
    parsed.getTime(),
  )
    ? null
    : parsed
}

function makeSourceKey(
  provider: DiscoveryProvider,
  boardKey: string,
  externalId: string,
): string {
  return hash(
    [
      provider,
      normalizeFingerprintPart(
        boardKey,
      ),
      externalId.trim(),
    ].join("|"),
  )
}

export function buildDiscoveryFingerprint({
  title,
  company,
  location,
}: {
  title: string
  company: string
  location?: string | null
}): string {
  return hash(
    [
      normalizeFingerprintPart(
        title,
      ),
      normalizeFingerprintPart(
        company,
      ),
      normalizeFingerprintPart(
        location ?? null,
      ),
    ].join("|"),
  )
}

function buildNormalizedJob({
  provider,
  context,
  externalId,
  title,
  location,
  department,
  employmentType,
  workplaceType,
  description,
  sourceUrl,
  applyUrl,
  publishedAt,
  rawPayload,
}: {
  provider: DiscoveryProvider
  context: DiscoverySourceContext
  externalId: string
  title: string
  location: string | null
  department: string | null
  employmentType: string | null
  workplaceType: string | null
  description: string
  sourceUrl: string
  applyUrl: string | null
  publishedAt: Date | null
  rawPayload: UnknownRecord
}): NormalizedDiscoveredJob | null {
  const cleanContext =
    validateContext(context)

  const cleanExternalId =
    normalizeWhitespace(
      externalId,
    )

  const cleanTitle =
    normalizeWhitespace(
      title,
    )

  const cleanDescription =
    normalizeWhitespace(
      description,
    )

  const cleanSourceUrl =
    sourceUrl.trim()

  if (
    !cleanExternalId ||
    !cleanTitle ||
    !cleanSourceUrl
  ) {
    return null
  }

  const cleanLocation =
    location
      ? normalizeWhitespace(
          location,
        )
      : null

  return {
    provider,

    sourceKey:
      makeSourceKey(
        provider,
        cleanContext.boardKey,
        cleanExternalId,
      ),

    externalId:
      cleanExternalId,

    boardKey:
      cleanContext.boardKey,

    title:
      cleanTitle,

    company:
      cleanContext.company,

    location:
      cleanLocation,

    department:
      department
        ? normalizeWhitespace(
            department,
          )
        : null,

    employmentType:
      employmentType
        ? normalizeWhitespace(
            employmentType,
          )
        : null,

    workplaceType:
      workplaceType
        ? normalizeWhitespace(
            workplaceType,
          )
        : null,

    description:
      cleanDescription,

    sourceUrl:
      cleanSourceUrl,

    applyUrl:
      applyUrl?.trim() ||
      null,

    fingerprint:
      buildDiscoveryFingerprint({
        title:
          cleanTitle,

        company:
          cleanContext.company,

        location:
          cleanLocation,
      }),

    publishedAt,
    rawPayload,
  }
}

export function normalizeGreenhouseJob(
  input: unknown,
  context: DiscoverySourceContext,
): NormalizedDiscoveredJob | null {
  const record =
    asRecord(input)

  if (!record) {
    return null
  }

  const location =
    nestedString(
      record.location,
      "name",
    )

  const department =
    firstNamedValue(
      record.departments,
    )

  return buildNormalizedJob({
    provider:
      "GREENHOUSE",

    context,

    externalId:
      scalarString(
        record.id,
      ),

    title:
      scalarString(
        record.title,
      ),

    location,

    department,

    employmentType:
      null,

    workplaceType:
      null,

    description:
      stripHtml(
        scalarString(
          record.content,
        ),
      ),

    sourceUrl:
      scalarString(
        record.absolute_url,
      ),

    applyUrl:
      optionalString(
        record.absolute_url,
      ),

    publishedAt:
      parseDate(
        record.updated_at,
      ),

    rawPayload:
      record,
  })
}

export function normalizeLeverJob(
  input: unknown,
  context: DiscoverySourceContext,
): NormalizedDiscoveredJob | null {
  const record =
    asRecord(input)

  if (!record) {
    return null
  }

  const categories =
    asRecord(
      record.categories,
    )

  const descriptionParts = [
    scalarString(
      record.descriptionPlain,
    ),
    scalarString(
      record.additionalPlain,
    ),
  ].filter(Boolean)

  return buildNormalizedJob({
    provider:
      "LEVER",

    context,

    externalId:
      scalarString(
        record.id,
      ),

    title:
      scalarString(
        record.text,
      ),

    location:
      optionalString(
        categories?.location,
      ),

    department:
      optionalString(
        categories?.team,
      ),

    employmentType:
      optionalString(
        categories?.commitment,
      ),

    workplaceType:
      optionalString(
        record.workplaceType,
      ),

    description:
      descriptionParts.join(
        "\n\n",
      ),

    sourceUrl:
      scalarString(
        record.hostedUrl,
      ),

    applyUrl:
      optionalString(
        record.applyUrl,
      ),

    publishedAt:
      parseDate(
        record.createdAt,
      ),

    rawPayload:
      record,
  })
}

export function normalizeAshbyJob(
  input: unknown,
  context: DiscoverySourceContext,
): NormalizedDiscoveredJob | null {
  const record =
    asRecord(input)

  if (!record) {
    return null
  }

  const sourceUrl =
    scalarString(
      record.jobUrl,
    )

  return buildNormalizedJob({
    provider:
      "ASHBY",

    context,

    externalId:
      scalarString(
        record.id,
      ) ||
      sourceUrl,

    title:
      scalarString(
        record.title,
      ),

    location:
      optionalString(
        record.location,
      ),

    department:
      optionalString(
        record.department,
      ) ??
      optionalString(
        record.team,
      ),

    employmentType:
      optionalString(
        record.employmentType,
      ),

    workplaceType:
      optionalString(
        record.workplaceType,
      ),

    description:
      scalarString(
        record.descriptionPlain,
      ) ||
      stripHtml(
        scalarString(
          record.descriptionHtml,
        ),
      ),

    sourceUrl,

    applyUrl:
      optionalString(
        record.applyUrl,
      ),

    publishedAt:
      parseDate(
        record.publishedAt,
      ),

    rawPayload:
      record,
  })
}

export function normalizeDiscoveryJob(
  provider: DiscoveryProvider,
  input: unknown,
  context: DiscoverySourceContext,
): NormalizedDiscoveredJob | null {
  switch (provider) {
    case "GREENHOUSE":
      return normalizeGreenhouseJob(
        input,
        context,
      )

    case "LEVER":
      return normalizeLeverJob(
        input,
        context,
      )

    case "ASHBY":
      return normalizeAshbyJob(
        input,
        context,
      )
    case "OTHER":
      return null
  }
}

function canonicalQuality(
  job: NormalizedDiscoveredJob,
): number {
  let score =
    Math.min(
      job.description.length,
      10_000,
    )

  if (job.applyUrl) {
    score += 1_000
  }

  if (job.publishedAt) {
    score += 500
  }

  if (job.department) {
    score += 100
  }

  if (job.employmentType) {
    score += 100
  }

  if (job.workplaceType) {
    score += 100
  }

  return score
}

export function clusterDiscoveredJobs(
  jobs: readonly NormalizedDiscoveredJob[],
): DiscoveryCluster[] {
  const groups =
    new Map<
      string,
      NormalizedDiscoveredJob[]
    >()

  for (const job of jobs) {
    const existing =
      groups.get(
        job.fingerprint,
      )

    if (existing) {
      existing.push(job)
    } else {
      groups.set(
        job.fingerprint,
        [job],
      )
    }
  }

  const clusters:
    DiscoveryCluster[] = []

  for (
    const [
      fingerprint,
      sources,
    ] of groups
  ) {

    const ranked =
      [...sources].sort(
        (left, right) => {
          const delta =
            canonicalQuality(
              right,
            ) -
            canonicalQuality(
              left,
            )

          if (delta !== 0) {
            return delta
          }

          return left.sourceKey.localeCompare(
            right.sourceKey,
          )
        },
      )

    const canonical =
      ranked[0]

    if (!canonical) {
      continue
    }

    clusters.push({
      fingerprint,
      canonical,
      sources:
        ranked,
    })
  }

  return clusters.sort(
    (left, right) =>
      left.fingerprint.localeCompare(
        right.fingerprint,
      ),
  )
}