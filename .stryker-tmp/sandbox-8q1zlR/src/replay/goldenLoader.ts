// @ts-nocheck
// src/replay/goldenLoader.ts

import fs from "fs";
import path from "path";

import { DEFAULT_GOLDEN_THRESHOLDS } from "./goldenDefaults";
import type { GoldenSpec, GoldenThresholds } from "./types";

/** Directory containing golden JSON files (relative to project root) */
const GOLDEN_DIR = path.resolve(process.cwd(), "golden");

/** Read and parse a JSON file synchronously */
function loadJson(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

/** Validate the shape of a golden spec and merge default thresholds */
function validateSpec(spec: any, fileName: string): GoldenSpec {
  if (typeof spec !== "object" || spec === null) {
    throw new Error(`Invalid golden file (not an object): ${fileName}`);
  }
  if (typeof spec.name !== "string" || spec.name.trim() === "") {
    throw new Error(`Golden file missing valid 'name': ${fileName}`);
  }
  if (typeof spec.fingerprint !== "object" || spec.fingerprint === null) {
    throw new Error(`Golden file missing valid 'fingerprint': ${fileName}`);
  }
  // Merge thresholds – if the file provides a partial object, overlay defaults
  const mergedThresholds: GoldenThresholds = {
    ...DEFAULT_GOLDEN_THRESHOLDS,
    ...(spec.thresholds ?? {}),
  } as const;
  return {
    name: spec.name,
    fingerprint: spec.fingerprint,
    thresholds: mergedThresholds,
  };
}

/** Load all *.json files from the golden directory and return normalized specs */
export function loadGoldens(): GoldenSpec[] {
  if (!fs.existsSync(GOLDEN_DIR)) {
    throw new Error(`Golden directory not found: ${GOLDEN_DIR}`);
  }
  const files = fs.readdirSync(GOLDEN_DIR).filter((f) => f.endsWith(".json"));
  const results: GoldenSpec[] = [];
  for (const file of files) {
    const fullPath = path.join(GOLDEN_DIR, file);
    const parsed = loadJson(fullPath);
    results.push(validateSpec(parsed, file));
  }
  return results;
}
