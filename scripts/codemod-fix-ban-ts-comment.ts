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

function fixBanTsCommentInFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    const originalContent = content;
    
    // Replace @ts-expect-error with @ts-expect-error
    content = content.replace(/@ts-expect-error/g, "@ts-expect-error");
    
    // Replace @ts-expect-error with @ts-expect-error
    content = content.replace(/@ts-expect-error/g, "@ts-expect-error");
    
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
  console.log("Starting codemod to fix ban-ts-comment issues...");
  
  const files = getAllFiles(ROOT_DIR);
  console.log(`Found ${files.length} files to process`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixBanTsCommentInFile(file)) {
      fixedCount++;
      console.log(`Fixed: ${file}`);
    }
  }
  
  console.log(`\nCodemod complete. Fixed ${fixedCount} files.`);
}

main();
