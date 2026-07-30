const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

// 20+ régressions fonctionnelles
const regressions = [
  {
    id: 'R1',
    description: 'Supprimer fetch()',
    line: 64,
    original: 'const fetchResult = this.fetch.fetch(pc);',
    mutated: '// fetch removed',
    category: 'Pipeline',
    critical: true
  },
  {
    id: 'R2',
    description: 'Supprimer decode()',
    line: 68,
    original: 'const decoded = this.decode.decode(fetchResult.instruction);',
    mutated: '// decode removed',
    category: 'Pipeline',
    critical: true
  },
  {
    id: 'R3',
    description: 'Supprimer execute()',
    line: 71,
    original: 'const result = this.execute.execute(decoded);',
    mutated: '// execute removed',
    category: 'Pipeline',
    critical: true
  },
  {
    id: 'R4',
    description: 'Inverser fetch/decode (decode avant fetch)',
    line: 64,
    original: 'const fetchResult = this.fetch.fetch(pc);',
    mutated: 'const decoded = this.decode.decode(new Uint8Array());',
    category: 'Pipeline',
    critical: true
  },
  {
    id: 'R5',
    description: 'Supprimer stop()',
    line: 127,
    original: 'this.running = false;',
    mutated: '// stop removed',
    category: 'Control',
    critical: true
  },
  {
    id: 'R6',
    description: 'Supprimer reset()',
    line: 134,
    original: 'this.context.reset();',
    mutated: '// context.reset() removed',
    category: 'Control',
    critical: true
  },
  {
    id: 'R7',
    description: 'validate() retourne toujours true',
    line: 228,
    original: 'public validate(): { valid: boolean; errors: string[] } {',
    mutated: 'public validate(): { valid: boolean; errors: string[] } { return { valid: true, errors: [] };',
    category: 'Validation',
    critical: true
  },
  {
    id: 'R8',
    description: 'Supprimer throw sur erreur',
    line: 93,
    original: 'this.context.setError(new Error(result.error || \'Execution error\'));',
    mutated: 'return;',
    category: 'Error Handling',
    critical: true
  },
  {
    id: 'R9',
    description: 'Ne jamais incrémenter instructionsExecuted',
    line: 74,
    original: 'this.statistics.instructionsExecuted++;',
    mutated: '// instructionsExecuted not incremented',
    category: 'Statistics',
    critical: false
  },
  {
    id: 'R10',
    description: 'Ne jamais incrémenter cycles',
    line: 75,
    original: 'this.statistics.cycles++;',
    mutated: '// cycles not incremented',
    category: 'Statistics',
    critical: false
  },
  {
    id: 'R11',
    description: 'Ne jamais incrémenter errors',
    line: 92,
    original: 'this.statistics.errors++;',
    mutated: '// errors not incremented',
    category: 'Statistics',
    critical: false
  },
  {
    id: 'R12',
    description: 'Ignorer branchTaken (ne pas incrémenter branchesTaken)',
    line: 78,
    original: 'if (result.branchTaken) {',
    mutated: 'if (false) {',
    category: 'Branch',
    critical: false
  },
  {
    id: 'R13',
    description: 'Ignorer CALL (ne pas incrémenter calls)',
    line: 84,
    original: 'if (decoded.isCall) {',
    mutated: 'if (false) {',
    category: 'Branch',
    critical: false
  },
  {
    id: 'R14',
    description: 'Ignorer RETURN (ne pas incrémenter returns)',
    line: 87,
    original: 'if (decoded.isReturn) {',
    mutated: 'if (false) {',
    category: 'Branch',
    critical: false
  },
  {
    id: 'R15',
    description: 'getStatistics() retourne {}',
    line: 144,
    original: 'return { ...this.statistics };',
    mutated: 'return {};',
    category: 'Statistics',
    critical: true
  },
  {
    id: 'R16',
    description: 'getStatistics() retourne des statistiques fixes',
    line: 144,
    original: 'return { ...this.statistics };',
    mutated: 'return { instructionsExecuted: 0, cycles: 0, branchesTaken: 0, branchesNotTaken: 0, calls: 0, returns: 0, errors: 0 };',
    category: 'Statistics',
    critical: true
  },
  {
    id: 'R17',
    description: 'Ignorer halt (inverser condition)',
    line: 57,
    original: 'if (this.context.isHalted()) {',
    mutated: 'if (!this.context.isHalted()) {',
    category: 'Control',
    critical: true
  },
  {
    id: 'R18',
    description: 'Ignorer validation PC overflow',
    line: 239,
    original: 'if (this.context.getProgramCounter() >= bytecode.length) {',
    mutated: 'if (false) {',
    category: 'Validation',
    critical: true
  },
  {
    id: 'R19',
    description: 'Supprimer remise à zéro des statistiques dans reset()',
    line: 136,
    original: 'this.statistics = this.initializeStatistics();',
    mutated: '// statistics not reset',
    category: 'Control',
    critical: false
  },
  {
    id: 'R20',
    description: 'Inverser condition de validation (valid: errors.length !== 0)',
    line: 244,
    original: 'valid: errors.length === 0,',
    mutated: 'valid: errors.length !== 0,',
    category: 'Validation',
    critical: true
  },
  {
    id: 'R21',
    description: 'Supprimer commit (ne pas mettre à jour les statistiques après exécution)',
    line: 74,
    original: 'this.statistics.instructionsExecuted++;',
    mutated: '// commit removed',
    category: 'Pipeline',
    critical: true
  },
  {
    id: 'R22',
    description: 'Ignorer branchNotTaken',
    line: 79,
    original: 'else if (result.branchTaken === false) {',
    mutated: 'else if (false) {',
    category: 'Branch',
    critical: false
  }
];

console.log('=== Audit de régression fonctionnelle - execution-pipeline (STABLE MODE) ===\n');
console.log(`Régressions à tester: ${regressions.length}\n`);

// Fonction pour nettoyer les caches
function clearCaches() {
  try {
    // Nettoyer le cache Vitest
    const vitestCacheDirs = [
      'c:/Trajectoire/node_modules/.vitest',
      'c:/Trajectoire/.vitest'
    ];
    vitestCacheDirs.forEach(dir => {
      try {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
      } catch (e) {
        // Ignorer les erreurs individuelles
      }
    });
    
    // Nettoyer le cache TypeScript
    const tsCacheDirs = [
      'c:/Trajectoire/node_modules/.cache',
      'c:/Trajectoire/.cache'
    ];
    tsCacheDirs.forEach(dir => {
      try {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
      } catch (e) {
        // Ignorer les erreurs individuelles
      }
    });
  } catch (e) {
    // Ignorer toutes les erreurs de nettoyage
  }
}

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

// Diff git initial
let initialDiff = '';
try {
  initialDiff = execSync('cd c:/Trajectoire && git diff', { encoding: 'utf8' }).trim();
} catch (e) {}

console.log(`SHA initial: ${initialSha}`);
console.log(`Diff git initial: ${initialDiff ? 'NON VIDE - ARRET' : 'VIDE - OK'}\n`);

if (initialDiff) {
  console.log('ERREUR: Le dépôt n\'est pas propre. Diff git:');
  console.log(initialDiff);
  process.exit(1);
}

regressions.forEach((regression, index) => {
  console.log(`\n=== Test ${regression.id}: ${regression.description} ===`);
  console.log(`Index: ${index + 1}/${regressions.length}`);
  
  // Diff git avant mutation
  let diffBefore = '';
  try {
    diffBefore = execSync('cd c:/Trajectoire && git diff', { encoding: 'utf8' }).trim();
  } catch (e) {}
  console.log(`Diff git avant: ${diffBefore ? 'NON VIDE - ARRET' : 'VIDE'}`);
  
  if (diffBefore) {
    console.log('ERREUR: Le dépôt n\'est pas propre avant mutation. Diff:');
    console.log(diffBefore);
    process.exit(1);
  }
  
  const startTime = Date.now();
  let compilation = 'KO';
  let testsExecuted = false;
  let testsPassed = 0;
  let testsFailed = 0;
  let exitCode = null;
  let duration = 0;
  let status = 'UNKNOWN';
  let timeoutOccurred = false;
  
  try {
    // Appliquer régression
    const mutatedLines = [...originalLines];
    const lineIndex = regression.line - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      if (regression.mutated === '') {
        mutatedLines.splice(lineIndex, 1);
      } else {
        mutatedLines[lineIndex] = regression.mutated;
      }
      fs.writeFileSync(filePath, mutatedLines.join('\n'));
    } else {
      throw new Error('Ligne hors limites');
    }
    
    // Compiler
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
      compilation = 'OK';
    } catch (compileError) {
      compilation = 'KO';
      status = 'BUILD ERROR';
      console.log(`  Compilation: KO`);
      console.log(`  Status: BUILD ERROR\n`);
      throw new Error('Compilation échouée');
    }
    
    console.log(`  Compilation: OK`);
    
    // Exécuter tests avec options pour éviter le cache et les workers
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath} --no-cache --no-coverage --reporter=verbose`, { 
        stdio: 'pipe', 
        timeout: 15000, // Timeout réduit pour éviter les timeouts longs
        encoding: 'utf8',
        env: {
          ...process.env,
          NODE_OPTIONS: '--no-warnings'
        }
      });
      
      // Tests passent
      testsExecuted = true;
      exitCode = 0;
      status = 'REGRESSION MISSED';
      
      const match = testOutput.match(/Tests\s+(\d+)\s+passed/);
      if (match) {
        testsPassed = parseInt(match[1]);
      }
      
      console.log(`  Tests: ${testsPassed} passed`);
      console.log(`  Status: REGRESSION MISSED\n`);
      
    } catch (testError) {
      testsExecuted = true;
      exitCode = testError.status || testError.signal || 1;
      
      const stdout = testError.stdout || '';
      const stderr = testError.stderr || '';
      const errorOutput = stdout + stderr;
      
      const passedMatch = errorOutput.match(/(\d+)\s+passed/);
      const failedMatch = errorOutput.match(/(\d+)\s+failed/);
      
      if (passedMatch) testsPassed = parseInt(passedMatch[1]);
      if (failedMatch) testsFailed = parseInt(failedMatch[1]);
      
      if (testError.killed || testError.signal === 'SIGTERM' || errorOutput.includes('timeout')) {
        timeoutOccurred = true;
        status = 'BUILD ERROR';
        console.log(`  Tests: TIMEOUT`);
        console.log(`  Status: BUILD ERROR\n`);
      } else if (exitCode !== 0 && testsFailed > 0) {
        status = 'REGRESSION DETECTED';
        console.log(`  Tests: ${testsFailed} failed, ${testsPassed} passed`);
        console.log(`  Exit code: ${exitCode}`);
        console.log(`  Status: REGRESSION DETECTED\n`);
      } else {
        status = 'BUILD ERROR';
        console.log(`  Tests: Erreur technique`);
        console.log(`  Status: BUILD ERROR\n`);
      }
    }
    
  } catch (error) {
    if (status === 'UNKNOWN') {
      status = 'BUILD ERROR';
    }
  } finally {
    duration = Date.now() - startTime;
    
    // Restaurer
    fs.writeFileSync(filePath, originalContent);
    
    // Diff git après restauration
    let diffAfter = '';
    try {
      diffAfter = execSync('cd c:/Trajectoire && git diff', { encoding: 'utf8' }).trim();
    } catch (e) {}
    
    if (diffAfter) {
      console.log('ERREUR: Le dépôt n\'est pas propre après restauration. Diff:');
      console.log(diffAfter);
      process.exit(1);
    }
    
    results.push({
      id: regression.id,
      description: regression.description,
      category: regression.category,
      critical: regression.critical,
      compilation,
      testsExecuted,
      testsPassed,
      testsFailed,
      exitCode,
      duration,
      timeoutOccurred,
      status
    });
  }
});

// Vérifier SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

// Diff git final
let finalDiff = '';
try {
  finalDiff = execSync('cd c:/Trajectoire && git diff', { encoding: 'utf8' }).trim();
} catch (e) {}

console.log(`\n=== Résultats Audit de Régression ===`);
console.log(`\nTotal régressions: ${results.length}`);
const detected = results.filter(r => r.status === 'REGRESSION DETECTED').length;
const missed = results.filter(r => r.status === 'REGRESSION MISSED').length;
const buildErrors = results.filter(r => r.status === 'BUILD ERROR').length;
const detectionRate = results.length > 0 ? ((detected / results.length) * 100).toFixed(2) : 0;

console.log(`Détectées: ${detected}`);
console.log(`Non détectées: ${missed}`);
console.log(`Build errors: ${buildErrors}`);
console.log(`Regression Detection Rate: ${detectionRate}%`);

// Certification
let certification = 'FAILED';
if (parseFloat(detectionRate) >= 95 && missed === 0) {
  certification = 'ENTERPRISE GOLD';
} else if (parseFloat(detectionRate) >= 90) {
  certification = 'ENTERPRISE SILVER';
} else if (parseFloat(detectionRate) >= 80) {
  certification = 'ENTERPRISE BRONZE';
}

console.log(`\nCertification: ${certification}`);
console.log(`\nSHA avant: ${initialSha}`);
console.log(`SHA après: ${finalSha}`);
console.log(`SHA identique: ${initialSha === finalSha ? 'OUI' : 'NON'}`);
console.log(`Diff git final: ${finalDiff ? 'NON VIDE' : 'VIDE'}`);

// Créer le répertoire
const reportDir = 'c:/Trajectoire/reports/runtime/regression/';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// Sauvegarder les résultats
fs.writeFileSync(reportDir + 'regression-stable-results.json', JSON.stringify(results, null, 2));

console.log(`\nRésultats sauvegardés dans: ${reportDir}regression-stable-results.json`);
