const fs = require('fs');
const path = require('path');

// Exécuter vitest avec coverage et capturer la sortie
const { execSync } = require('child_process');

try {
  const output = execSync('pnpm vitest run --coverage tests/vm/core/execution-context.test.ts', {
    cwd: path.join(process.cwd()),
    encoding: 'utf8'
  });
  
  // Extraire les lignes de couverture pour execution-context
  const lines = output.split('\n');
  let coverageData = null;
  
  for (const line of lines) {
    if (line.includes('execution-context.ts')) {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 6) {
        coverageData = {
          file: parts[0],
          statements: parts[1],
          branches: parts[2],
          functions: parts[3],
          lines: parts[4],
          uncovered: parts[5]
        };
        break;
      }
    }
  }
  
  if (coverageData) {
    console.log(JSON.stringify(coverageData, null, 2));
  } else {
    console.log('Coverage data not found in output');
  }
} catch (error) {
  console.error('Error executing vitest:', error.message);
}
