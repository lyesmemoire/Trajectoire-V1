import { writeFileSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const ROOT_DIR = process.cwd();
const EXCLUDE_DIRS = [".git", "node_modules", ".next", "dist", "build", ".stryker-tmp", "BLUEPRINT_GENERATED"];

function shouldProcessFile(filePath: string): boolean {
  for (const excludeDir of EXCLUDE_DIRS) {
    if (filePath.includes(excludeDir)) {
      return false;
    }
  }
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx") || filePath.endsWith(".js") || filePath.endsWith(".jsx");
}

function getAllFiles(dir: string, files: string[] = []): string[] {
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
  return files;
}

function fixAnyInFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    const originalContent = content;
    
    // Replace : unknown with : unknown
    content = content.replace(/:\s*any\b/g, ": unknown");
    
    // Replace as unknown with as unknown
    content = content.replace(/as\s+any\b/g, "as unknown");
    
    // Replace <unknown> with <unknown>
    content = content.replace(/<unknown>/g, "<unknown>");
    
    // Replace unknown[] with unknown[]
    content = content.replace(/any\[\]/g, "unknown[]");
    
    // Replace unknown[] with Array<unknown>
    content = content.replace(/any\[\]/g, "Array<unknown>");
    
    // Replace Record<string, unknown> with Record<string, unknown>
    content = content.replace(/Record<\s*string\s*,\s*any\s*>/g, "Record<string, unknown>");
    
    // Replace Map<string, unknown> with Map<string, unknown>
    content = content.replace(/Map<\s*string\s*,\s*any\s*>/g, "Map<string, unknown>");
    
    // Replace Promise<unknown> with Promise<unknown>
    content = content.replace(/Promise<\s*any\s*>/g, "Promise<unknown>");
    
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
  console.log("Starting codemod to fix 'any' types...");
  
  const files = getAllFiles(ROOT_DIR);
  console.log(`Found ${files.length} files to process`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixAnyInFile(file)) {
      fixedCount++;
      console.log(`Fixed: ${file}`);
    }
  }
  
  console.log(`\nCodemod complete. Fixed ${fixedCount} files.`);
}

main();
