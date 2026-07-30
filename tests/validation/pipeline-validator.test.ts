import { describe, it, expect, beforeEach } from "vitest";
import { PipelineValidator, EngineCapability } from "../../apps/web/src/lib/ai/validation/PipelineValidator";

describe("PipelineValidator", () => {
  let validator: PipelineValidator;

  beforeEach(() => {
    validator = new PipelineValidator();
  });

  describe("validatePipeline", () => {
    it("should validate a valid pipeline", () => {
      const engines: EngineCapability[] = [
        {
          engineId: "observation",
          engineVersion: "1.0.0",
          produces: ["OBSERVATION_FACT"],
          consumes: [],
        },
        {
          engineId: "evidence",
          engineVersion: "1.0.0",
          produces: ["EVIDENCE_FACT"],
          consumes: ["OBSERVATION_FACT"],
        },
        {
          engineId: "contradiction",
          engineVersion: "1.0.0",
          produces: ["CONTRADICTION_FACT"],
          consumes: ["EVIDENCE_FACT"],
        },
      ];

      const result = validator.validatePipeline(engines);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing producer", () => {
      const engines: EngineCapability[] = [
        {
          engineId: "contradiction",
          engineVersion: "1.0.0",
          produces: ["CONTRADICTION_FACT"],
          consumes: ["EVIDENCE_FACT"],
        },
      ];

      const result = validator.validatePipeline(engines);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe("missing_producer");
      expect(result.errors[0].factType).toBe("EVIDENCE_FACT");
    });

    it("should detect unused producer as warning", () => {
      const engines: EngineCapability[] = [
        {
          engineId: "observation",
          engineVersion: "1.0.0",
          produces: ["OBSERVATION_FACT"],
          consumes: [],
        },
        {
          engineId: "evidence",
          engineVersion: "1.0.0",
          produces: ["EVIDENCE_FACT", "UNUSED_FACT"],
          consumes: ["OBSERVATION_FACT"],
        },
        {
          engineId: "contradiction",
          engineVersion: "1.0.0",
          produces: ["CONTRADICTION_FACT"],
          consumes: ["EVIDENCE_FACT"],
        },
      ];

      const result = validator.validatePipeline(engines);

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThanOrEqual(1);
      const unusedFactWarning = result.warnings.find(w => w.factType === "UNUSED_FACT");
      expect(unusedFactWarning).toBeDefined();
      expect(unusedFactWarning?.type).toBe("unused_producer");
    });

    it("should detect circular dependency", () => {
      const engines: EngineCapability[] = [
        {
          engineId: "engine-a",
          engineVersion: "1.0.0",
          produces: ["FACT_A"],
          consumes: ["FACT_B"],
        },
        {
          engineId: "engine-b",
          engineVersion: "1.0.0",
          produces: ["FACT_B"],
          consumes: ["FACT_A"],
        },
      ];

      const result = validator.validatePipeline(engines);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe("circular_dependency");
    });
  });

  describe("validateEngine", () => {
    it("should validate a single engine", () => {
      const engine: EngineCapability = {
        engineId: "contradiction",
        engineVersion: "1.0.0",
        produces: ["CONTRADICTION_FACT"],
        consumes: ["EVIDENCE_FACT"],
      };

      const allEngines: EngineCapability[] = [
        {
          engineId: "evidence",
          engineVersion: "1.0.0",
          produces: ["EVIDENCE_FACT"],
          consumes: ["OBSERVATION_FACT"],
        },
        engine,
      ];

      const result = validator.validateEngine(engine, allEngines);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing producer for single engine", () => {
      const engine: EngineCapability = {
        engineId: "contradiction",
        engineVersion: "1.0.0",
        produces: ["CONTRADICTION_FACT"],
        consumes: ["EVIDENCE_FACT"],
      };

      const allEngines: EngineCapability[] = [engine];

      const result = validator.validateEngine(engine, allEngines);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe("missing_producer");
    });
  });
});
