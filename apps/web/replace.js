const fs = require('fs');
const path = require('path');

// 1. Global RGBA Replacements
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    if (file === 'node_modules' || file === '.next') return;
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const initial = content;
  content = content.replace(/rgba\(\s*79\s*,\s*102\s*,\s*88\s*,/g, 'rgba(26,60,52,');
  content = content.replace(/rgba\(\s*115\s*,\s*146\s*,\s*116\s*,/g, 'rgba(26,127,75,');
  content = content.replace(/rgba\(\s*201\s*,\s*133\s*,\s*111\s*,/g, 'rgba(232,80,26,');
  content = content.replace(/rgba\(\s*216\s*,\s*168\s*,\s*97\s*,/g, 'rgba(217,119,6,');
  
  if (content !== initial) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated RGBA in', file);
  }
});

// 2. Update constants.ts hex colors
const constantsPath = path.join(__dirname, 'src', 'lib', 'constants.ts');
if (fs.existsSync(constantsPath)) {
  let constantsContent = fs.readFileSync(constantsPath, 'utf8');
  constantsContent = constantsContent.replace(/"#4F6658"/g, '"#1A3C34"'); // Primary
  constantsContent = constantsContent.replace(/"#C9856F"/g, '"#E8501A"'); // Accent
  constantsContent = constantsContent.replace(/"#708273"/g, '"#2D5F50"'); // Primary Light
  
  constantsContent = constantsContent.replace(/"var\(--primary\)"/g, '"#1A3C34"');
  constantsContent = constantsContent.replace(/"var\(--accent\)"/g, '"#E8501A"');
  constantsContent = constantsContent.replace(/"var\(--success\)"/g, '"#1A7F4B"');
  constantsContent = constantsContent.replace(/"var\(--warning\)"/g, '"#D97706"');
  
  fs.writeFileSync(constantsPath, constantsContent, 'utf8');
  console.log('Updated constants.ts');
}

// 3. Update Hero.tsx
const heroPath = path.join(__dirname, 'src', 'components', 'home', 'Hero.tsx');
if (fs.existsSync(heroPath)) {
  let heroContent = fs.readFileSync(heroPath, 'utf8');
  // In Hero.tsx, we need to replace the style of the Link CTA
  // The user said: "Le btn-primary utilise désormais var(--accent) = corail vif. Aucun changement de code nécessaire, le CSS fait le travail"
  // Wait, the user said in the prompt:
  // <Link href="/register" className="btn-primary gpu will-change-transform">
  // So we just need to replace the inline styles on the Link in Hero.tsx with className="btn-primary gpu will-change-transform" and remove inline styles.
  // Wait, in the second block they provided a new Hero.tsx code with inline styles!
  // "Remplacez uniquement le bouton primary CTA (href="/register")" ... "style={{ backgroundColor: "var(--accent)" ...
  // Actually, I will just replace the exact block.
  console.log('Done with Hero (will do manually with multi_replace_file_content if needed)');
}

console.log('Replacement finished');
