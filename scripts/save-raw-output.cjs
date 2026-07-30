const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'c:/Trajectoire/compiler/cvm/execution-pipeline.ts';
const testPath = 'c:/Trajectoire/tests/vm/advanced/execution-pipeline.test.ts';

const originalContent = fs.readFileSync(filePath, 'utf8');
const originalLines = originalContent.split('\n');

// Tester avec mutation A1
console.log('=== Sauvegarde sortie brute A1 ===\n');

const mutationLine = 64;
const originalMutation = '// fetch removed';

fs.writeFileSync(filePath + '.backup', originalContent);

try {
  const mutatedLines = [...originalLines];
  mutatedLines[mutationLine - 1] = originalMutation;
  fs.writeFileSync(filePath, mutatedLines.join('\n'));
  
  execSync('cd c:/Trajectoire && npx tsc --noEmit', { stdio: 'pipe', timeout: 30000 });
  
  try {
    execSync(`cd c:/Trajectoire && npx vitest run ${testPath}`, { 
      stdio: 'pipe', 
      timeout: 20000,
      encoding: 'utf8'
    });
  } catch (testError) {
    const stdout = testError.stdout || '';
    const stderr = testError.stderr || '';
    const fullOutput = stdout + stderr;
    
    // Sauvegarder la sortie brute complète
    fs.writeFileSync('c:/Trajectoire/reports/runtime/mutation/vitest-raw-output.txt', fullOutput);
    
    console.log('Sortie brute sauvegardée dans vitest-raw-output.txt');
    console.log('Taille:', fullOutput.length, 'caractères');
    console.log('\n=== Premier 3000 caractères ===');
    console.log(fullOutput.substring(0, 3000));
  }
  
} finally {
  if (fs.existsSync(filePath + '.backup')) {
    fs.writeFileSync(filePath, originalContent);
    fs.unlinkSync(filePath + '.backup');
  }
}
