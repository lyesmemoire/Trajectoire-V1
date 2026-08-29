import {
  describe,
  expect,
  it,
} from "vitest"

import {
  buildAshbyUrl,
  buildGreenhouseUrl,
  buildLeverUrl,
} from "./connectors"

describe(
  "Discovery connector URLs",
  () => {
    it(
      "builds the Greenhouse public endpoint",
      () => {
        expect(
          buildGreenhouseUrl(
            "acme",
          ),
        ).toBe(
          "https://boards-api.greenhouse.io/v1/boards/acme/jobs?content=true",
        )
      },
    )

    it(
      "builds the Lever public endpoint",
      () => {
        expect(
          buildLeverUrl(
            "acme",
          ),
        ).toBe(
          "https://api.lever.co/v0/postings/acme?mode=json",
        )
      },
    )

    it(
      "builds the Ashby public endpoint",
      () => {
        expect(
          buildAshbyUrl(
            "acme",
          ),
        ).toBe(
          "https://api.ashbyhq.com/posting-api/job-board/acme",
        )
      },
    )

    it(
      "rejects unsafe board keys",
      () => {
        expect(
          () =>
            buildGreenhouseUrl(
              "../evil",
            ),
        ).toThrow(
          "Invalid discovery board key.",
        )
      },
    )
  },
)