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

function fixCaseDeclarationsInFile(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    const originalContent = content;
    
    // Fix case blocks with lexical declarations by adding braces
    // Pattern: case X:\n  const/let/var
    const casePattern = /case\s+[^:]+:\s*\n\s+(const|let|var)\s+/g;
    let match;
    const replacements: { start: number; end: number; replacement: string }[] = [];
    
    while ((match = casePattern.exec(content)) !== null) {
      const caseStart = match.index;
      const keywordStart = match.index + match[0].length - match[1].length;
      
      // Find the end of the case block (next case, default, or })
      let blockEnd = content.indexOf("\n", keywordStart);
      let braceCount = 0;
      let inBlock = false;
      let foundNextCase = false;
      
      for (let i = blockEnd; i < content.length; i++) {
        if (content[i] === '{') {
          braceCount++;
          inBlock = true;
        } else if (content[i] === '}') {
          braceCount--;
          if (braceCount === 0 && inBlock) {
            blockEnd = i + 1;
            break;
          }
        } else if (content.slice(i, i + 4) === 'case' || content.slice(i, i + 7) === 'default') {
          if (braceCount === 0) {
            blockEnd = i;
            foundNextCase = true;
            break;
          }
        }
      }
      
      if (!foundNextCase && braceCount === 0) {
        // Find the closing brace of the switch
        const switchEnd = content.indexOf('}', blockEnd);
        if (switchEnd !== -1) {
          blockEnd = switchEnd;
        }
      }
      
      // Extract the case block content
      const caseBlock = content.substring(caseStart, blockEnd);
      
      // Check if it already has braces
      if (!caseBlock.includes('{') || caseBlock.indexOf('{') > caseBlock.indexOf('const') || caseBlock.indexOf('{') > caseBlock.indexOf('let') || caseBlock.indexOf('{') > caseBlock.indexOf('var')) {
        // Add braces around the case block content
        const caseHeader = caseBlock.match(/case\s+[^:]+:/)?.[0] || "";
        const caseContent = caseBlock.substring(caseHeader.length).trim();
        
        if (caseContent && !caseContent.startsWith('{')) {
          const replacement = caseHeader + " {\n" + caseContent + "\n      }";
          replacements.push({ start: caseStart, end: blockEnd, replacement });
        }
      }
    }
    
    // Apply replacements in reverse order to maintain correct positions
    for (let i = replacements.length - 1; i >= 0; i--) {
      const { start, end, replacement } = replacements[i];
      content = content.substring(0, start) + replacement + content.substring(end);
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
  console.log("Starting codemod to fix case declarations...");
  
  const files = getAllFiles(ROOT_DIR);
  console.log(`Found ${files.length} files to process`);
  
  let fixedCount = 0;
  for (const file of files) {
    if (fixCaseDeclarationsInFile(file)) {
      fixedCount++;
      console.log(`Fixed: ${file}`);
    }
  }
  
  console.log(`\nCodemod complete. Fixed ${fixedCount} files.`);
}

main();
