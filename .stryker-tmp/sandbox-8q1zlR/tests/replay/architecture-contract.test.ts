// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';

describe('Architecture Contract', () => {
  const readSource = (fileName: string): string => {
    const filePath = path.resolve(process.cwd(), 'src', 'replay', fileName);
    return fs.readFileSync(filePath, { encoding: 'utf8' });
  };

  test('diffTraces must never import buildDiffContext or fingerprint', () => {
    const source = readSource('diffTrace.ts');
    const forbidden = ['buildDiffContext', 'fingerprint', 'makeFingerprint'];
    for (const name of forbidden) {
      const regex = new RegExp(`^\\s*import\\b[^;]*\\b${name}\\b`, 'm');
      expect(source).not.toMatch(regex);
    }
  });

  test('fingerprint must never import replayTrace, oldGrouped, newGrouped, or goldenCompare', () => {
    const source = readSource('fingerprint.ts');
    const forbidden = ['replayTrace', 'ReplayTrace', 'oldGrouped', 'newGrouped', 'goldenCompare'];
    for (const name of forbidden) {
      const regex = new RegExp(`^\\s*import\\b[^;]*\\b${name}\\b`, 'm');
      expect(source).not.toMatch(regex);
    }
  });

  test('goldenCompare must never import clusterDiffs or goldenScoring', () => {
    const source = readSource('goldenCompare.ts');
    const forbidden = ['clusterDiffs', 'goldenScoring'];
    for (const name of forbidden) {
      const regex = new RegExp(`^\\s*import\\b[^;]*\\b${name}\\b`, 'm');
      expect(source).not.toMatch(regex);
    }
  });
});
