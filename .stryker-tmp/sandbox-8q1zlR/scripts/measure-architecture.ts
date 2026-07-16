// @ts-nocheck
import * as fs from "fs";
import * as path from "path";

const LIB_DIR = path.join(process.cwd(), "lib");

interface DomainStats {
  name: string;
  filesScanned: number;
  prismaImports: number;
  supabaseImports: number;
  interDomainImports: string[];
}

function getTsFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getTsFiles(filePath, fileList);
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function analyzeDomain(domainPath: string, domainName: string, allDomains: string[]): DomainStats {
  const files = getTsFiles(domainPath);
  let prismaImports = 0;
  let supabaseImports = 0;
  const interDomainImports: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    
    // Check Prisma
    if (content.includes("@prisma/client") || content.includes("@/lib/prisma")) {
      prismaImports++;
    }
    
    // Check Supabase
    if (content.includes("@supabase/supabase-js")) {
      supabaseImports++;
    }

    // Check inter-domain imports
    for (const other of allDomains) {
      if (other !== domainName && other !== "core") {
        // Regex to find exact imports from another domain
        const regex = new RegExp(`@/lib/${other}\\b`, "g");
        if (regex.test(content)) {
          interDomainImports.push(other);
        }
      }
    }
  }

  // Deduplicate interDomainImports
  const uniqueInterDomain = [...new Set(interDomainImports)];

  return {
    name: domainName,
    filesScanned: files.length,
    prismaImports,
    supabaseImports,
    interDomainImports: uniqueInterDomain,
  };
}

function hasCycle(graph: Record<string, string[]>): boolean {
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(node: string): boolean {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }

    recStack.delete(node);
    return false;
  }

  for (const node of Object.keys(graph)) {
    if (dfs(node)) return true;
  }
  return false;
}

function run() {
  const domains = fs.readdirSync(LIB_DIR).filter(d => fs.statSync(path.join(LIB_DIR, d)).isDirectory());
  
  console.log("=== Architecture Measurement ===\n");
  
  const statsList: DomainStats[] = [];
  const dependencyGraph: Record<string, string[]> = {};

  for (const domain of domains) {
    const stats = analyzeDomain(path.join(LIB_DIR, domain), domain, domains);
    statsList.push(stats);
    dependencyGraph[domain] = stats.interDomainImports;
  }

  console.table(statsList.map(s => ({
    Domain: s.name,
    "Files Scanned": s.filesScanned,
    "Prisma Imports": s.prismaImports,
    "Supabase Imports": s.supabaseImports,
    "Coupling (Outbound)": s.interDomainImports.length,
    "Targets": s.interDomainImports.join(", ") || "-"
  })));

  const cycles = hasCycle(dependencyGraph);
  console.log(`\nCyclic Dependencies Detected: ${cycles ? "YES ❌" : "NO ✅"}`);
  
  // Return non-zero exit code if cycles detected
  if (cycles) {
    process.exit(1);
  }
}

run();
