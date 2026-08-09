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
  const inValidationMethod = false;
  let inValidateFunction = false;
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    
    // Détecter si on est dans une méthode de validation
    if (trimmed.includes('validate()') || trimmed.includes('public validate')) {
      inValidateFunction = true;
    }
    if (trimmed.includes('}') && inValidateFunction) {
      inValidateFunction = false;
    }
    
    // Ignorer les mutations dans les méthodes de validation
    if (inValidateFunction) return;
    
    // Type F: Modification d'une constante dans un return (subtil)
    if (trimmed.includes('return') && (trimmed.includes('=== 0') || trimmed.includes('=== true') || trimmed.includes('=== false'))) {
      mutations.push({
        type: 'F',
        line: lineNum,
        description: `Invert constant in return at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed
          .replace('=== 0', '=== 1')
          .replace('=== 1', '=== 0')
          .replace('=== true', '=== false')
          .replace('=== false', '=== true')
      });
    }
    
    // Type G: Inversion d'un comparateur dans un calcul (pas dans une condition if)
    if (!trimmed.startsWith('if') && (trimmed.includes(' > ') || trimmed.includes(' < '))) {
      mutations.push({
        type: 'G',
        line: lineNum,
        description: `Invert comparator in calculation at line ${lineNum}`,
        original: trimmed,
        mutation: trimmed
          .replace(' > ', ' < ')
          .replace(' < ', ' > ')
      });
    }
    
    // Type I: Retour d'une mauvaise valeur dans une fonction getter
    if (trimmed.includes('return ') && !trimmed.includes('return;') && !trimmed.includes('return {')) {
      // Seulement pour les getters simples
      if (trimmed.match(/^return\s+\w+;$/)) {
        mutations.push({
          type: 'I',
          line: lineNum,
          description: `Return wrong value at line ${lineNum}`,
          original: trimmed,
          mutation: trimmed.replace(/return\s+(\w+);/, 'return 0;')
        });
      }
    }
  });
  
  // Limiter à 10 mutations par composant
  results[component] = mutations.slice(0, 10);
});

fs.writeFileSync('c:/Trajectoire/scripts/mutations-identified.json', JSON.stringify(results, null, 2));
console.log('Mutations saved to mutations-identified.json');
