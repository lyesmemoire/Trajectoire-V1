import type {
  DiscoveryProvider,
  DiscoverySourceContext,
  NormalizedDiscoveredJob,
} from "./types"

import {
  normalizeAshbyJob,
  normalizeGreenhouseJob,
  normalizeLeverJob,
} from "./normalizeDiscoveryJob"

const FETCH_TIMEOUT_MS = 10_000
const MAX_RESPONSE_BYTES = 5_000_000
const BOARD_KEY_PATTERN = /^[a-zA-Z0-9_-]{1,120}$/

type UnknownRecord = Record<string, unknown>

export type DiscoveryConnectorRequest = {
  provider: DiscoveryProvider
  company: string
  boardKey: string
}

export type DiscoveryConnectorResult = {
  provider: DiscoveryProvider
  company: string
  boardKey: string
  jobs: NormalizedDiscoveredJob[]
  rawCount: number
  rejectedCount: number
}

function assertBoardKey(
  boardKey: string,
): string {
  const value = boardKey.trim()

  if (!BOARD_KEY_PATTERN.test(value)) {
    throw new Error(
      "Invalid discovery board key.",
    )
  }

  return value
}

function assertCompany(
  company: string,
): string {
  const value = company.trim()

  if (
    value.length < 1 ||
    value.length > 200
  ) {
    throw new Error(
      "Invalid discovery company.",
    )
  }

  return value
}

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

async function fetchJson(
  url: string,
): Promise<unknown> {
  const controller =
    new AbortController()

  const timeout =
    setTimeout(
      () => controller.abort(),
      FETCH_TIMEOUT_MS,
    )

  try {
    const response =
      await fetch(url, {
        method: "GET",

        headers: {
          Accept: "application/json",
          "User-Agent": "Trajectoire-Discovery/1.0",
        },

        cache: "no-store",
        redirect: "follow",
        signal: controller.signal,
      })

    if (!response.ok) {
      throw new Error(
        `Discovery provider returned ${response.status}.`,
      )
    }

    const contentLength =
      response.headers.get(
        "content-length",
      )

    if (contentLength) {
      const parsed =
        Number(contentLength)

      if (
        Number.isFinite(parsed) &&
        parsed > MAX_RESPONSE_BYTES
      ) {
        throw new Error(
          "Discovery provider response is too large.",
        )
      }
    }

    const text =
      await response.text()

    if (
      Buffer.byteLength(
        text,
        "utf8",
      ) > MAX_RESPONSE_BYTES
    ) {
      throw new Error(
        "Discovery provider response is too large.",
      )
    }

    try {
      return JSON.parse(text)
    } catch {
      throw new Error(
        "Discovery provider returned invalid JSON.",
      )
    }
  }
  catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "Discovery provider request timed out.",
      )
    }

    throw error
  }
  finally {
    clearTimeout(timeout)
  }
}

export function buildGreenhouseUrl(
  boardKey: string,
): string {
  const key =
    assertBoardKey(boardKey)

  return (
    "https://boards-api.greenhouse.io/" +
    `v1/boards/${encodeURIComponent(key)}/jobs?content=true`
  )
}

export function buildLeverUrl(
  boardKey: string,
): string {
  const key =
    assertBoardKey(boardKey)

  return (
    "https://api.lever.co/" +
    `v0/postings/${encodeURIComponent(key)}?mode=json`
  )
}

export function buildAshbyUrl(
  boardKey: string,
): string {
  const key =
    assertBoardKey(boardKey)

  return (
    "https://api.ashbyhq.com/" +
    `posting-api/job-board/${encodeURIComponent(key)}`
  )
}

export async function fetchGreenhouseJobs(
  context: DiscoverySourceContext,
): Promise<DiscoveryConnectorResult> {
  const company =
    assertCompany(context.company)

  const boardKey =
    assertBoardKey(context.boardKey)

  const payload =
    await fetchJson(
      buildGreenhouseUrl(boardKey),
    )

  const record =
    asRecord(payload)

  const rawJobs =
    Array.isArray(record?.jobs)
      ? record.jobs
      : []

  const jobs =
    rawJobs
      .map((job) =>
        normalizeGreenhouseJob(
          job,
          {
            company,
            boardKey,
          },
        ),
      )
      .filter(
        (
          job,
        ): job is NormalizedDiscoveredJob =>
          job !== null,
      )

  return {
    provider: "GREENHOUSE",
    company,
    boardKey,
    jobs,
    rawCount: rawJobs.length,
    rejectedCount:
      rawJobs.length - jobs.length,
  }
}

export async function fetchLeverJobs(
  context: DiscoverySourceContext,
): Promise<DiscoveryConnectorResult> {
  const company =
    assertCompany(context.company)

  const boardKey =
    assertBoardKey(context.boardKey)

  const payload =
    await fetchJson(
      buildLeverUrl(boardKey),
    )

  const rawJobs =
    Array.isArray(payload)
      ? payload
      : []

  const jobs =
    rawJobs
      .map((job) =>
        normalizeLeverJob(
          job,
          {
            company,
            boardKey,
          },
        ),
      )
      .filter(
        (
          job,
        ): job is NormalizedDiscoveredJob =>
          job !== null,
      )

  return {
    provider: "LEVER",
    company,
    boardKey,
    jobs,
    rawCount: rawJobs.length,
    rejectedCount:
      rawJobs.length - jobs.length,
  }
}

export async function fetchAshbyJobs(
  context: DiscoverySourceContext,
): Promise<DiscoveryConnectorResult> {
  const company =
    assertCompany(context.company)

  const boardKey =
    assertBoardKey(context.boardKey)

  const payload =
    await fetchJson(
      buildAshbyUrl(boardKey),
    )

  const record =
    asRecord(payload)

  const rawJobs =
    Array.isArray(record?.jobs)
      ? record.jobs
      : []

  const jobs =
    rawJobs
      .map((job) =>
        normalizeAshbyJob(
          job,
          {
            company,
            boardKey,
          },
        ),
      )
      .filter(
        (
          job,
        ): job is NormalizedDiscoveredJob =>
          job !== null,
      )

  return {
    provider: "ASHBY",
    company,
    boardKey,
    jobs,
    rawCount: rawJobs.length,
    rejectedCount:
      rawJobs.length - jobs.length,
  }
}

export async function fetchDiscoveryJobs({
  provider,
  company,
  boardKey,
}: DiscoveryConnectorRequest): Promise<DiscoveryConnectorResult> {
  const context = {
    company,
    boardKey,
  }

  switch (provider) {
    case "GREENHOUSE":
      return fetchGreenhouseJobs(
        context,
      )

    case "LEVER":
      return fetchLeverJobs(
        context,
      )

    case "ASHBY":
      return fetchAshbyJobs(
        context,
      )
    case "OTHER":
      throw new Error(
        "Unsupported discovery provider.",
      )
  }
}