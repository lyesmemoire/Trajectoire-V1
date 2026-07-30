import { writeFileSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const ROOT_DIR = process.cwd();
const EXCLUDE_DIRS = [".git", "node_modules", ".next", "dist", "build", ".stryker-tmp", "BLUEPRINT_GENERATED", "BLUEPRINT_MULTI_LANG_GENERATED", "BLUEPRINT_PACKAGE"];

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
    
    // Fix unused function parameters by prefixing with _
    // Pattern: function name(param1, param2) or const name = (_param1, _param2) =>
    content = content.replace(/(\bfunction\s+\w+\s*\()([^)]*)(\))/g, (match: string, prefix: string, params: string, suffix: string) => {
      const paramList = params.split(',').map((p: string) => p.trim());
      const fixedParams = paramList.map((param: string) => {
        const varName = param.split(':')[0].split('=').map((s: string) => s.trim())[0];
        const isUsed = new RegExp(`\\b${varName}\\b`).test(content.substring(content.indexOf(match) + match.length));
        if (!isUsed && !varName.startsWith('_') && varName !== '') {
          return param.replace(varName, `_${varName}`);
        }
        return param;
      });
      return `${prefix}${fixedParams.join(', ')}${suffix}`;
    });
    
    // Fix unused arrow function parameters
    content = content.replace(/(\w+\s*=\s*\([^)]*\)\s*=>)/g, (match: string) => {
      const innerMatch = match.match(/\(([^)]*)\)/);
      if (innerMatch) {
        const params = innerMatch[1];
        const paramList = params.split(',').map((p: string) => p.trim());
        const fixedParams = paramList.map((param: string) => {
          const varName = param.split(':')[0].split('=').map((s: string) => s.trim())[0];
          const isUsed = new RegExp(`\\b${varName}\\b`).test(content.substring(content.indexOf(match) + match.length));
          if (!isUsed && !varName.startsWith('_') && varName !== '') {
            return param.replace(varName, `_${varName}`);
          }
          return param;
        });
        return match.replace(innerMatch[0], `(${fixedParams.join(', ')})`);
      }
      return match;
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
  console.log("Starting codemod to fix unused variables v3...");
  
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
