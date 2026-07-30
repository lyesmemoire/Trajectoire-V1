const fs = require('fs');
const path = require('path');

const v3Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'v3-audit-data.json'), 'utf8'));

function createEnrichedLots() {
  const lots = [];
  let lotId = 1;
  
  // CVM components - sorted by level then by criticality
  const cvmComponents = Object.entries(v3Data.cvm)
    .map(([name, data]) => ({ name, ...data, category: 'CVM' }))
    .sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return b.criticalityScore - a.criticalityScore;
    });
  
  // CPR components - sorted by level then by criticality
  const cprComponents = Object.entries(v3Data.cpr)
    .map(([name, data]) => ({ name, ...data, category: 'CPR' }))
    .sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return b.criticalityScore - a.criticalityScore;
    });
  
  // Create enriched lots for CVM
  for (const comp of cvmComponents) {
    lots.push({
      id: lotId++,
      name: comp.name,
      category: comp.category,
      file: comp.file,
      lines: comp.lines,
      level: comp.level,
      criticalityScore: comp.criticalityScore,
      dependencies: {
        upstream: comp.dependencies.upstream,
        downstream: comp.dependencies.downstream
      },
      files: [comp.file],
      coverage: {
        current: comp.coverage,
        target: {
          statements: 95,
          branches: 97,
          functions: 100
        }
      },
      tests: comp.tests,
      validationCriteria: [
        `Coverage Statements ≥ 95%`,
        `Coverage Branches ≥ 97%`,
        `Coverage Functions ≥ 100%`,
        `All tests pass`,
        `No TypeScript errors`,
        `No linting errors`
      ],
      estimatedEffort: Math.ceil(comp.complexity / 5)
    });
  }
  
  // Create enriched lots for CPR
  for (const comp of cprComponents) {
    lots.push({
      id: lotId++,
      name: comp.name,
      category: comp.category,
      file: comp.file,
      lines: comp.lines,
      level: comp.level,
      criticalityScore: comp.criticalityScore,
      dependencies: {
        upstream: comp.dependencies.upstream,
        downstream: comp.dependencies.downstream
      },
      files: [comp.file],
      coverage: {
        current: comp.coverage,
        target: {
          statements: 95,
          branches: 97,
          functions: 100
        }
      },
      tests: comp.tests,
      validationCriteria: [
        `Coverage Statements ≥ 95%`,
        `Coverage Branches ≥ 97%`,
        `Coverage Functions ≥ 100%`,
        `All tests pass`,
        `No TypeScript errors`,
        `No linting errors`
      ],
      estimatedEffort: Math.ceil(comp.complexity / 5)
    });
  }
  
  return lots;
}

const enrichedLots = createEnrichedLots();

fs.writeFileSync(
  path.join(__dirname, 'enriched-lots.json'),
  JSON.stringify(enrichedLots, null, 2)
);

console.log('Enriched lots saved to enriched-lots.json');
