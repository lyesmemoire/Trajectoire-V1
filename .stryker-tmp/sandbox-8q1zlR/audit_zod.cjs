// @ts-nocheck
const fs = require('fs');

const { execSync } = require('child_process');
const output = execSync('git ls-files | Select-String "api/.*route\\.ts$"', { shell: 'powershell.exe' }).toString();
const files = output.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const issues = [];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    const hasJsonCall = /req(uest)?\.json\(\)/.test(content);
    const hasSearchParams = /searchParams/.test(content);
    const hasFormData = /req(uest)?\.formData\(\)/.test(content);
    const hasZod = /from ["']zod["']/.test(content);
    const hasParse = /\.safeParse\(/.test(content) || /\.parse\(/.test(content);
    
    if ((hasJsonCall || hasSearchParams || hasFormData) && (!hasZod || !hasParse)) {
      issues.push(file);
    }
  }
});

console.log("Routes potentiellement sans validation Zod stricte sur l'entrée:");
issues.forEach(f => console.log(f));
console.log(`\nTotal: ${issues.length} fichiers suspects.`);
