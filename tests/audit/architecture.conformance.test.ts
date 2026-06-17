import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

describe("Architecture v1 Conformance", () => {
  const corePath = path.resolve("core");
  const appsPath = path.resolve("apps");

  function scanFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap(e => {
      const res = path.join(dir, e.name);
      return e.isDirectory() ? scanFiles(res) : [res];
    });
  }

  // Get all files and convert separators to forward slashes for easier matching
  const allCoreFiles = scanFiles(corePath).map(f => f.replace(/\\/g, '/'));
  const allAppsFiles = scanFiles(appsPath).map(f => f.replace(/\\/g, '/'));
  const allFiles = [...allCoreFiles, ...allAppsFiles];

  // We only check TypeScript files
  const files = allFiles.filter(f => f.endsWith(".ts"));

  const read = (file: string) => fs.readFileSync(file, "utf-8");

  it("S2 — No upward dependency (P5 → P6/P7 forbidden)", () => {
    const violations: string[] = [];

    for (const f of files) {
      if (!f.includes("/core/p5/")) continue;
      const content = read(f);

      // P5 should not import from P6 or P7 or Report
      if (content.includes("core/p6") || content.includes("../p6") ||
          content.includes("core/p7") || content.includes("../p7")) {
        violations.push(f);
      }
    }

    expect(violations).toEqual([]);
  });

  it("S2 — P6 does not depend on P7", () => {
    const violations: string[] = [];

    for (const f of files) {
      if (!f.includes("/core/p6/")) continue;
      const content = read(f);

      if (content.includes("core/p7") || content.includes("../p7")) {
        violations.push(f);
      }
    }

    expect(violations).toEqual([]);
  });

  it("S2 — INFRA does not depend on P7", () => {
    const infraFiles = files.filter(f => f.includes("/apps/realtime-gateway/"));

    const violations = infraFiles.filter(f => {
      const content = read(f);
      return content.includes("core/p7") || content.includes("../../../core/p7");
    });

    expect(violations).toEqual([]);
  });

  it("S3 — No IO leakage in core", () => {
    const forbidden = [
      "import fs",
      "require('fs')",
      "require(\"fs\")",
      "import http",
      "import axios",
      // "setTimeout" and "setInterval" are used in tests, so we exclude test files
    ];

    const violations: string[] = [];

    for (const f of files) {
      if (f.includes(".test.ts") || f.includes("/tests/")) continue;
      if (!f.includes("/core/")) continue;

      const content = read(f);
      if (forbidden.some(x => content.includes(x))) {
        violations.push(f);
      }
    }

    expect(violations).toEqual([]);
  });

  it("S1 — Core boundary integrity (no apps import in core)", () => {
    const violations: string[] = [];
    const coreDir = "Studioentretien/core/";

    for (const f of files) {
      if (!f.includes(coreDir)) continue;
      
      const content = read(f);

      if (content.includes("apps/")) {
        violations.push(f);
      }
    }
    
    expect(violations).toEqual([]);
  });

  it("S4 — P7.5 is terminal layer", () => {
    const violations: string[] = [];

    for (const f of files) {
      // Anything outside of P7.5 cannot import P7.5 (report)
      if (f.includes("/core/p7/report/")) continue;
      
      const content = read(f);
      if (content.includes("p7/report")) {
        violations.push(f);
      }
    }

    expect(violations).toEqual([]);
  });
});
