import { describe, it, expect, beforeEach } from "vitest";
import { TemporalExtractor } from "../../apps/web/src/lib/ai/engines/temporal/TemporalExtractor";
import { TemporalExtractionValidator } from "../../apps/web/src/lib/ai/engines/temporal/TemporalExtractionValidator";
import { TemporalCatalogProvider } from "../../apps/web/src/lib/ai/catalogs/TemporalCatalogProvider";
import { TimelineBuilder } from "../../apps/web/src/lib/ai/engines/temporal/TimelineBuilder";
import { TemporalValidator } from "../../apps/web/src/lib/ai/engines/temporal/TemporalValidator";

describe("Phase A.12 - Temporal Runtime Tests", () => {
  describe("TemporalExtractor", () => {
    let extractor: TemporalExtractor;
    let catalogProvider: TemporalCatalogProvider;
    let validator: TemporalExtractionValidator;

    beforeEach(() => {
      catalogProvider = new TemporalCatalogProvider();
      validator = new TemporalExtractionValidator(catalogProvider);
      extractor = new TemporalExtractor(validator, "1.0.0", "openai");
    });

    it("should extract temporal information from observations", async () => {
      const input = {
        observations: [
          {
            id: "obs-1",
            data: {
              content: "I worked at Google for 3 years starting in 2018.",
            },
          },
          {
            id: "obs-2",
            data: {
              content: "I migrated 180 microservices in 2020.",
            },
          },
        ],
        sessionId: "test-session",
      };

      const result = await extractor.extract(input);

      expect(result.events.length).toBeGreaterThan(0);
      expect(result.timeline.length).toBeGreaterThan(0);
      expect(result.metadata.totalEvents).toBeGreaterThan(0);
    });

    it("should extract temporal expressions", async () => {
      const input = {
        observations: [
          {
            id: "obs-1",
            data: {
              content: "I worked for 5 years and 6 months.",
            },
          },
        ],
        sessionId: "test-session",
      };

      const result = await extractor.extract(input);

      expect(result.events[0].temporalExpressions).toContain("5 years");
      expect(result.events[0].temporalExpressions).toContain("6 months");
    });

    it("should parse timestamps from content", async () => {
      const input = {
        observations: [
          {
            id: "obs-1",
            data: {
              content: "I started working in 2019.",
            },
          },
        ],
        sessionId: "test-session",
      };

      const result = await extractor.extract(input);

      expect(result.events[0].timestamp).toBeDefined();
      expect(result.events[0].timestamp?.getFullYear()).toBe(2019);
    });

    it("should parse duration from content", async () => {
      const input = {
        observations: [
          {
            id: "obs-1",
            data: {
              content: "I worked for 2 years.",
            },
          },
        ],
        sessionId: "test-session",
      };

      const result = await extractor.extract(input);

      expect(result.events[0].duration).toBeDefined();
      expect(result.events[0].duration).toBeGreaterThan(0);
    });

    it("should infer event type from content", async () => {
      const input = {
        observations: [
          {
            id: "obs-1",
            data: {
              content: "I worked at Google in 2019.",
            },
          },
        ],
        sessionId: "test-session",
      };

      const result = await extractor.extract(input);

      expect(result.events[0].eventType).toBe("employment");
    });

    it("should return prompt version and provider", () => {
      expect(extractor.getPromptVersion()).toBe("1.0.0");
      expect(extractor.getProvider()).toBe("openai");
    });
  });

  describe("TimelineBuilder", () => {
    let builder: TimelineBuilder;

    beforeEach(() => {
      builder = new TimelineBuilder();
    });

    it("should build timeline from events", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "project",
          timestamp: new Date("2020-01-01"),
          description: "Migrated microservices",
          confidence: 0.85,
          temporalExpressions: ["2020"],
        },
      ];

      const timeline = builder.build(events);

      expect(timeline.nodes.length).toBe(2);
      expect(timeline.edges.length).toBeGreaterThan(0);
      expect(timeline.metadata.totalNodes).toBe(2);
    });

    it("should create sequential edges", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          endDate: new Date("2019-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "employment",
          timestamp: new Date("2019-01-01"),
          endDate: new Date("2020-01-01"),
          description: "Worked at Microsoft",
          confidence: 0.85,
          temporalExpressions: ["2019"],
        },
      ];

      const timeline = builder.build(events);

      const sequentialEdges = builder.findSequential(timeline);
      expect(sequentialEdges.length).toBeGreaterThan(0);
    });

    it("should detect overlapping events", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          endDate: new Date("2020-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "employment",
          timestamp: new Date("2019-06-01"),
          endDate: new Date("2021-06-01"),
          description: "Worked at Microsoft",
          confidence: 0.85,
          temporalExpressions: ["2019"],
        },
      ];

      const timeline = builder.build(events);

      const overlaps = builder.findOverlaps(timeline);
      expect(overlaps.length).toBeGreaterThan(0);
    });

    it("should detect gaps in timeline", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          endDate: new Date("2019-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "employment",
          timestamp: new Date("2020-06-01"),
          endDate: new Date("2021-06-01"),
          description: "Worked at Microsoft",
          confidence: 0.85,
          temporalExpressions: ["2020"],
        },
      ];

      const timeline = builder.build(events);

      const gaps = builder.findGaps(timeline);
      expect(gaps.length).toBeGreaterThan(0);
    });

    it("should calculate timeline statistics", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "project",
          timestamp: new Date("2020-01-01"),
          description: "Migrated microservices",
          confidence: 0.85,
          temporalExpressions: ["2020"],
        },
      ];

      const timeline = builder.build(events);
      const stats = builder.getStatistics(timeline);

      expect(stats.totalEvents).toBe(2);
      expect(stats.withTimestamp).toBe(2);
      expect(stats.averageConfidence).toBeGreaterThan(0);
    });
  });

  describe("TemporalValidator", () => {
    let validator: TemporalValidator;
    let builder: TimelineBuilder;

    beforeEach(() => {
      validator = new TemporalValidator();
      builder = new TimelineBuilder();
    });

    it("should validate timeline with no violations", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          endDate: new Date("2019-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "employment",
          timestamp: new Date("2019-01-01"),
          endDate: new Date("2020-01-01"),
          description: "Worked at Microsoft",
          confidence: 0.85,
          temporalExpressions: ["2019"],
        },
      ];

      const timeline = builder.build(events);
      const result = validator.validate(timeline);

      expect(result.isValid).toBe(true);
      expect(result.violations.length).toBe(0);
    });

    it("should detect overlapping employment violations", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          endDate: new Date("2020-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "employment",
          timestamp: new Date("2019-06-01"),
          endDate: new Date("2021-06-01"),
          description: "Worked at Microsoft",
          confidence: 0.85,
          temporalExpressions: ["2019"],
        },
      ];

      const timeline = builder.build(events);
      const result = validator.validate(timeline);

      expect(result.isValid).toBe(false);
      expect(result.violations.length).toBeGreaterThan(0);
      const overlapViolation = result.violations.find(v => v.type === "overlap");
      expect(overlapViolation).toBeDefined();
    });

    it("should detect impossible date violations", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2020-01-01"),
          endDate: new Date("2019-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2020"],
        },
      ];

      const timeline = builder.build(events);
      const result = validator.validate(timeline);

      expect(result.isValid).toBe(false);
      const impossibleViolation = result.violations.find(v => v.type === "impossible");
      expect(impossibleViolation).toBeDefined();
    });

    it("should detect gap violations", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          endDate: new Date("2019-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "employment",
          timestamp: new Date("2021-01-01"),
          endDate: new Date("2022-01-01"),
          description: "Worked at Microsoft",
          confidence: 0.85,
          temporalExpressions: ["2021"],
        },
      ];

      const timeline = builder.build(events);
      const result = validator.validate(timeline);

      const gapViolation = result.violations.find(v => v.type === "gap");
      expect(gapViolation).toBeDefined();
    });

    it("should generate warnings for low confidence events", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          description: "Worked at Google",
          confidence: 0.3,
          temporalExpressions: ["2018"],
        },
      ];

      const timeline = builder.build(events);
      const result = validator.validate(timeline);

      const confidenceWarning = result.warnings.find(w => w.type === "low_confidence");
      expect(confidenceWarning).toBeDefined();
    });

    it("should generate warnings for missing timestamps", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: [],
        },
      ];

      const timeline = builder.build(events);
      const result = validator.validate(timeline);

      const timestampWarning = result.warnings.find(w => w.type === "missing_timestamp");
      expect(timestampWarning).toBeDefined();
    });

    it("should include ruleId and ruleVersion in violations", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          endDate: new Date("2020-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "employment",
          timestamp: new Date("2019-06-01"),
          endDate: new Date("2021-06-01"),
          description: "Worked at Microsoft",
          confidence: 0.85,
          temporalExpressions: ["2019"],
        },
      ];

      const timeline = builder.build(events);
      const result = validator.validate(timeline);

      const violation = result.violations[0];
      expect(violation.ruleId).toBeDefined();
      expect(violation.ruleId).toMatch(/^TEMPORAL-\d+$/);
      expect(violation.ruleVersion).toBeDefined();
      expect(violation.ruleVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("should calculate validation statistics", () => {
      const events = [
        {
          id: "event-1",
          observationId: "obs-1",
          eventType: "employment",
          timestamp: new Date("2018-01-01"),
          endDate: new Date("2020-01-01"),
          description: "Worked at Google",
          confidence: 0.9,
          temporalExpressions: ["2018"],
        },
        {
          id: "event-2",
          observationId: "obs-2",
          eventType: "employment",
          timestamp: new Date("2019-06-01"),
          endDate: new Date("2021-06-01"),
          description: "Worked at Microsoft",
          confidence: 0.85,
          temporalExpressions: ["2019"],
        },
      ];

      const timeline = builder.build(events);
      const result = validator.validate(timeline);
      const stats = validator.getStatistics(result);

      expect(stats.totalViolations).toBeGreaterThan(0);
      expect(stats.isValid).toBe(false);
    });
  });
});
