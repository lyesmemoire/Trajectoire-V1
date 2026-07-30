/**
 * Tests for the AST Mutation Engine
 * Validates that the AST mutator correctly discovers mutations and regressions
 * without depending on line numbers.
 */
const path = require('path');
const fs = require('fs');

// Pipeline engine
const { generateCatalog } = require('../../certification/ast-mutator.cjs');
// Lab engine (independent)
const { buildCatalog } = require('../../laboratory/independent-ast-mutator.cjs');

const SOURCE_FILE = path.resolve(__dirname, '../../compiler/cvm/execution-pipeline.ts');

describe('AST Mutation Engine', () => {
  const catalog = generateCatalog(SOURCE_FILE);

  test('discovers mutations (category === Mutation)', () => {
    const muts = catalog.filter(c => c.category === 'Mutation');
    expect(muts.length).toBeGreaterThan(0);
    console.log(`  Pipeline: ${muts.length} mutations discovered`);
  });

  test('discovers regressions (category === Regression)', () => {
    const regs = catalog.filter(c => c.category === 'Regression');
    expect(regs.length).toBeGreaterThan(0);
    console.log(`  Pipeline: ${regs.length} regressions discovered`);
  });

  test('every entry has a semantic ID (no line numbers)', () => {
    for (const entry of catalog) {
      expect(entry.id).toMatch(/^AST-(MUT|REG)-[0-9a-f]{16}$/);
      expect(entry.sourceSpan).toBeDefined();
      expect(entry.sourceSpan.start).toBeGreaterThanOrEqual(0);
      expect(entry.sourceSpan.end).toBeGreaterThan(entry.sourceSpan.start);
      expect(entry.hash).toBeDefined();
      expect(entry).not.toHaveProperty('line');
    }
  });

  test('every entry has required fields', () => {
    for (const entry of catalog) {
      expect(entry.kind).toBeDefined();
      expect(entry.file).toBe('execution-pipeline.ts');
      expect(entry.function).toBeDefined();
      expect(entry.description).toBeDefined();
      expect(entry.original).toBeDefined();
      expect(entry.replacement).toBeDefined();
    }
  });

  test('catalog is sorted deterministically by ID', () => {
    const ids = catalog.map(c => c.id);
    const sorted = [...ids].sort();
    expect(ids).toEqual(sorted);
  });

  test('no duplicate IDs', () => {
    const ids = catalog.map(c => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('operator mutations include correct replacements', () => {
    const opMuts = catalog.filter(c => c.description.startsWith('Operator'));
    expect(opMuts.length).toBeGreaterThan(0);
    for (const m of opMuts) {
      expect(m.replacement).toBeDefined();
      expect(m.replacement).not.toBe(m.original);
    }
  });

  test('boolean mutations swap true/false', () => {
    const boolMuts = catalog.filter(c => c.description.includes('true') || c.description.includes('false'));
    for (const m of boolMuts) {
      if (m.description === 'true -> false') {
        expect(m.replacement).toBe('false');
      } else if (m.description === 'false -> true') {
        expect(m.replacement).toBe('true');
      }
    }
  });

  test('regression statement removals replace with comment', () => {
    const removals = catalog.filter(c => c.description === 'Remove statement');
    expect(removals.length).toBeGreaterThan(0);
    for (const r of removals) {
      expect(r.replacement).toBe('/* statement removed */');
    }
  });

  test('sourceSpan points to valid content in the source file', () => {
    const source = fs.readFileSync(SOURCE_FILE, 'utf8');
    for (const entry of catalog) {
      const extracted = source.substring(entry.sourceSpan.start, entry.sourceSpan.end);
      // The extracted text should match the original (after normalization)
      const normalizedExtracted = extracted.trim().replace(/\s+/g, ' ');
      expect(normalizedExtracted).toBe(entry.original);
    }
  });
});

describe('Independent Lab AST Engine — Convergence', () => {
  const pipelineCatalog = generateCatalog(SOURCE_FILE);
  const labCatalog = buildCatalog(SOURCE_FILE);

  test('lab discovers the same number of entries as pipeline', () => {
    console.log(`  Pipeline: ${pipelineCatalog.length} entries`);
    console.log(`  Lab:      ${labCatalog.length} entries`);
    expect(labCatalog.length).toBe(pipelineCatalog.length);
  });

  test('lab produces identical IDs to pipeline', () => {
    const pipelineIds = pipelineCatalog.map(c => c.id);
    const labIds = labCatalog.map(c => c.id);
    expect(labIds).toEqual(pipelineIds);
  });

  test('lab produces identical replacements to pipeline', () => {
    for (let i = 0; i < pipelineCatalog.length; i++) {
      expect(labCatalog[i].replacement).toBe(pipelineCatalog[i].replacement);
      expect(labCatalog[i].original).toBe(pipelineCatalog[i].original);
    }
  });

  test('lab produces identical sourceSpans to pipeline', () => {
    for (let i = 0; i < pipelineCatalog.length; i++) {
      expect(labCatalog[i].sourceSpan).toEqual(pipelineCatalog[i].sourceSpan);
    }
  });

  test('lab and pipeline catalogs are both deterministically sorted', () => {
    const pIds = pipelineCatalog.map(c => c.id);
    const lIds = labCatalog.map(c => c.id);
    expect(pIds).toEqual([...pIds].sort());
    expect(lIds).toEqual([...lIds].sort());
  });
});
