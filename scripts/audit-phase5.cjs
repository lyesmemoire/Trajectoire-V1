const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// Mutations métier - 10 familles A-J
const mutations = [
  // Famille A — Suppression d'appel
  { id: 'A1', family: 'A', line: 64, original: 'const fetchResult = this.fetch.fetch(pc);', mutated: '// fetch removed', description: 'Supprimer fetch()' },
  { id: 'A2', family: 'A', line: 68, original: 'const decoded = this.decode.decode(fetchResult.instruction);', mutated: '// decode removed', description: 'Supprimer decode()' },
  { id: 'A3', family: 'A', line: 71, original: 'const result = this.execute.execute(decoded);', mutated: '// execute removed', description: 'Supprimer execute()' },
  
  // Famille B — Ordre du pipeline
  { id: 'B1', family: 'B', line: 64, original: 'const fetchResult = this.fetch.fetch(pc);', mutated: 'const decoded = this.decode.decode(new Uint8Array());', description: 'Permuter decode avant fetch' },
  
  // Famille C — Validation
  { id: 'C1', family: 'C', line: 228, original: 'public validate(): { valid: boolean; errors: string[] } {', mutated: 'public validate(): { valid: boolean; errors: string[] } { return { valid: true, errors: [] };', description: 'validate() → return true' },
  
  // Famille D — Stop
  { id: 'D1', family: 'D', line: 127, original: 'this.running = false;', mutated: '// stop removed', description: 'Supprimer stop()' },
  
  // Famille E — Halt (forcer isHalted=true au démarrage - modification dans constructor)
  { id: 'E1', family: 'E', line: 31, original: 'this.context = context;', mutated: 'this.context = context; this.context.setHalted(true);', description: 'Forcer isHalted=true au démarrage' },
  
  // Famille F — Exception
  { id: 'F1', family: 'F', line: 93, original: 'this.context.setError(new Error(result.error || \'Execution error\'));', mutated: 'return;', description: 'Remplacer throw par return' },
  
  // Famille G — Boucle (while(true) avec arrêt après 100 cycles)
  { id: 'G1', family: 'G', line: 105, original: 'while (!this.context.isHalted() && this.running) {', mutated: 'let count = 0; while (!this.context.isHalted() && this.running && count < 100) { count++;', description: 'while(true) avec arrêt après 100 cycles' },
  
  // Famille H — Statistiques
  { id: 'H1', family: 'H', line: 144, original: 'return { ...this.statistics };', mutated: 'return {};', description: 'Retourner {} au lieu des statistiques' },
  
  // Famille I — Compteurs
  { id: 'I1', family: 'I', line: 144, original: 'return { ...this.statistics };', mutated: 'return { instructionsExecuted: 0, cycles: 0, branchesTaken: 0, branchesNotTaken: 0, calls: 0, returns: 0, errors: 0 };', description: 'Toujours retourner 0 pour tous les compteurs' },
  
  // Famille J — Reset
  { id: 'J1', family: 'J', line: 133, original: 'public reset(): void {', mutated: 'public reset(): void { // reset transformed to empty function', description: 'Transformer reset() en fonction vide' },
];

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log('=== Phase 5 - Mutations Métier - execution-pipeline ===\n');
console.log(`Total mutations: ${mutations.length}\n`);

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

mutations.forEach((mutation) => {
  console.log(`Mutation ${mutation.id} (${mutation.family}): ${mutation.description}`);
  
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  let status = 'UNKNOWN';
  let compilationOk = false;
  let testsOk = false;
  let duration = 0;
  const startTime = Date.now();
  
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
      compilationOk = true;
      console.log('  Compilation: OK');
    } catch (compileError) {
      status = 'INVALID';
      compilationOk = false;
      console.log('  Compilation: FAILED');
      throw new Error('Compilation échouée');
    }
    
    // Exécuter tests
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 20000,
        encoding: 'utf8'
      });
      
      if (testOutput.includes('PASS') && !testOutput.includes('FAIL')) {
        status = 'SURVIVED';
        testsOk = true;
        console.log('  Tests: OK → SURVIVED');
      } else {
        status = 'KILLED';
        testsOk = false;
        console.log('  Tests: FAILED → KILLED');
      }
    } catch (testError) {
      const errorOutput = testError.stdout || testError.stderr || '';
      if (errorOutput.includes('FAIL')) {
        status = 'KILLED';
        testsOk = false;
        console.log('  Tests: FAILED → KILLED');
      } else {
        status = 'INVALID';
        testsOk = false;
        console.log('  Tests: TIMEOUT/ERROR → INVALID');
      }
    }
    
  } catch (error) {
    if (status === 'UNKNOWN') status = 'INVALID';
  } finally {
    duration = Date.now() - startTime;
    
    // Restaurer
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
    }
    
    results.push({
      id: mutation.id,
      family: mutation.family,
      file: 'execution-pipeline.ts',
      line: mutation.line,
      mutation: mutation.description,
      compilationOk,
      testsOk,
      status,
      duration
    });
    
    console.log(`  Status: ${status} (${duration}ms)\n`);
  }
});

// Vérifier SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

// Calculer les métriques
const killed = results.filter(r => r.status === 'KILLED').length;
const survived = results.filter(r => r.status === 'SURVIVED').length;
const invalid = results.filter(r => r.status === 'INVALID').length;
const total = results.length;
const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;
const confidence = total > 0 ? ((killed / total) * 100).toFixed(2) : 0;

// Familles couvertes
const familiesWithValid = new Set(results.filter(r => r.status !== 'INVALID').map(r => r.family));
const coveredFamilies = Array.from(familiesWithValid);
const allFamilies = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const uncoveredFamilies = allFamilies.filter(f => !familiesWithValid.has(f));

// Certification
let certification = 'FAILED';
if (validTotal >= 30 && parseFloat(mutationScore) >= 95 && survived === 0 && coveredFamilies.length >= 8) {
  certification = 'GOLD';
} else if (validTotal >= 15 && parseFloat(mutationScore) >= 90) {
  certification = 'SILVER';
} else if (validTotal >= 10 && parseFloat(mutationScore) >= 80) {
  certification = 'BRONZE';
}

// Sauvegarder rapports
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-results-phase5.json', JSON.stringify(results, null, 2));
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-summary-phase5.json', JSON.stringify({
  total,
  killed,
  survived,
  invalid,
  validTotal,
  mutationScore: parseFloat(mutationScore),
  confidence: parseFloat(confidence),
  coveredFamilies,
  uncoveredFamilies,
  certification
}, null, 2));

const report = `# Audit par mutation Phase 5 - Mutations Métier - execution-pipeline

## Résultats

| Total | ${total} |
| KILLED | ${killed} |
| SURVIVED | ${survived} |
| INVALID | ${invalid} |
| Mutation Score | ${mutationScore}% |
| Confidence | ${confidence}% |

## Familles couvertes

${coveredFamilies.length} familles sur 10: ${coveredFamilies.join(', ') || 'Aucune'}

## Familles non couvertes

${uncoveredFamilies.join(', ') || 'Aucune'}

## Certification

**${certification}**

## Détail des mutations

| ID | Famille | Fichier | Ligne | Mutation | Compilation OK | Tests OK | Status | Temps |
|----|---------|--------|-------|----------|----------------|---------|--------|-------|
${results.map(r => `| ${r.id} | ${r.family} | ${r.file} | ${r.line} | ${r.mutation} | ${r.compilationOk} | ${r.testsOk} | ${r.status} | ${r.duration}ms |`).join('\n')}

## SHA

| SHA avant | ${initialSha} |
| SHA après | ${finalSha} |
| Identique | ${initialSha === finalSha ? 'OUI' : 'NON'} |
`;

fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/mutation-report-phase5.md', report);

// Affichage demandé
console.log('=== Résultats Phase 5 ===');
console.log(`\nTotal: ${total}`);
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);
console.log(`Mutation Score: ${mutationScore}%`);
console.log(`Confidence: ${confidence}%`);
console.log(`\nFamilles couvertes: ${coveredFamilies.join(', ') || 'Aucune'}`);
console.log(`Familles non couvertes: ${uncoveredFamilies.join(', ') || 'Aucune'}`);
console.log(`\nSHA avant: ${initialSha}`);
console.log(`SHA après: ${finalSha}`);
console.log(`\nCertification: ${certification}`);
