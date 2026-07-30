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

function fixUnusedVarsInFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    const originalContent = content;
    
    // Fix unused function parameters: prefix with _
    // Pattern: function name(param) or const name = (param) =>
    content = content.replace(/(\bfunction\s+\w+\s*\([^)]*?)(\w+)(\s*[,\)])/g, (match, prefix, param, suffix) => {
      // Check if this parameter is used later in the function
      const functionBody = content.substring(content.indexOf(match) + match.length);
      const paramUsage = new RegExp(`\\b${param}\\b`).test(functionBody);
      if (!paramUsage) {
        return `${prefix}_${param}${suffix}`;
      }
      return match;
    });
    
    // Fix unused catch variables: catch (e) -> catch
    content = content.replace(/catch\s*\(\s*(\w+)\s*\)\s*\{/g, "catch {");
    
    // Fix unused variables in destructuring: const { _a, _b } = obj -> const { a, _b } = obj
    // This is more complex and requires AST parsing, so we'll skip for now
    
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
  console.log("Starting codemod to fix unused variables...");
  
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

