const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// 30+ mutations VALIDES ciblées (évitant les patterns qui causent INVALID)
const mutations = [
  // Opérateurs sur les compteurs (lignes 74-92)
  { id: 1, line: 74, original: 'this.statistics.instructionsExecuted++;', mutated: 'this.statistics.instructionsExecuted += 2;', description: '+=2 instead of ++' },
  { id: 2, line: 75, original: 'this.statistics.cycles++;', mutated: 'this.statistics.cycles += 2;', description: '+=2 instead of ++' },
  { id: 3, line: 78, original: 'this.statistics.branchesTaken++;', mutated: 'this.statistics.branchesTaken += 2;', description: '+=2 instead of ++' },
  { id: 4, line: 80, original: 'this.statistics.branchesNotTaken++;', mutated: 'this.statistics.branchesNotTaken += 2;', description: '+=2 instead of ++' },
  { id: 5, line: 84, original: 'this.statistics.calls++;', mutated: 'this.statistics.calls += 2;', description: '+=2 instead of ++' },
  { id: 6, line: 88, original: 'this.statistics.returns++;', mutated: 'this.statistics.returns += 2;', description: '+=2 instead of ++' },
  { id: 7, line: 92, original: 'this.statistics.errors++;', mutated: 'this.statistics.errors += 2;', description: '+=2 instead of ++' },
  
  // Conditions non critiques (lignes 77-89)
  { id: 8, line: 77, original: 'if (result.branchTaken) {', mutated: 'if (!result.branchTaken) {', description: 'invert branchTaken' },
  { id: 9, line: 79, original: 'else if (result.branchTaken === false) {', mutated: 'else if (result.branchTaken !== false) {', description: '!== instead of ===' },
  { id: 10, line: 83, original: 'if (decoded.isCall) {', mutated: 'if (!decoded.isCall) {', description: 'invert isCall' },
  { id: 11, line: 87, original: 'if (decoded.isReturn) {', mutated: 'if (!decoded.isReturn) {', description: 'invert isReturn' },
  
  // Constantes dans initializeStatistics (lignes 43-49)
  { id: 12, line: 43, original: 'instructionsExecuted: 0,', mutated: 'instructionsExecuted: 1,', description: '0 → 1' },
  { id: 13, line: 44, original: 'cycles: 0,', mutated: 'cycles: 1,', description: '0 → 1' },
  { id: 14, line: 45, original: 'branchesTaken: 0,', mutated: 'branchesTaken: 1,', description: '0 → 1' },
  { id: 15, line: 46, original: 'branchesNotTaken: 0,', mutated: 'branchesNotTaken: 1,', description: '0 → 1' },
  { id: 16, line: 47, original: 'calls: 0,', mutated: 'calls: 1,', description: '0 → 1' },
  { id: 17, line: 48, original: 'returns: 0,', mutated: 'returns: 1,', description: '0 → 1' },
  { id: 18, line: 49, original: 'errors: 0,', mutated: 'errors: 1,', description: '0 → 1' },
  
  // Opérateurs de comparaison dans validate (lignes 234, 239)
  { id: 19, line: 234, original: 'if (this.context.getProgramCounter() < 0) {', mutated: 'if (this.context.getProgramCounter() <= 0) {', description: '< → <=' },
  { id: 20, line: 239, original: 'if (this.context.getProgramCounter() >= bytecode.length) {', mutated: 'if (this.context.getProgramCounter() > bytecode.length) {', description: '>= → >' },
  { id: 21, line: 244, original: 'valid: errors.length === 0,', mutated: 'valid: errors.length !== 0,', description: '=== → !==' },
  
  // Valeurs de retour modifiées (ligne 144)
  { id: 22, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, instructionsExecuted: this.statistics.instructionsExecuted + 1 };', description: '+1 to instructionsExecuted in return' },
  { id: 23, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, cycles: this.statistics.cycles + 1 };', description: '+1 to cycles in return' },
  { id: 24, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, branchesTaken: this.statistics.branchesTaken + 1 };', description: '+1 to branchesTaken in return' },
  { id: 25, line: 144, original: 'return { ...this.statistics };', mutated: 'return { ...this.statistics, errors: this.statistics.errors + 1 };', description: '+1 to errors in return' },
  
  // Conditions booléennes dans runCycles (ligne 116)
  { id: 26, line: 116, original: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i++) {', mutated: 'for (let i = 0; i <= n && !this.context.isHalted() && this.running; i++) {', description: '< → <=' },
  { id: 27, line: 116, original: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i++) {', mutated: 'for (let i = 1; i < n && !this.context.isHalted() && this.running; i++) {', description: 'i = 0 → i = 1' },
  
  // Opérateurs logiques (lignes 105, 116)
  { id: 28, line: 105, original: 'while (!this.context.isHalted() && this.running) {', mutated: 'while (!this.context.isHalted() || this.running) {', description: '&& → ||' },
  { id: 29, line: 116, original: 'for (let i = 0; i < n && !this.context.isHalted() && this.running; i++) {', mutated: 'for (let i = 0; i < n && !this.context.isHalted() || this.running; i++) {', description: '&& → ||' },
  
  // Constantes booléennes (lignes 28, 103, 137)
  { id: 30, line: 28, original: 'private running: boolean = false;', mutated: 'private running: boolean = true;', description: 'false → true' },
  { id: 31, line: 103, original: 'this.running = true;', mutated: 'this.running = false;', description: 'true → false' },
  { id: 32, line: 137, original: 'this.running = false;', mutated: 'this.running = true;', description: 'false → true' },
  
  // Opérateurs sur les compteurs (alternatives)
  { id: 33, line: 74, original: 'this.statistics.instructionsExecuted++;', mutated: 'this.statistics.instructionsExecuted += 3;', description: '+=3 instead of ++' },
  { id: 34, line: 75, original: 'this.statistics.cycles++;', mutated: 'this.statistics.cycles += 3;', description: '+=3 instead of ++' },
  { id: 35, line: 78, original: 'this.statistics.branchesTaken++;', mutated: 'this.statistics.branchesTaken += 3;', description: '+=3 instead of ++' },
];

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log('=== Phase 2 - Audit par mutation ciblée - execution-pipeline ===\n');
console.log(`Total mutations: ${mutations.length}\n`);

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

mutations.forEach((mutation, index) => {
  console.log(`Mutation ${mutation.id}/${mutations.length}: ${mutation.description}`);
  
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
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase2.json', JSON.stringify(results, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-phase2.json', JSON.stringify({
  total: results.length,
  killed,
  survived,
  invalid,
  validTotal,
  mutationScore: parseFloat(mutationScore)
}, null, 2));

const report = `# Audit par mutation ciblée - execution-pipeline (Phase 2)

## Objectif

Augmenter le nombre de mutations VALIDES pour obtenir un échantillon statistiquement représentatif.

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

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-report-phase2.md', report);

// Affichage demandé
console.log('\n=== Résultats Phase 2 ===');
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
console.log(`Nombre total de mutations valides: ${validTotal}`);
console.log(`\nSHA initial: ${initialSha}`);
console.log(`SHA final: ${finalSha}`);
console.log(`SHA identique: ${initialSha === finalSha ? 'OK' : 'DIFFÉRENT'}`);
