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
    
    // Type A: Inversion d'une condition (if)
    if (trimmed.match(/^if\s*\(/)) {
      mutations.push({
        type: 'A',
        line: lineNum,
        description: `Invert condition at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed.replace(/^if\s*\(/, 'if (!(')
      });
    }
    
    // Type C: Suppression d'un throw
    if (trimmed.includes('throw new Error')) {
      mutations.push({
        type: 'C',
        line: lineNum,
        description: `Remove throw at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed.replace(/throw new Error\([^)]+\);?/, '// throw removed')
      });
    }
    
    // Type D: Suppression d'une validation (if check before error)
    if (trimmed.match(/^if\s*\([^)]+\)\s*{/)) {
      const nextLine = lines[index + 1]?.trim();
      if (nextLine && (nextLine.includes('throw') || nextLine.includes('return'))) {
        mutations.push({
          type: 'D',
          line: lineNum,
          description: `Remove validation at line ${lineNum}`,
          original: trimmed,
          mutation: trimmed.replace(/^if\s*\([^)]+\)\s*\{/, '// validation removed')
        });
      }
    }
    
    // Type F: Modification d'une constante (0 → 1, true → false)
    if (trimmed.includes('=== 0') || trimmed.includes('=== true')) {
      mutations.push({
        type: 'F',
        line: lineNum,
        description: `Invert constant comparison at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed.replace('=== 0', '=== 1').replace('=== true', '=== false')
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
    
    // Type H: Suppression d'une affectation
    if (trimmed.match(/^\s*\w+\s*=\s*[^;]+;/)) {
      mutations.push({
        type: 'H',
        line: lineNum,
        description: `Remove assignment at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed.replace(/^\s*(\w+\s*=\s*[^;]+;)/, '// $1')
      });
    }
    
    // Type K: Suppression d'une mise à jour d'état
    if (trimmed.includes('.set') || trimmed.includes('.push') || trimmed.includes('.add')) {
      mutations.push({
        type: 'K',
        line: lineNum,
        description: `Remove state update at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed.replace(/(\.\w+\([^)]+\);)/, '// $1')
      });
    }
  });
  
  // Limiter à 10 mutations par composant pour commencer
  results[component] = mutations.slice(0, 10);
});

fs.writeFileSync('c:/Trajectoire/scripts/mutations-identified.json', JSON.stringify(results, null, 2));
console.log('Mutations saved to mutations-identified.json');
