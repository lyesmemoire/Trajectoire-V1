// scripts/inventory-report.ts
// Generates FEDERATION_INVENTORY.md with module status
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
// __dirname shim for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const root = path.resolve(__dirname, "../");
const sections = [
  { name: "Federation", dir: "src/watchdog/federation" },
  { name: "Observability", dir: "src/observability" },
  { name: "Runtime", dir: "src/watchdog" },
];

function getAllTsFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...getAllTsFiles(full));
    else if (e.isFile() && e.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

function compileFile(file: string): boolean {
  try {
    execSync(`npx tsc --noEmit ${file}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function analyzeFile(file: string) {
  const content = fs.readFileSync(file, 'utf8');
  const imports = content.match(/import\s+.*?from\s+['"][^'"]+['"]/g) || [];
  const exports = content.match(/export\s+(?:default\s+)?(?:class|function|const|interface|type)\s+\w+/g) || [];
  const used = false; // placeholder – real usage detection would require type graph; omitted for strictness.
  return { imports, exports, used };
}

let report = "# FEDERATION INVENTORY\n\n";
for (const sec of sections) {
  const dirPath = path.join(root, sec.dir);
  if (!fs.existsSync(dirPath)) continue;
  const files = getAllTsFiles(dirPath);
  report += `## ${sec.name}\n`;
  for (const f of files) {
    const rel = path.relative(root, f);
    const exists = fs.existsSync(f);
    const compiles = compileFile(f);
    const { imports, exports } = analyzeFile(f);
    report += `- **${rel}** – exists: ${exists}, compiles: ${compiles}\n`;
    if (imports.length) report += `  - imports: ${imports.join(', ')}\n`;
    if (exports.length) report += `  - exports: ${exports.join(', ')}\n`;
  }
  report += "\n";
}

fs.writeFileSync(path.join(root, "FEDERATION_INVENTORY.md"), report);
console.log('Inventory report generated: FEDERATION_INVENTORY.md');
