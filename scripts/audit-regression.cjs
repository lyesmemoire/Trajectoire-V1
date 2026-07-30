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
    line: 135,
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

console.log('=== Audit de régression fonctionnelle - execution-pipeline ===\n');
console.log(`Régressions à tester: ${regressions.length}\n`);

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

// SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

regressions.forEach((regression) => {
  console.log(`Test ${regression.id}: ${regression.description}`);
  
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  let compilation = 'KO';
  let testsExecuted = false;
  let testsPassed = 0;
  let testsFailed = 0;
  let exitCode = null;
  let duration = 0;
  let status = 'UNKNOWN';
  
  const startTime = Date.now();
  
  try {
    // Appliquer régression
    const mutatedLines = [...originalLines];
    const lineIndex = regression.line - 1;
    
    if (lineIndex >= 0 && lineIndex < mutatedLines.length) {
      if (regression.mutated === '') {
        // Supprimer la ligne
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
    
    // Exécuter tests
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 20000,
        encoding: 'utf8'
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
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
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
      status
    });
  }
});

// Vérifier SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (e) {}

// Calculer les métriques
const detected = results.filter(r => r.status === 'REGRESSION DETECTED').length;
const missed = results.filter(r => r.status === 'REGRESSION MISSED').length;
const buildErrors = results.filter(r => r.status === 'BUILD ERROR').length;
const total = results.length;
const detectionRate = total > 0 ? ((detected / total) * 100).toFixed(2) : 0;

// Détection par fonction
const byFunction = {};
results.forEach(r => {
  if (!byFunction[r.category]) {
    byFunction[r.category] = { detected: 0, missed: 0, buildErrors: 0, total: 0 };
  }
  byFunction[r.category].total++;
  if (r.status === 'REGRESSION DETECTED') byFunction[r.category].detected++;
  else if (r.status === 'REGRESSION MISSED') byFunction[r.category].missed++;
  else byFunction[r.category].buildErrors++;
});

// Régressions manquées critiques
const missedCritical = results.filter(r => r.status === 'REGRESSION MISSED' && r.critical).length;

// Certification
let certification = 'FAILED';
if (parseFloat(detectionRate) >= 95 && missedCritical === 0) {
  certification = 'ENTERPRISE GOLD';
} else if (parseFloat(detectionRate) >= 90) {
  certification = 'ENTERPRISE SILVER';
} else if (parseFloat(detectionRate) >= 80) {
  certification = 'ENTERPRISE BRONZE';
}

// Créer le répertoire
const reportDir = 'c:/Trajectoire/reports/runtime/regression/';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// Sauvegarder les rapports
fs.writeFileSync(reportDir + 'regression-results.json', JSON.stringify(results, null, 2));
fs.writeFileSync(reportDir + 'regression-summary.json', JSON.stringify({
  total,
  detected,
  missed,
  buildErrors,
  detectionRate: parseFloat(detectionRate),
  missedCritical,
  certification
}, null, 2));
fs.writeFileSync(reportDir + 'regression-by-function.json', JSON.stringify(byFunction, null, 2));

const table = `| ID | Description | Catégorie | Critique | Compilation | Tests | Exit code | Status |
${results.map(r => `| ${r.id} | ${r.description} | ${r.category} | ${r.critical ? 'Oui' : 'Non'} | ${r.compilation} | ${r.testsExecuted ? 'oui' : 'non'} | ${r.exitCode || 'N/A'} | ${r.status} |`).join('\n')}`;

const report = `# Audit de régression fonctionnelle - execution-pipeline

## Résumé

| Total régressions | ${total} |
| Détectées | ${detected} |
| Non détectées | ${missed} |
| Build errors | ${buildErrors} |
| Regression Detection Rate | ${detectionRate}% |
| Régressions manquées critiques | ${missedCritical} |

## Certification

**${certification}**

## Tableau des régressions

${table}

## Détection par fonction

${Object.entries(byFunction).map(([func, stats]) => `
### ${func}
- Total: ${stats.total}
- Détectées: ${stats.detected}
- Non détectées: ${stats.missed}
- Build errors: ${stats.buildErrors}
- Taux de détection: ${((stats.detected / stats.total) * 100).toFixed(2)}%
`).join('\n')}

## SHA

| SHA avant | ${initialSha} |
| SHA après | ${finalSha} |
| Identique | ${initialSha === finalSha ? 'OUI' : 'NON'} |

## Note

Cet audit simule de vraies régressions qu'un développeur pourrait introduire. Chaque régression a été appliquée, compilée et testée individuellement, puis le fichier a été restauré. Le SHA Git a été vérifié avant et après pour garantir l'intégrité du dépôt.
`;

fs.writeFileSync(reportDir + 'regression-report.md', report);

const decision = `# Décision finale - Audit de régression fonctionnelle

## Certification

**${certification}**

## Justification

${certification === 'ENTERPRISE GOLD' ? 
  'L\'audit atteint la certification ENTERPRISE GOLD car le taux de détection des régressions est ≥ 95% et aucune régression critique n\'a été manquée.' :
  certification === 'ENTERPRISE SILVER' ?
  'L\'audit atteint la certification ENTERPRISE SILVER car le taux de détection des régressions est ≥ 90%.' :
  certification === 'ENTERPRISE BRONZE' ?
  'L\'audit atteint la certification ENTERPRISE BRONZE car le taux de détection des régressions est ≥ 80%.' :
  'L\'audit échoue car le taux de détection des régressions est < 80%.'
}

## Régressions manquées

${missed > 0 ? results.filter(r => r.status === 'REGRESSION MISSED').map(r => `- **${r.id}**: ${r.description} (${r.critical ? 'CRITIQUE' : 'non critique'})`).join('\n') : 'Aucune'}

## Recommandations

${missedCritical > 0 ? 'Des régressions critiques n\'ont pas été détectées. Il est recommandé d\'améliorer les tests pour couvrir ces scénarios.' : 
  missed > 0 ? 'Certaines régressions non critiques n\'ont pas été détectées. Considérez d\'ajouter des tests pour ces cas.' :
  'Excellent taux de détection. Les tests protègent efficacement le comportement métier.'
}
`;

fs.writeFileSync(reportDir + 'regression-final-decision.md', decision);

console.log('=== Résultats Audit de Régression ===');
console.log(`\nTotal régressions: ${total}`);
console.log(`Détectées: ${detected}`);
console.log(`Non détectées: ${missed}`);
console.log(`Build errors: ${buildErrors}`);
console.log(`Regression Detection Rate: ${detectionRate}%`);
console.log(`\nCertification: ${certification}`);
console.log(`\nSHA avant: ${initialSha}`);
console.log(`SHA après: ${finalSha}`);
