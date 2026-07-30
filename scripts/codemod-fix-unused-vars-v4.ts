import { writeFileSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const ROOT_DIR = process.cwd();
const EXCLUDE_DIRS = [".git", "node_modules", ".next", "dist", "build", ".stryker-tmp", "BLUEPRINT_GENERATED", "BLUEPRINT_MULTI_LANG_GENERATED", "BLUEPRINT_PACKAGE", "apps/realtime-gateway-v2"];

function shouldProcessFile(filePath: string): boolean {
  for (const excludeDir of EXCLUDE_DIRS) {
    if (filePath.includes(excludeDir)) {
      return false;
    }
  }
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx") || filePath.endsWith(".js") || filePath.endsWith(".jsx");
}

function getAllFiles(dir: string, files: string[] = []): string[] {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDE_DIRS.includes(entry.name)) {
          getAllFiles(fullPath, files);
        }
      } else if (shouldProcessFile(fullPath)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist
  }
  return files;
}

function fixUnusedVarsInFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    const originalContent = content;
    
    // Fix unused catch variables: catch (e) -> catch
    content = content.replace(/catch\s*\(\s*(\w+)\s*\)\s*\{/g, "catch {");
    
    // Fix unused variables in destructuring: const { a, b } = obj -> const { a, _b } = obj
    // Simple pattern matching for destructuring
    content = content.replace(/const\s*\{([^}]+)\}\s*=\s*([^;]+);/g, (match: string, destructured: string, source: string) => {
      const items: string[] = destructured.split(',').map((item: string) => item.trim());
      const fixedItems: string[] = items.map((item: string) => {
        const varName = item.split(':')[0].split('=').map((s: string) => s.trim())[0];
        const isUsed = new RegExp(`\\b${varName}\\b`).test(content.substring(content.indexOf(match) + match.length));
        if (!isUsed && !varName.startsWith('_') && varName !== '') {
          return `_${item}`;
        }
        return item;
      });
      return `const { ${fixedItems.join(', ')} } = ${source};`;
    });
    
    // Fix unused variables in array destructuring: const [a, b] = arr -> const [a, _b] = arr
    content = content.replace(/const\s*\[([^]]+)\]\s*=\s*([^;]+);/g, (match: string, destructured: string, source: string) => {
      const items: string[] = destructured.split(',').map((item: string) => item.trim());
      const fixedItems: string[] = items.map((item: string) => {
        const varName = item.split(':')[0].split('=').map((s: string) => s.trim())[0];
        const isUsed = new RegExp(`\\b${varName}\\b`).test(content.substring(content.indexOf(match) + match.length));
        if (!isUsed && !varName.startsWith('_') && varName !== '') {
          return `_${item}`;
        }
        return item;
      });
      return `const [${fixedItems.join(', ')}] = ${source};`;
    });
    
    if (content !== originalContent) {
      writeFileSync(filePath, content, "utf-8");
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

function main() {
  console.log("Starting codemod to fix unused variables v4...");
  
  const files = getAllFiles(ROOT_DIR);
  console.log(`Found ${files.length} files to process`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixUnusedVarsInFile(file)) {
      fixedCount++;
      console.log(`Fixed: ${file}`);
    }
  }
  
  console.log(`\nCodemod complete. Fixed ${fixedCount} files.`);
}

main();
