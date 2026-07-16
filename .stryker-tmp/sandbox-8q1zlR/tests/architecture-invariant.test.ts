// @ts-nocheck
// tests/architecture-invariant.test.ts
/**
 * Architecture Invariant Test
 * Ensures that policy layer files do not import or reference forbidden modules
 * or identifiers that would break the layered design.
 */
import * as fs from 'fs';
import * as path from 'path';

// Files that belong to the policy layer (must not import forbidden modules)
const policyFiles = [
  'src/replay/fingerprint.ts',
  'src/replay/goldenCompare.ts',
  'src/replay/driftVector.ts',
];

// Forbidden import paths (relative to the policy files)
const forbiddenImports = [
  "../replayTrace",
  "../buildDiffContext",
  "../clusterDiffs",
];

// Forbidden identifier patterns inside policy files
const forbiddenIdentifiers = [
  /\boldGrouped\b/, // oldGrouped variable
  /\bnewGrouped\b/, // newGrouped variable
  /\breplayTrace\s*\(/, // call to replayTrace()
  /\bbuildDiffContext\s*\(/, // call to buildDiffContext()
];

function readFileContent(relativePath: string): string {
  const absolute = path.resolve(process.cwd(), relativePath);
  return fs.readFileSync(absolute, { encoding: 'utf8' });
}

describe('Architecture Invariants', () => {
  test('policy layer must not import forbidden modules', () => {
    for (const file of policyFiles) {
      const content = readFileContent(file);
      for (const importPath of forbiddenImports) {
        const importRegex = new RegExp(`import\\s+.*from\\s+['"]${importPath}['"]`);
        if (importRegex.test(content)) {
          throw new Error(`Forbidden import of ${importPath} found in ${file}`);
        }
      }
    }
  });

  test('policy layer must not reference forbidden identifiers or calls', () => {
    for (const file of policyFiles) {
      const content = readFileContent(file);
      for (const pattern of forbiddenIdentifiers) {
        if (pattern.test(content)) {
          throw new Error(`Forbidden identifier pattern ${pattern} found in ${file}`);
        }
      }
    }
  });
});
