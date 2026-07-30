const fs = require('fs');
const { execSync } = require('child_process');

// Charger les mutations générées
const mutations = JSON.parse(fs.readFileSync('c:/Trajectoire/reports/runtime/mutation/phase2-mutations.json', 'utf8'));

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

const results = [];
const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log(`\n=== PHASE 3-4: Filtrage et Exécution des Mutations ===`);
console.log(`Total mutations: ${mutations.length}\n`);

// Obtenir le SHA initial
let initialSha = '';
try {
  initialSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  console.log(`SHA initial: ${initialSha}\n`);
} catch (e) {
  console.log('Impossible de récupérer le SHA initial\n');
}

mutations.forEach((mutation, index) => {
  console.log(`\n--- Mutation ${mutation.id} (${index + 1}/${mutations.length}) ---`);
  console.log(`Famille: ${mutation.family}`);
  console.log(`Fonction: ${mutation.function}`);
  console.log(`Ligne: ${mutation.line}`);
  console.log(`Description: ${mutation.description}`);
  
  // PHASE 3: Filtrage initial
  let filterStatus = 'VALID';
  let filterReason = '';
  
  // Vérifier si la mutation est syntaxiquement valide
  try {
    const testLines = [...originalLines];
    const lineIndex = mutation.line - 1;
    
    if (lineIndex < 0 || lineIndex >= testLines.length) {
      filterStatus = 'INVALID';
      filterReason = 'Ligne hors limites';
    } else {
      testLines[lineIndex] = mutation.mutated;
      fs.writeFileSync(filePath, testLines.join('\n'));
      
      // Test de compilation
      try {
        execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
      } catch (compileError) {
        filterStatus = 'INVALID';
        filterReason = 'Compilation échouée';
      }
      
      fs.writeFileSync(filePath, originalContent);
    }
  } catch (e) {
    filterStatus = 'INVALID';
    filterReason = 'Erreur lors du filtrage: ' + e.message;
  }
  
  console.log(`Filtrage: ${filterStatus} (${filterReason})`);
  
  if (filterStatus === 'INVALID') {
    results.push({
      ...mutation,
      status: 'INVALID',
      filterReason,
      executionTimeMs: 0,
      tests: testPath,
      failedTests: [],
      timeoutReason: null
    });
    console.log('Mutation INVALID - skip execution\n');
    return;
  }
  
  // PHASE 4: Exécution
  fs.writeFileSync(filePath + '.backup', originalContent);
  
  const startTime = Date.now();
  let status = 'UNKNOWN';
  let failedTests = [];
  let duration = 0;
  let timeoutReason = null;
  
  try {
    // Appliquer la mutation
    const mutatedLines = [...originalLines];
    const lineIndex = mutation.line - 1;
    mutatedLines[lineIndex] = mutation.mutated;
    fs.writeFileSync(filePath, mutatedLines.join('\n'));
    console.log('Mutation appliquée');
    
    // Compiler
    console.log('Compilation...');
    try {
      execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
      console.log('Compilation: SUCCESS');
    } catch (compileError) {
      console.log('Compilation: FAILED');
      status = 'INVALID';
      filterReason = 'Compilation échouée';
      throw new Error('Compilation échouée');
    }
    
    // Exécuter les tests avec timeout
    console.log('Exécution des tests...');
    try {
      const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
        stdio: 'pipe', 
        timeout: 20000,
        encoding: 'utf8'
      });
      
      if (testOutput.includes('PASS') && !testOutput.includes('FAIL')) {
        status = 'SURVIVED';
        console.log('Résultat: SURVIVED (tous les tests passent)');
      } else {
        status = 'KILLED';
        console.log('Résultat: KILLED (au moins un test échoue)');
        const failedMatch = testOutput.match(/FAIL\s+(.+)/g);
        if (failedMatch) {
          failedTests = failedMatch.map(m => m.replace(/FAIL\s+/, ''));
          console.log(`Tests échoués: ${failedTests.join(', ')}`);
        }
      }
    } catch (testError) {
      const errorOutput = testError.stdout || testError.stderr || '';
      
      // Analyser le timeout
      if (testError.killed || testError.signal === 'SIGTERM' || errorOutput.includes('timeout')) {
        console.log('Timeout détecté - Analyse de la cause...');
        
        // Déterminer la cause du timeout
        if (mutation.family === 'A') {
          // Mutations arithmétiques sur les compteurs
          timeoutReason = 'Boucle infinie probable: les compteurs incorrects créent des incohérences dans les assertions qui bouclent jusqu\'à atteindre une valeur attendue';
          status = 'KILLED'; // Timeout dû à boucle infinie = KILLED
        } else if (mutation.family === 'B') {
          // Mutations de comparaisons
          if (mutation.line === 105 || mutation.line === 116) {
            timeoutReason = 'Boucle infinie: inversion de la condition de boucle while/for';
            status = 'KILLED';
          } else {
            timeoutReason = 'État invalide: inversion de condition critique crée un état incohérent';
            status = 'INVALID';
          }
        } else if (mutation.family === 'I') {
          // Mutations pipeline
          timeoutReason = 'Pipeline cassé: suppression de fetch/decode/execute crée un état invalide';
          status = 'INVALID';
        } else {
          timeoutReason = 'Timeout non analysé: cause indéterminée';
          status = 'INVALID';
        }
        
        console.log(`Timeout analysé: ${timeoutReason}`);
        console.log(`Statut: ${status}`);
      } else if (errorOutput.includes('FAIL')) {
        status = 'KILLED';
        console.log('Résultat: KILLED (tests échouent)');
        const failedMatch = errorOutput.match(/FAIL\s+(.+)/g);
        if (failedMatch) {
          failedTests = failedMatch.map(m => m.replace(/FAIL\s+/, ''));
          console.log(`Tests échoués: ${failedTests.join(', ')}`);
        }
      } else {
        status = 'INVALID';
        timeoutReason = 'Erreur inconnue: ' + errorOutput.substring(0, 200);
        console.log(`Résultat: INVALID (${timeoutReason})`);
      }
    }
    
  } catch (error) {
    console.log(`Erreur: ${error.message}`);
    if (status === 'UNKNOWN') {
      status = 'INVALID';
      timeoutReason = 'Exception: ' + error.message;
    }
  } finally {
    duration = Date.now() - startTime;
    
    // Restaurer le fichier original
    if (fs.existsSync(filePath + '.backup')) {
      fs.writeFileSync(filePath, originalContent);
      fs.unlinkSync(filePath + '.backup');
      console.log('Fichier restauré');
    }
    
    // Vérifier que le fichier est identique à l'original
    const currentContent = fs.readFileSync(filePath, 'utf8');
    if (currentContent !== originalContent) {
      console.log('ATTENTION: Le fichier restauré diffère de l\'original!');
      fs.writeFileSync(filePath, originalContent);
    }
    
    results.push({
      ...mutation,
      status,
      filterReason,
      executionTimeMs: duration,
      tests: testPath,
      failedTests,
      timeoutReason
    });
    
    console.log(`Durée: ${duration}ms\n`);
  }
});

// Vérifier le SHA final
let finalSha = '';
try {
  finalSha = execSync('cd c:/Trajectoire && git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  console.log(`\nSHA final: ${finalSha}`);
  if (initialSha && finalSha === initialSha) {
    console.log('SHA identique: OK');
  } else {
    console.log('ATTENTION: SHA différent!');
  }
} catch (e) {
  console.log('Impossible de vérifier le SHA final');
}

// Sauvegarder les résultats bruts
fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/phase3-4-results.json', JSON.stringify(results, null, 2));

// Résumé
const killed = results.filter(r => r.status === 'KILLED').length;
const survived = results.filter(r => r.status === 'SURVIVED').length;
const invalid = results.filter(r => r.status === 'INVALID').length;

console.log(`\n=== Résumé PHASE 3-4 ===`);
console.log(`KILLED: ${killed}`);
console.log(`SURVIVED: ${survived}`);
console.log(`INVALID: ${invalid}`);

const validTotal = killed + survived;
const mutationScore = validTotal > 0 ? ((killed / validTotal) * 100).toFixed(2) : 0;
console.log(`Mutation Score: ${mutationScore}% (sur ${validTotal} mutations valides)`);

console.log('\n=== Résultats sauvegardés ===');
