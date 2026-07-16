/**
 * Smoke test produit (P0.5).
 * Valide le flux de bout en bout : CV + Job -> runProductFlow -> ProductOutput.
 *
 * Mode déterministe (enableEnrichment: false) => aucun réseau, aucune clé API,
 * résultat reproductible en CI.
 */
// @ts-nocheck


import { describe, it, expect } from "vitest";
import { runProductFlow } from "@/lib/runtime/run-product-flow";
import { isProductOutput } from "@/lib/runtime/product-contract";

const CV = `
Développeur Full Stack avec 5 ans d'expérience.
Compétences : JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker.
Expérience en API REST et tests automatisés.
`;

const JOB = `
Nous recherchons un développeur Full Stack maîtrisant React, Node.js,
TypeScript et AWS. Connaissance de Kubernetes appréciée.
`;

describe("runProductFlow — smoke produit", () => {
  it("retourne un ProductOutput valide pour une entrée CV+Job", async () => {
    const out = await runProductFlow(
      { cvText: CV, jobText: JOB },
      { enableEnrichment: false },
    );

    expect(isProductOutput(out)).toBe(true);
  });

  it("calcule un score borné 0–100", async () => {
    const out = await runProductFlow(
      { cvText: CV, jobText: JOB },
      { enableEnrichment: false },
    );
    expect(typeof out.matchScore).toBe("number");
    expect(out.matchScore).toBeGreaterThanOrEqual(0);
    expect(out.matchScore).toBeLessThanOrEqual(100);
  });

  it("génère une explication et des actions non vides", async () => {
    const out = await runProductFlow(
      { cvText: CV, jobText: JOB },
      { enableEnrichment: false },
    );
    expect(out.explanation.length).toBeGreaterThan(0);
    expect(out.actions.length).toBeGreaterThan(0);
  });

  it("détecte des forces présentes dans le CV (react/node)", async () => {
    const out = await runProductFlow(
      { cvText: CV, jobText: JOB },
      { enableEnrichment: false },
    );
    const joined = out.strengths.join(" ").toLowerCase();
    expect(joined).toMatch(/react|node/);
  });

  it("identifie des manques attendus (aws/kubernetes)", async () => {
    const out = await runProductFlow(
      { cvText: CV, jobText: JOB },
      { enableEnrichment: false },
    );
    const gaps = out.gaps.join(" ").toLowerCase();
    expect(gaps).toMatch(/aws|kubernetes/);
  });

  it("fournit les champs P1 (interprétation, impact, prép entretien)", async () => {
    const out = await runProductFlow(
      { cvText: CV, jobText: JOB },
      { enableEnrichment: false },
    );
    expect(typeof out.interpretation).toBe("string");
    expect((out.interpretation ?? "").length).toBeGreaterThan(0);
    expect(typeof out.estimatedImpact).toBe("number");
    expect(out.estimatedImpact).toBeGreaterThanOrEqual(0);
    expect(out.estimatedImpact).toBeLessThanOrEqual(30);
    expect(out.interviewPrep).toBeDefined();
    expect((out.interviewPrep?.question ?? "").length).toBeGreaterThan(0);
    expect((out.interviewPrep?.structure ?? []).length).toBe(4);
  });

  it("gère une entrée vide sans planter (sortie valide)", async () => {
    const out = await runProductFlow(
      { cvText: "", jobText: "" },
      { enableEnrichment: false },
    );
    expect(isProductOutput(out)).toBe(true);
    expect(out.matchScore).toBe(0);
  });
});
