const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

// Tester avec une mutation qui était KILLED dans Phase 6
console.log('=== Debug mutation A1 ===\n');

const mutationId = 'A1';
const mutationLine = 64;
const originalMutation = '// fetch removed';

fs.writeFileSync(filePath + '.backup', originalContent);

try {
  // Appliquer mutation
  const mutatedLines = [...originalLines];
  mutatedLines[mutationLine - 1] = originalMutation;
  fs.writeFileSync(filePath, mutatedLines.join('\n'));
  
  console.log('Mutation appliquée sur ligne 64');
  console.log('Contenu ligne 64:', mutatedLines[63]);
  
  // Compiler
  console.log('\nCompilation...');
  const compileResult = execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
  console.log('Compilation OK');
  
  // Exécuter tests
  console.log('\nExécution tests...');
  try {
    const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
      stdio: 'pipe', 
      timeout: 20000,
      encoding: 'utf8'
    });
    console.log('Tests passent');
    console.log('Sortie (500 caractères):', testOutput.substring(0, 500));
  } catch (testError) {
    const stdout = testError.stdout || '';
    const stderr = testError.stderr || '';
    console.log('Tests échouent');
    console.log('Signal:', testError.signal);
    console.log('Killed:', testError.killed);
    console.log('Code:', testError.code);
    console.log('\nSTDOUT (500 caractères):', stdout.substring(0, 500));
    console.log('\nSTDERR (500 caractères):', stderr.substring(0, 500));
  }
  
} catch (error) {
  console.log('Erreur:', error.message);
} finally {
  if (fs.existsSync(filePath + '.backup')) {
    fs.writeFileSync(filePath, originalContent);
    fs.unlinkSync(filePath + '.backup');
  }
}
