const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

// Tester une seule mutation pour voir la sortie brute
console.log('=== Test de sortie brute Vitest ===\n');

const mutationId = 'D1';
const mutationLine = 127;
const originalMutation = '// stop removed';

fs.writeFileSync(filePath + '.backup', originalContent);

try {
  // Appliquer mutation
  const mutatedLines = [...originalLines];
  mutatedLines[mutationLine - 1] = originalMutation;
  fs.writeFileSync(filePath, mutatedLines.join('\n'));
  
  // Compiler
  execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
  
  // Exécuter tests
  try {
    const testOutput = execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
      stdio: 'pipe', 
      timeout: 20000,
      encoding: 'utf8'
    });
    console.log('Tests passent');
    console.log(testOutput);
  } catch (testError) {
    const stdout = testError.stdout || '';
    const stderr = testError.stderr || '';
    console.log('=== STDOUT (2000 caractères) ===');
    console.log(stdout.substring(0, 2000));
    console.log('\n=== STDERR (2000 caractères) ===');
    console.log(stderr.substring(0, 2000));
    console.log('\n=== Signal ===');
    console.log(testError.signal);
    console.log('\n=== Killed ===');
    console.log(testError.killed);
  }
  
} finally {
  if (fs.existsSync(filePath + '.backup')) {
    fs.writeFileSync(filePath, originalContent);
    fs.unlinkSync(filePath + '.backup');
  }
}
