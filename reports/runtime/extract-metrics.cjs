const fs = require('fs');
const path = require('path');

function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').length;
}

function countFunctions(content) {
  // Count function declarations and method definitions
  const functionRegex = /(?:public|private|protected)?\s*(?:async\s+)?function\s+\w+|public\s+(?:async\s+)?\w+\s*\(|private\s+(?:async\s+)?\w+\s*\(|protected\s+(?:async\s+)?\w+\s*\(|export\s+(?:async\s+)?function\s+\w+/g;
  const matches = content.match(functionRegex);
  return matches ? matches.length : 0;
}

function countClasses(content) {
  const classRegex = /export\s+class\s+\w+/g;
  const matches = content.match(classRegex);
  return matches ? matches.length : 0;
}

function countBranches(content) {
  // Count if/else, switch, ternary operators, for/while loops
  const branchRegex = /\b(if|else|switch|case|default|\?|for|while|catch)\b/g;
  const matches = content.match(branchRegex);
  return matches ? matches.length : 0;
}

function countMethods(content) {
  // Count public and private methods
  const publicMethodRegex = /public\s+\w+\s*\(/g;
  const privateMethodRegex = /private\s+\w+\s*\(/g;
  const publicMatches = content.match(publicMethodRegex);
  const privateMatches = content.match(privateMethodRegex);
  return {
    public: publicMatches ? publicMatches.length : 0,
    private: privateMatches ? privateMatches.length : 0
  };
}

function extractImports(content) {
  const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
  const matches = content.match(importRegex);
  return matches ? matches.map(m => m.match(/from\s+['"]([^'"]+)['"]/)[1]) : [];
}

function calculateCyclomaticComplexity(content) {
  // Basic cyclomatic complexity: number of decision points + 1
  const decisionPoints = content.match(/\b(if|else|while|for|case|catch)\b/g);
  return (decisionPoints ? decisionPoints.length : 0) + 1;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  
  return {
    file: relativePath,
    lines: countLines(filePath),
    classes: countClasses(content),
    functions: countFunctions(content),
    branches: countBranches(content),
    methods: countMethods(content),
    imports: extractImports(content),
    cyclomaticComplexity: calculateCyclomaticComplexity(content)
  };
}

function analyzeDirectory(dir) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...analyzeDirectory(filePath));
    } else if (file.endsWith('.ts') && !file.endsWith('.test.ts')) {
      results.push(analyzeFile(filePath));
    }
  }
  
  return results;
}

// Analyze CVM components
const cvmDir = path.join(process.cwd(), 'compiler', 'cvm');
const cvmResults = analyzeDirectory(cvmDir);

// Analyze CPR components
const cprDir = path.join(process.cwd(), 'compiler', 'cpr');
const cprResults = analyzeDirectory(cprDir);

// Analyze Memory components
const memoryDir = path.join(process.cwd(), 'src', 'memory');
const memoryResults = analyzeDirectory(memoryDir);

const allResults = {
  cvm: cvmResults,
  cpr: cprResults,
  memory: memoryResults
};

// Save to file
fs.writeFileSync(
  path.join(__dirname, 'real-metrics.json'),
  JSON.stringify(allResults, null, 2)
);

console.log('Metrics saved to real-metrics.json');
