const fs = require('fs');

const components = {
  'execution-context': 'c:/Trajectoire/compiler/cvm/execution-context.ts',
  'memory-manager': 'c:/Trajectoire/compiler/cvm/memory-manager.ts',
  'execution-pipeline': 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts',
  'instruction-cache': 'c:/Trajectoire/compiler/cvm/instruction-cache.ts',
  'instruction-fetch': 'c:/Trajectoire/compiler/cvm/instruction-fetch.ts',
  'instruction-decode': 'c:/Trajectoire/compiler/cvm/instruction-decode.ts',
  'instruction-execute': 'c:/Trajectoire/compiler/cvm/instruction-execute.ts',
  'rollback-manager': 'c:/Trajectoire/compiler/cvm/rollback-manager.ts',
  'thread-manager': 'c:/Trajectoire/compiler/cvm/thread-manager.ts'
};

const results = {};

Object.entries(components).forEach(([component, filePath]) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const mutations = [];
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    // Type A: Inversion d'une condition (if) - seulement si ce n'est pas une validation critique
    if (trimmed.match(/^if\s*\(/) && !trimmed.includes('throw') && !trimmed.includes('return')) {
      mutations.push({
        type: 'A',
        line: lineNum,
        description: `Invert condition at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed.replace(/^if\s*\(/, 'if (!(')
      });
    }
    
    // Type F: Modification d'une constante (0 → 1, true → false)
    if (trimmed.includes('=== 0') || trimmed.includes('=== true') || trimmed.includes('=== false')) {
      mutations.push({
        type: 'F',
        line: lineNum,
        description: `Invert constant comparison at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed
          .replace('=== 0', '=== 1')
          .replace('=== 1', '=== 0')
          .replace('=== true', '=== false')
          .replace('=== false', '=== true')
      });
    }
    
    // Type G: Inversion d'un comparateur
    if (trimmed.includes(' > ') || trimmed.includes(' < ') || trimmed.includes(' >= ') || trimmed.includes(' <= ')) {
      mutations.push({
        type: 'G',
        line: lineNum,
        description: `Invert comparator at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed
          .replace(' > ', ' < ')
          .replace(' < ', ' > ')
          .replace(' >= ', ' <= ')
          .replace(' <= ', ' >= ')
      });
    }
  });
  
  // Limiter à 15 mutations par composant
  results[component] = mutations.slice(0, 15);
});

fs.writeFileSync('c:/Trajectoire/scripts/mutations-identified.json', JSON.stringify(results, null, 2));
console.log('Mutations saved to mutations-identified.json');
