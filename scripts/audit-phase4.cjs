const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// Mutations basées sur celles qui ont fonctionné (patterns VALIDES)
const mutations = [
  // Variations sur les compteurs (+=2 a fonctionné sur instructionsExecuted et cycles)
  { id: 58, line: 74, original: 'this.statistics.instructionsExecuted++;', mutated: 'this.statistics.instructionsExecuted += 4;', description: '+=4 instead of ++' },
  { id: 59, line: 74, original: 'this.statistics.instructionsExecuted++;', mutated: 'this.statistics.instructionsExecuted += 5;', description: '+=5 instead of ++' },
  { id: 60, line: 75, original: 'this.statistics.cycles++;', mutated: 'this.statistics.cycles += 4;', description: '+=4 instead of ++' },
  { id: 61, line: 75, original: 'this.statistics.cycles++;', mutated: 'this.statistics.cycles += 5;', description: '+=5 instead of ++' },
  
  // Variations sur les conditions de boucle (< → <= a fonctionné)
  { id: 62, line: 116, original: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i++) {', mutated: 'for (let i = 0; i < n - 1 && !this.context.isHalted() && this.running; i++) {', description: 'i < n → i < n - 1' },
  { id: 63, line: 116, original: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i++) {', mutated: 'for (let i = 0; i < n + 1 && !this.context.isHalted() && this.running; i++) {', description: 'i < n → i < n + 1' },
  
  // Variations sur l'initialisation de boucle (i = 0 → i = 1 a fonctionné)
  { id: 64, line: 116, original: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i++) {', mutated: 'for (let i = 2; i < n && !this.context.isHalted() && this.running; i++) {', description: 'i = 0 → i = 2' },
  { id: 65, line: 116, original: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i++) {', mutated: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i += 2) {', description: 'i++ → i += 2' },
  
  // Variations sur les valeurs de retour (+1 a fonctionné)
  { id: 66, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, instructionsExecuted: this.statistics.instructionsExecuted + 2 };', description: '+2 to instructionsExecuted in return' },
  { id: 67, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, cycles: this.statistics.cycles + 2 };', description: '+2 to cycles in return' },
  { id: 68, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, branchesNotTaken: this.statistics.branchesNotTaken + 1 };', description: '+1 to branchesNotTaken in return' },
  { id: 69, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, calls: this.statistics.calls + 1 };', description: '+1 to calls in return' },
  { id: 70, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, returns: this.statistics.returns + 1 };', description: '+1 to returns in return' },
  
  // Variations sur setCacheSize (size * 2 et size + 1 ont fonctionné)
  { id: 71, line: 222, original: 'this.fetch.setCacheSize(size);', mutated: 'this.fetch.setCacheSize(size * 3);', description: 'size * 3' },
  { id: 72, line: 222, original: 'this.fetch.setCacheSize(size);', mutated: 'this.fetch.setCacheSize(size + 2);', description: 'size + 2' },
  { id: 73, line: 222, original: 'this.fetch.setCacheSize(size);', mutated: 'this.fetch.setCacheSize(size - 1);', description: 'size - 1' },
  
  // Variations sur les suppressions de calls (remove reset a fonctionné)
  { id: 74, line: 134, original: 'this.context.reset();', mutated: '// context.reset removed', description: 'remove context.reset' },
  { id: 75, line: 135, original: 'this.fetch.clearCache();', mutated: '// clearCache removed', description: 'remove clearCache' },
  { id: 76, line: 136, original: 'this.statistics = this.initializeStatistics();', mutated: '// statistics reset removed', description: 'remove statistics reset' },
  { id: 77, line: 127, original: 'this.running = false;', mutated: '// stop removed', description: 'remove stop' },
  
  // Variations sur getCacheStatistics (return null a fonctionné)
  { id: 78, line: 201, original: 'return this.fetch.getCacheStatistics();', mutated: 'return { hits: 1, misses: 0 };', description: 'return stats with hits=1' },
  { id: 79, line: 201, original: 'return this.fetch.getCacheStatistics();', mutated: 'return { hits: 0, misses: 1 };', description: 'return stats with misses=1' },
  { id: 80, line: 201, original: 'return this.fetch.getCacheStatistics();', mutated: 'return { hits: 1, misses: 1 };', description: 'return stats with hits=1, misses=1' },
  
  // Variations sur step (return null a fonctionné)
  { id: 81, line: 194, original: 'return this.cycle();', mutated: 'return undefined;', description: 'return undefined instead of cycle' },
  
  // Variations sur les constantes dans initializeStatistics (0 → 1 n'a pas fonctionné, mais on essaie d'autres approches)
  { id: 82, line: 43, original: 'instructionsExecuted: 0,', mutated: 'instructionsExecuted: 2,', description: '0 → 2' },
  { id: 83, line: 44, original: 'cycles: 0,', mutated: 'cycles: 2,', description: '0 → 2' },
];

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log('=== Phase 4 - Audit par mutation ciblée - execution-pipeline ===\n');
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
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase4.json', JSON.stringify(results, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-phase4.json', JSON.stringify({
  total: results.length,
  killed,
  survived,
  invalid,
  validTotal,
  mutationScore: parseFloat(mutationScore)
}, null, 2));

const report = `# Audit par mutation ciblée - execution-pipeline (Phase 4)

## Objectif

Mutations supplémentaires basées sur les patterns VALIDES des phases précédentes pour atteindre 30+ mutations valides.

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

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-report-phase4.md', report);

// Affichage demandé
console.log('\n=== Résultats Phase 4 ===');
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
console.log(`Nombre total de mutations valides: ${validTotal}`);
console.log(`\nSHA initial: ${initialSha}`);
console.log(`SHA final: ${finalSha}`);
console.log(`SHA identique: ${initialSha === finalSha ? 'OK' : 'DIFFÉRENT'}`);
