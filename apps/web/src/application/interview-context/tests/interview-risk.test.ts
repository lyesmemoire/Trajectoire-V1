import { describe, it, expect } from "vitest";
import { buildTopRisks, type InterviewRiskInput } from "../InterviewRiskEngine";

describe("InterviewRiskEngine", () => {
  const defaultInput: InterviewRiskInput = {
    cvText: "",
    jobTitle: "Product Manager",
    matching: {
      matchedSkills: [],
      missingSkills: [],
      suggestions: [],
      score: null,
    },
  };

  it("should return empty array when no actionable data is provided", () => {
    const risks = buildTopRisks(defaultInput);
    expect(risks).toHaveLength(0);
  });

  it("should create 1 risk from a single relevant suggestion", () => {
    const risks = buildTopRisks({
      ...defaultInput,
      cvText: "Experience as a manager.",
      matching: {
        ...defaultInput.matching,
        suggestions: ["Améliorer la description du leadership"],
      },
    });

    expect(risks).toHaveLength(1);
    expect(risks[0].id).toBe("suggestion_am_liorer_la_description_du_leadership_PARTIAL");
    expect(risks[0].category).toBe("suggestion");
    expect(risks[0].severity).toBe("MEDIUM");
  });

  it("should limit to maximum 3 risks even with many suggestions", () => {
    const risks = buildTopRisks({
      ...defaultInput,
      matching: {
        ...defaultInput.matching,
        suggestions: ["Sug 1", "Sug 2", "Sug 3", "Sug 4", "Sug 5"],
      },
    });

    expect(risks).toHaveLength(3);
  });

  it("should sort HIGH severity before MEDIUM", () => {
    const risks = buildTopRisks({
      ...defaultInput,
      cvText: "I know Agile",
      matching: {
        ...defaultInput.matching,
        // Will be MEDIUM (weak_evidence) since Agile is in CV but no metrics
        matchedSkills: ["Agile"],
        // Will be HIGH (missing_skill) since Leadership is not in CV
        missingSkills: ["Leadership"],
      },
    });

    expect(risks).toHaveLength(2);
    expect(risks[0].severity).toBe("HIGH");
    expect(risks[0].category).toBe("missing_skill");
    expect(risks[1].severity).toBe("MEDIUM");
    expect(risks[1].category).toBe("weak_evidence");
  });

  it("should deduplicate similar suggestions or identical IDs", () => {
    const risks = buildTopRisks({
      ...defaultInput,
      matching: {
        ...defaultInput.matching,
        suggestions: ["Améliorer React", " Améliorer React "],
      },
    });

    expect(risks).toHaveLength(1);
  });

  it("should not trigger no_metrics solely based on low score if metrics are present", () => {
    const risks = buildTopRisks({
      ...defaultInput,
      cvText: "Increased revenue by 50% and saved 10k€ across 3 projects. This text is long enough.",
      matching: {
        ...defaultInput.matching,
        score: 40, // very low score
      },
    });

    // We have metrics in the CV ("50%", "10k€"), so no_metrics should NOT be generated.
    expect(risks).toHaveLength(0);
  });

  it("should trigger no_metrics if there is enough text but no metrics", () => {
    const risks = buildTopRisks({
      ...defaultInput,
      cvText: "I did many things and worked on various tasks. I was a good developer and manager. I helped people.",
      matching: {
        ...defaultInput.matching,
      },
    });

    expect(risks).toHaveLength(1);
    expect(risks[0].category).toBe("no_metrics");
  });

  it("should handle partial data without crashing", () => {
    const risks = buildTopRisks({
      cvText: undefined as any,
      jobTitle: null as any,
      matching: {
        matchedSkills: [null as any, undefined as any, ""],
        missingSkills: [undefined as any],
        suggestions: [null as any],
        score: NaN,
      },
    });

    expect(risks).toHaveLength(0);
  });
});
