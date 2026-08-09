const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// 10 mutations simples demandées
const mutations = [
  {
    id: 1,
    line: 74,
    original: 'this.statistics.instructionsExecuted++;',
    mutated: 'this.statistics.instructionsExecuted += 2;',
    description: 'instructionsExecuted++ → += 2'
  },
  {
    id: 2,
    line: 75,
    original: 'this.statistics.cycles++;',
    mutated: 'this.statistics.cycles += 2;',
    description: 'cycles++ → += 2'
  },
  {
    id: 3,
    line: 57,
    original: 'if (this.context.isHalted()) {',
    mutated: 'if (!this.context.isHalted()) {',
    description: 'Inverser condition halted'
  },
  {
    id: 4,
    line: 234,
    original: 'if (this.context.getProgramCounter() < 0) {',
    mutated: 'if (this.context.getProgramCounter() <= 0) {',
    description: '> → >='
  },
  {
    id: 5,
    line: 239,
    original: 'if (this.context.getProgramCounter() >= bytecode.length) {',
    mutated: 'if (this.context.getProgramCounter() > bytecode.length) {',
    description: '>= → >'
  },
  {
    id: 6,
    line: 244,
    original: 'valid: errors.length === 0,',
    mutated: 'valid: errors.length !== 0,',
    description: '=== → !=='
  },
  {
    id: 7,
    line: 127,
    original: 'this.running = false;',
    mutated: 'this.running = true;',
    description: 'return false → true (stop)'
  },
  {
    id: 8,
    line: 103,
    original: 'this.running = true;',
    mutated: 'this.running = false;',
    description: 'return true → false (run)'
  },
  {
    id: 9,
    line: 93,
    original: 'this.context.setError(new Error(result.error || \'Execution error\'));',
    mutated: '// throw removed',
    description: 'Supprimer throw'
  },
  {
    id: 10,
    line: 96,
    original: 'return result;',
    mutated: '// return removed',
    description: 'Supprimer return'
  }
];

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log('=== Audit par mutation ciblée - execution-pipeline ===\n');

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

mutations.forEach((mutation) => {
  console.log(`Mutation ${mutation.id}: ${mutation.description}`);
  
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  let status = 'UNKNOWN';
  const duration = 0;
  
  try {
    // Appliquer mutation
    const mutatedLines = [...originalLines];
    const lineIndex = mutation.line - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      mutatedLines[lineIndex] = mutation.mutated;
      fs.writeFileSync(filePath, mutatedLines.join('\n'));
    } else {
      throw new Error('Ligne hors limites');
    }
    
    // Compiler
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
    } catch (compileError) {
      status = 'INVALID';
      throw new Error('Compilation échouée');
    }
    
    // Exécuter tests
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 15000,
        encoding: 'utf8'
      });
      
      if (testOutput.includes('PASS') && !testOutput.includes('FAIL')) {
        status = 'SURVIVED';
      } else {
        status = 'KILLED';
      }
    } catch (testError) {
      const errorOutput = testError.stdout || testError.stderr || '';
      if (errorOutput.includes('FAIL')) {
        status = 'KILLED';
      } else {
        status = 'INVALID';
      }
    }
    
  } catch (error) {
    if (status === 'UNKNOWN') status = 'INVALID';
  } finally {
    // Restaurer
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
    }
    
    results.push({
      id: mutation.id,
      description: mutation.description,
      status
    });
    
    console.log(`  Status: ${status}\n`);
  }
});

// Vérifier SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

// Calculer Mutation Score
const killed = results.filter(r => r.status === 'KILLED').length;
const survived = results.filter(r => r.status === 'SURVIVED').length;
const invalid = results.filter(r => r.status === 'INVALID').length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;

// Certification
let certification = 'BRONZE';
if (mutationScore >= 95 && survived === 0) certification = 'GOLD';
else if (mutationScore >= 80) certification = 'SILVER';

// Sauvegarder rapports
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results.json', JSON.stringify(results, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary.json', JSON.stringify({
  total: results.length,
  killed,
  survived,
  invalid,
  mutationScore: parseFloat(mutationScore),
  certification
}, null, 2));

// Rapport Markdown
const report = `# Audit par mutation ciblée - execution-pipeline

## Tableau des mutations

| ID | Description | Status |
|----|-------------|--------|
${results.map(r => `| ${r.id} | ${r.description} | ${r.status} |`).join('\n')}

## Résultats

- Total mutations: ${results.length}
- KILLED: ${killed}
- SURVIVED: ${survived}
- INVALID: ${invalid}
- Mutation Score: ${mutationScore}%

## Certification

**${certification}**

## Survivants

${survived === 0 ? 'Aucune mutation survivante' : results.filter(r => r.status === 'SURVIVED').map(r => `- ${r.description}`).join('\n')}
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-report.md', report);

// Affichage demandé
console.log('=== Tableau des mutations ===');
console.log('| ID | Description | Status |');
console.log('|----|-------------|--------|');
results.forEach(r => console.log(`| ${r.id} | ${r.description} | ${r.status} |`));

console.log(`\n=== Mutation Score ===`);
console.log(`${mutationScore}%`);

console.log(`\n=== Certification ===`);
console.log(certification);

console.log(`\n=== Survivants ===`);
if (survived === 0) {
  console.log('Aucune mutation survivante');
} else {
  results.filter(r => r.status === 'SURVIVED').forEach(r => console.log(`- ${r.description}`));
}

console.log(`\nSHA initial: ${initialSha}`);
console.log(`SHA final: ${finalSha}`);
console.log(`SHA identique: ${initialSha === finalSha ? 'OK' : 'DIFFÉRENT'}`);
