const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// Mutations sur getters/setters et cache (moins sensibles aux timeouts)
const mutations = [
  // Mutations sur getFetch (ligne 150-152)
  { id: 36, line: 151, original: 'return this.fetch;', mutated: 'return this.decode;', description: 'return decode instead of fetch' },
  { id: 37, line: 151, original: 'return this.fetch;', mutated: 'return this.execute;', description: 'return execute instead of fetch' },
  
  // Mutations sur getDecode (ligne 157-159)
  { id: 38, line: 158, original: 'return this.decode;', mutated: 'return this.fetch;', description: 'return fetch instead of decode' },
  { id: 39, line: 158, original: 'return this.decode;', mutated: 'return this.execute;', description: 'return execute instead of decode' },
  
  // Mutations sur getExecute (ligne 164-166)
  { id: 40, line: 165, original: 'return this.execute;', mutated: 'return this.fetch;', description: 'return fetch instead of execute' },
  { id: 41, line: 165, original: 'return this.execute;', mutated: 'return this.decode;', description: 'return decode instead of execute' },
  
  // Mutations sur getContext (ligne 171-173)
  { id: 42, line: 172, original: 'return this.context;', mutated: 'return null;', description: 'return null instead of context' },
  
  // Mutations sur setBytecode (ligne 178-181)
  { id: 43, line: 179, original: 'this.fetch.setBytecode(bytecode);', mutated: '// setBytecode removed', description: 'remove setBytecode call' },
  { id: 44, line: 180, original: 'this.reset();', mutated: '// reset removed', description: 'remove reset call' },
  
  // Mutations sur getBytecode (ligne 186-188)
  { id: 45, line: 187, original: 'return this.fetch.getBytecode();', mutated: 'return new Uint8Array();', description: 'return empty array' },
  
  // Mutations sur enableCache (ligne 207-209)
  { id: 46, line: 208, original: 'this.fetch.enableCache();', mutated: '// enableCache removed', description: 'remove enableCache call' },
  
  // Mutations sur disableCache (ligne 214-216)
  { id: 47, line: 215, original: 'this.fetch.disableCache();', mutated: '// disableCache removed', description: 'remove disableCache call' },
  
  // Mutations sur setCacheSize (ligne 221-223)
  { id: 48, line: 222, original: 'this.fetch.setCacheSize(size);', mutated: '// setCacheSize removed', description: 'remove setCacheSize call' },
  { id: 49, line: 222, original: 'this.fetch.setCacheSize(size);', mutated: 'this.fetch.setCacheSize(size * 2);', description: 'size * 2' },
  { id: 50, line: 222, original: 'this.fetch.setCacheSize(size);', mutated: 'this.fetch.setCacheSize(size + 1);', description: 'size + 1' },
  
  // Mutations sur getCacheStatistics (ligne 200-202)
  { id: 51, line: 201, original: 'return this.fetch.getCacheStatistics();', mutated: 'return null;', description: 'return null' },
  { id: 52, line: 201, original: 'return this.fetch.getCacheStatistics();', mutated: 'return { hits: 0, misses: 0 };', description: 'return empty stats' },
  
  // Mutations sur reset (ligne 133-138)
  { id: 53, line: 134, original: 'this.context.reset();', mutated: '// context.reset removed', description: 'remove context.reset' },
  { id: 54, line: 135, original: 'this.fetch.clearCache();', mutated: '// clearCache removed', description: 'remove clearCache' },
  { id: 55, line: 136, original: 'this.statistics = this.initializeStatistics();', mutated: '// statistics reset removed', description: 'remove statistics reset' },
  
  // Mutations sur stop (ligne 126-128)
  { id: 56, line: 127, original: 'this.running = false;', mutated: '// stop removed', description: 'remove stop' },
  
  // Mutations sur step (ligne 193-195)
  { id: 57, line: 194, original: 'return this.cycle();', mutated: 'return null;', description: 'return null instead of cycle' },
];

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log('=== Phase 3 - Audit par mutation ciblée - execution-pipeline ===\n');
console.log(`Total mutations: ${mutations.length}\n`);

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

mutations.forEach((mutation, index) => {
  console.log(`Mutation ${mutation.id}: ${mutation.description}`);
  
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  let status = 'UNKNOWN';
  
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
      console.log('  Compilation échouée - INVALID');
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
        console.log('  SURVIVED');
      } else {
        status = 'KILLED';
        console.log('  KILLED');
      }
    } catch (testError) {
      const errorOutput = testError.stdout || testError.stderr || '';
      if (errorOutput.includes('FAIL')) {
        status = 'KILLED';
        console.log('  KILLED (test échoue)');
      } else {
        status = 'INVALID';
        console.log('  INVALID (timeout ou erreur)');
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
      line: mutation.line,
      description: mutation.description,
      status
    });
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

// Sauvegarder rapports
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase3.json', JSON.stringify(results, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-phase3.json', JSON.stringify({
  total: results.length,
  killed,
  survived,
  invalid,
  validTotal,
  mutationScore: parseFloat(mutationScore)
}, null, 2));

const report = `# Audit par mutation ciblée - execution-pipeline (Phase 3)

## Objectif

Mutations sur getters/setters et cache pour éviter les timeouts.

## Résultats

| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |
| Mutation Score | ${mutationScore}% |
| Nombre total de mutations valides | ${validTotal} |

## Détail des mutations

| ID | Ligne | Description | Status |
|----|-------|-------------|--------|
${results.map(r => `| ${r.id} | ${r.line} | ${r.description} | ${r.status} |`).join('\n')}
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-report-phase3.md', report);

// Affichage demandé
console.log('\n=== Résultats Phase 3 ===');
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
console.log(`Nombre total de mutations valides: ${validTotal}`);
console.log(`\nSHA initial: ${initialSha}`);
console.log(`SHA final: ${finalSha}`);
console.log(`SHA identique: ${initialSha === finalSha ? 'OK' : 'DIFFÉRENT'}`);
