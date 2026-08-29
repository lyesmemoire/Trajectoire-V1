import {
  describe,
  expect,
  it,
} from "vitest"

import {
  buildDiscoveryFingerprint,
  clusterDiscoveredJobs,
  normalizeAshbyJob,
  normalizeGreenhouseJob,
  normalizeLeverJob,
} from "./normalizeDiscoveryJob"

describe(
  "Discovery normalization",
  () => {
    it(
      "normalizes Greenhouse",
      () => {
        const job =
          normalizeGreenhouseJob(
            {
              id:
                12345,

              title:
                "Senior Product Manager",

              absolute_url:
                "https://boards.greenhouse.io/acme/jobs/12345",

              location: {
                name:
                  "Paris, France",
              },

              departments: [
                {
                  name:
                    "Product",
                },
              ],

              content:
                "<p>Build the next generation platform.</p>",
            },
            {
              company:
                "Acme",

              boardKey:
                "acme",
            },
          )

        expect(job).not.toBeNull()

        expect(job).toMatchObject({
          provider:
            "GREENHOUSE",

          externalId:
            "12345",

          company:
            "Acme",

          location:
            "Paris, France",

          department:
            "Product",

          description:
            "Build the next generation platform.",
        })
      },
    )

    it(
      "normalizes Lever",
      () => {
        const job =
          normalizeLeverJob(
            {
              id:
                "lever-42",

              text:
                "Lead Product Manager",

              hostedUrl:
                "https://jobs.lever.co/acme/lever-42",

              applyUrl:
                "https://jobs.lever.co/acme/lever-42/apply",

              createdAt:
                1_700_000_000_000,

              categories: {
                location:
                  "Paris",

                team:
                  "Product",

                commitment:
                  "Full-time",
              },

              workplaceType:
                "hybrid",

              descriptionPlain:
                "Lead product strategy.",
            },
            {
              company:
                "Acme",

              boardKey:
                "acme",
            },
          )

        expect(job).not.toBeNull()

        expect(job).toMatchObject({
          provider:
            "LEVER",

          employmentType:
            "Full-time",

          workplaceType:
            "hybrid",
        })

        expect(
          job?.publishedAt,
        ).toBeInstanceOf(Date)
      },
    )

    it(
      "normalizes Ashby",
      () => {
        const job =
          normalizeAshbyJob(
            {
              id:
                "ashby-42",

              title:
                "Product Manager",

              location:
                "Paris",

              department:
                "Product",

              workplaceType:
                "Hybrid",

              employmentType:
                "FullTime",

              descriptionPlain:
                "Own the product roadmap.",

              publishedAt:
                "2026-08-20T10:00:00.000Z",

              jobUrl:
                "https://jobs.ashbyhq.com/acme/product-manager",

              applyUrl:
                "https://jobs.ashbyhq.com/acme/product-manager/application",
            },
            {
              company:
                "Acme",

              boardKey:
                "acme",
            },
          )

        expect(job).not.toBeNull()

        expect(job).toMatchObject({
          provider:
            "ASHBY",

          externalId:
            "ashby-42",

          title:
            "Product Manager",

          location:
            "Paris",

          department:
            "Product",
        })
      },
    )

    it(
      "normalizes accents and punctuation in fingerprints",
      () => {
        const first =
          buildDiscoveryFingerprint({
            title:
              "Développeur Full-Stack",

            company:
              "Éxample SAS",

            location:
              "Paris, France",
          })

        const second =
          buildDiscoveryFingerprint({
            title:
              "Developpeur Full Stack",

            company:
              "Example SAS",

            location:
              "Paris France",
          })

        expect(first).toBe(
          second,
        )
      },
    )

    it(
      "clusters duplicates across ATS providers",
      () => {
        const greenhouse =
          normalizeGreenhouseJob(
            {
              id:
                1,

              title:
                "Product Manager",

              absolute_url:
                "https://boards.greenhouse.io/acme/jobs/1",

              location: {
                name:
                  "Paris",
              },

              content:
                "<p>Own product.</p>",
            },
            {
              company:
                "Acme",

              boardKey:
                "acme",
            },
          )

        const ashby =
          normalizeAshbyJob(
            {
              id:
                "ashby-product",

              title:
                "Product Manager",

              location:
                "Paris",

              descriptionPlain:
                "Own the product roadmap and strategy.",

              publishedAt:
                "2026-08-20T10:00:00.000Z",

              jobUrl:
                "https://jobs.ashbyhq.com/acme/product-manager",

              applyUrl:
                "https://jobs.ashbyhq.com/acme/product-manager/application",
            },
            {
              company:
                "Acme",

              boardKey:
                "acme",
            },
          )

        expect(
          greenhouse,
        ).not.toBeNull()

        expect(
          ashby,
        ).not.toBeNull()

        const clusters =
          clusterDiscoveredJobs(
            [
              greenhouse!,
              ashby!,
            ],
          )

        expect(clusters).toHaveLength(
          1,
        )

        expect(
          clusters[0]?.sources,
        ).toHaveLength(
          2,
        )

        expect(
          clusters[0]?.canonical.provider,
        ).toBe(
          "ASHBY",
        )
      },
    )
  },
)