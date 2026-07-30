const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const metrics = JSON.parse(fs.readFileSync(path.join(__dirname, 'real-metrics.json'), 'utf8'));

// Find test files for each component
function findTestFile(componentName) {
  const testPaths = [
    `tests/vm/core/${componentName}.test.ts`,
    `tests/vm/memory/${componentName}.test.ts`,
    `tests/vm/advanced/${componentName}.test.ts`,
    `tests/vm/loader/${componentName}.test.ts`,
    `tests/vm/decoder/${componentName}.test.ts`,
    `tests/vm/executor/${componentName}.test.ts`,
    `tests/vm/performance/${componentName}.test.ts`,
    `tests/vm/exceptions/${componentName}.test.ts`,
    `tests/unit/${componentName}.test.ts`,
    `tests/integration/${componentName}.test.ts`
  ];
  
  for (const testPath of testPaths) {
    const fullPath = path.join(process.cwd(), testPath);
    if (fs.existsSync(fullPath)) {
      return testPath;
    }
  }
  
  return null;
}

// Count test cases in a test file
function countTestCases(filePath) {
  if (!filePath) return 0;
  
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return 0;
  
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // Count it() and test() calls
  const testRegex = /\b(it|test|describe)\s*\(/g;
  const matches = content.match(testRegex);
  return matches ? matches.length : 0;
}

// Analyze test coverage for each component
const coverageData = {
  cvm: {},
  cpr: {},
  memory: {}
};

// CVM components
for (const comp of metrics.cvm.filter(c => !c.file.includes('index.ts'))) {
  const name = path.basename(comp.file, '.ts');
  const testFile = findTestFile(name);
  const testCount = countTestCases(testFile);
  
  coverageData.cvm[name] = {
    file: comp.file,
    testFile: testFile,
    testCount: testCount,
    hasTests: testCount > 0,
    lines: comp.lines,
    functions: comp.functions,
    branches: comp.branches,
    publicMethods: comp.methods.public,
    privateMethods: comp.methods.private,
    complexity: comp.cyclomaticComplexity
  };
}

// CPR components
for (const comp of metrics.cpr.filter(c => !c.file.includes('index.ts'))) {
  const name = path.basename(comp.file, '.ts');
  const testFile = findTestFile(name);
  const testCount = countTestCases(testFile);
  
  coverageData.cpr[name] = {
    file: comp.file,
    testFile: testFile,
    testCount: testCount,
    hasTests: testCount > 0,
    lines: comp.lines,
    functions: comp.functions,
    branches: comp.branches,
    publicMethods: comp.methods.public,
    privateMethods: comp.methods.private,
    complexity: comp.cyclomaticComplexity
  };
}

// Calculate test debt
function calculateTestDebt(comp) {
  // Debt = (untested functions + untested branches * 0.5) / complexity
  const untestedFunctions = Math.max(0, comp.functions - comp.testCount);
  const untestedBranches = comp.branches; // Assume no branch coverage without running tests
  const debt = (untestedFunctions + untestedBranches * 0.5) / Math.max(comp.complexity, 1);
  
  return {
    untestedFunctions,
    untestedBranches,
    debtScore: Math.round(debt * 100) / 100
  };
}

// Add debt calculation
for (const [name, comp] of Object.entries(coverageData.cvm)) {
  comp.debt = calculateTestDebt(comp);
}

for (const [name, comp] of Object.entries(coverageData.cpr)) {
  comp.debt = calculateTestDebt(comp);
}

fs.writeFileSync(
  path.join(__dirname, 'coverage-analysis.json'),
  JSON.stringify(coverageData, null, 2)
);

console.log('Coverage analysis saved to coverage-analysis.json');
