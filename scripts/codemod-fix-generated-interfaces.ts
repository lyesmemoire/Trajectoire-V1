import { writeFileSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const ROOT_DIR = process.cwd();
const GENERATED_DIR = join(ROOT_DIR, "BLUEPRINT_MULTI_LANG_GENERATED", "typescript");

function shouldProcessFile(filePath: string): boolean {
  return filePath.includes("BLUEPRINT_MULTI_LANG_GENERATED") && 
         (filePath.endsWith(".ts") || filePath.endsWith(".tsx"));
}

function getAllFiles(dir: string, files: string[] = []): string[] {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        getAllFiles(fullPath, files);
      } else if (shouldProcessFile(fullPath)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Directory might not exist
  }
  return files;
}

function fixGeneratedInterfaceInFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    const originalContent = content;
    
    // Replace reserved names with valid names
    const reservedNames = ["undefined", "NaN", "Infinity", "eval", "arguments", "this", "super", "class", "enum", "extends", "import", "export", "return", "break", "case", "catch", "const", "continue", "debugger", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "switch", "throw", "try", "typeof", "var", "void", "while", "with", "yield", "let", "static", "async", "await", "implements", "interface", "package", "private", "protected", "public", "abstract", "boolean", "byte", "char", "double", "final", "float", "goto", "int", "long", "native", "short", "synchronized", "throws", "transient", "volatile"];
    
    for (const reservedName of reservedNames) {
      // Replace interface reservedName with interface ReservedName
      const pattern = new RegExp(`export interface ${reservedName}\\s*\\{`, "g");
      content = content.replace(pattern, `export interface ${reservedName.charAt(0).toUpperCase() + reservedName.slice(1)} {`);
      
      // Replace type references
      const typePattern = new RegExp(`\\b${reservedName}\\b`, "g");
      content = content.replace(typePattern, reservedName.charAt(0).toUpperCase() + reservedName.slice(1));
    }
    
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
  console.log("Starting codemod to fix generated interfaces with reserved names...");
  
  const files = getAllFiles(GENERATED_DIR);
  console.log(`Found ${files.length} generated files to process`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixGeneratedInterfaceInFile(file)) {
      fixedCount++;
      console.log(`Fixed: ${file}`);
    }
  }
  
  console.log(`\nCodemod complete. Fixed ${fixedCount} files.`);
}

main();
