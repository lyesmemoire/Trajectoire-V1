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

function fixParsingErrorsInFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    const originalContent = content;
    
    // Fix function name({ ... }) -> function name({ ... })
    content = content.replace(/(\bfunction\s+\w+\s*\()_(\{[^}]*\})/g, "$1$2");
    
    // Fix const name = (_{ ... }) => -> const name = ({ ... }) =>
    content = content.replace(/(\w+\s*=\s*\()_(\{[^}]*\})\s*=>/g, "$1$2 =>");
    
    // Fix export function name({ ... }) -> export function name({ ... })
    content = content.replace(/(export\s+function\s+\w+\s*\()_(\{[^}]*\})/g, "$1$2");
    
    // Fix export default function name({ ... }) -> export default function name({ ... })
    content = content.replace(/(export\s+default\s+function\s+\w+\s*\()_(\{[^}]*\})/g, "$1$2");
    
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
  console.log("Starting codemod to fix parsing errors...");
  
  const files = getAllFiles(ROOT_DIR);
  console.log(`Found ${files.length} files to process`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixParsingErrorsInFile(file)) {
      fixedCount++;
      console.log(`Fixed: ${file}`);
    }
  }
  
  console.log(`\nCodemod complete. Fixed ${fixedCount} files.`);
}

main();
