const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

console.log('=== Debug R19 - Supprimer remise à zéro des statistiques ===\n');
console.log('Ligne 135 originale:', originalLines[134]);

fs.writeFileSync(filePath + '.backup', originalContent);

try {
  // Appliquer R19 - supprimer la ligne 135
  const mutatedLines = [...originalLines];
  mutatedLines.splice(135 - 1, 1); // Supprimer la ligne 135
  fs.writeFileSync(filePath, mutatedLines.join('\n'));
  
  console.log('Ligne 135 supprimée');
  console.log('Contenu autour de la ligne 135:');
  for (let i = 130; i < 140; i++) {
    console.log(`  ${i + 1}: ${mutatedLines[i] || '<vide>'}`);
  }
  
  // Vérifier le contenu du fichier après mutation
  const mutatedContent = fs.readFileSync(filePath, 'utf8');
  const mutatedLinesAfter = mutatedContent.split('\n');
  console.log('\nVérification après écriture:');
  for (let i = 130; i < 140; i++) {
    console.log(`  ${i + 1}: ${mutatedLinesAfter[i] || '<vide>'}`);
  }
  
  // Compiler
  try {
    execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
    console.log('Compilation OK');
  } catch (compileError) {
    console.log('Compilation KO');
    throw new Error('Compilation échouée');
  }
  
  // Exécuter tests - seulement le test de regression detection reset
  try {
    const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath} -t "should reset all statistics to zero"`, { 
      stdio: 'pipe', 
      timeout: 20000,
      encoding: 'utf8'
    });
    
    console.log('Test passe');
    console.log('Output:');
    console.log(testOutput);
    
  } catch (testError) {
    const stdout = testError.stdout || '';
    const stderr = testError.stderr || '';
    const errorOutput = stdout + stderr;
    
    console.log('Test échoue');
    console.log('Output:');
    console.log(errorOutput);
  }
  
} finally {
  if (fs.existsSync(filePath + '.backup')) {
    fs.writeFileSync(filePath, originalContent);
    fs.unlinkSync(filePath + '.backup');
  }
}
