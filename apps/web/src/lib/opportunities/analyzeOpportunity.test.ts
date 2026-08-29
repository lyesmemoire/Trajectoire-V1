import {
  describe,
  expect,
  it,
} from "vitest"

import {
  analyzeOpportunity,
} from "./analyzeOpportunity"

describe("analyzeOpportunity", () => {
  it("is deterministic for identical inputs", () => {
    const input = {
      cvText: `
        Senior Product Manager.
        Product strategy, roadmap, discovery, analytics,
        SaaS B2B, stakeholder management, team leadership.
      `,
      jobTitle: "Senior Product Manager",
      jobDescription: `
        We are looking for a Senior Product Manager
        responsible for product strategy, roadmap,
        discovery, analytics, SaaS B2B,
        stakeholder management and team leadership.
      `,
    }

    const first =
      analyzeOpportunity(input)

    const second =
      analyzeOpportunity(input)

    expect(second).toEqual(first)
  })

  it("keeps every score between 0 and 100", () => {
    const result =
      analyzeOpportunity({
        cvText: `
          Product manager with React, TypeScript,
          SaaS, analytics and customer discovery experience.
        `,
        jobTitle:
          "Senior Product Manager",
        jobDescription: `
          Product strategy, SaaS, analytics,
          customer discovery, leadership,
          roadmap and stakeholder management.
        `,
      })

    const scores = [
      result.matchScore,
      result.skillsScore,
      result.experienceScore,
      result.seniorityScore,
      result.relevanceScore,
      result.potentialScore,
    ]

    for (const score of scores) {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    }
  })

  it("never reports a potential score below the current score", () => {
    const result =
      analyzeOpportunity({
        cvText: `
          JavaScript React TypeScript Node.js.
          Product, project and customer experience.
        `,
        jobTitle:
          "Full Stack Engineer",
        jobDescription: `
          React TypeScript Node.js PostgreSQL
          Docker AWS API SaaS.
        `,
      })

    expect(
      result.potentialScore,
    ).toBeGreaterThanOrEqual(
      result.matchScore,
    )
  })

  it("maps recommendation to the score thresholds", () => {
    const scenarios = [
      {
        cvText: `
          Senior product manager.
          Product strategy roadmap discovery analytics.
          Management leadership team stakeholder.
          SaaS B2B customer product project.
          React TypeScript SQL.
        `,
        jobTitle:
          "Senior Product Manager",
        jobDescription: `
          Senior product manager.
          Product strategy roadmap discovery analytics.
          Management leadership team stakeholder.
          SaaS B2B customer product project.
          React TypeScript SQL.
        `,
      },

      {
        cvText: `
          Marketing coordinator.
          Content campaigns communication.
        `,
        jobTitle:
          "Senior Platform Engineer",
        jobDescription: `
          Senior software engineering leadership.
          Kubernetes Terraform AWS Docker
          TypeScript Node.js PostgreSQL Redis.
        `,
      },

      {
        cvText: `
          Product manager SaaS analytics
          roadmap customer discovery.
        `,
        jobTitle:
          "Product Manager",
        jobDescription: `
          Product management SaaS analytics roadmap,
          customer discovery, stakeholder management,
          strategy and execution.
        `,
      },
    ]

    for (const scenario of scenarios) {
      const result =
        analyzeOpportunity(scenario)

      const expected =
        result.matchScore >= 80
          ? "APPLY"
          : result.matchScore >= 60
            ? "CAUTION"
            : "SKIP"

      expect(
        result.recommendation,
      ).toBe(expected)
    }
  })

  it("identifies missing requirements instead of treating them as candidate skills", () => {
    const result =
      analyzeOpportunity({
        cvText: `
          Software engineer with React
          and TypeScript experience.
        `,
        jobTitle:
          "Cloud Full Stack Engineer",
        jobDescription: `
          React TypeScript Kubernetes
          Terraform AWS Docker PostgreSQL.
        `,
      })

    expect(
      result.missingKeywords.length,
    ).toBeGreaterThan(0)

    expect(
      result.matchedKeywords,
    ).toContain("react")

    expect(
      result.missingKeywords.some(
        (keyword) =>
          [
            "kubernetes",
            "terraform",
            "aws",
            "docker",
            "postgresql",
          ].includes(keyword),
      ),
    ).toBe(true)
  })

  it("produces a strong recommendation for a highly aligned profile", () => {
    const sharedText = `
      Senior Product Manager.
      Product strategy roadmap discovery execution.
      Leadership management team stakeholder.
      Customer SaaS B2B analytics product project.
      React TypeScript SQL API.
    `

    const result =
      analyzeOpportunity({
        cvText: sharedText,
        jobTitle:
          "Senior Product Manager",
        jobDescription:
          sharedText,
      })

    expect(
      result.matchScore,
    ).toBeGreaterThanOrEqual(80)

    expect(
      result.recommendation,
    ).toBe("APPLY")

    expect(
      result.strengths.length,
    ).toBeGreaterThan(0)
  })
})