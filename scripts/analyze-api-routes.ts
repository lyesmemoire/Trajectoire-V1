/**
 * scripts/analyze-api-routes.ts
 * Analyse détaillée des routes API dupliquées
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

interface RouteInfo {
  path: string;
  location: string;
  size: number;
  functions: string[];
}

function analyzeAPIRoutes() {
  console.log('\n=== ANALYSE DES ROUTES API ===\n');

  const locations = [
    'apps/web/src/app/api',
    'legacy/api',
    'packages/arena-engine/app/api',
  ];

  const allRoutes: RouteInfo[] = [];

  for (const location of locations) {
    try {
      const files = getAllFiles(location, ['.ts']);
      
      for (const file of files) {
        if (!file.includes('route.ts')) continue;

        const content = readFileSync(file, 'utf-8');
        const functions = extractFunctions(content);
        
        allRoutes.push({
          path: file,
          location,
          size: content.length,
          functions,
        });
      }
    } catch (error) {
      // Dossier n'existe pas
    }
  }

  // Grouper par route relative
  const routeGroups = groupByRoute(allRoutes);

  console.log('=== ROUTES DUPLIQUÉES ===\n');

  for (const [route, routes] of Object.entries(routeGroups)) {
    if (routes.length > 1) {
      console.log(`Route: ${route}`);
      for (const r of routes) {
        console.log(`  ${r.location}`);
        console.log(`    Fichier: ${r.path}`);
        console.log(`    Taille: ${r.size} bytes`);
        console.log(`    Fonctions: ${r.functions.join(', ')}`);
      }
      console.log('');
    }
  }

  console.log('=== ROUTES UNIQUES PAR LOCATION ===\n');

  for (const location of locations) {
    const locationRoutes = allRoutes.filter(r => r.location === location);
    console.log(`${location}: ${locationRoutes.length} routes`);
  }

  console.log('\n=== RÉSUMÉ ===');
  console.log(`Total routes: ${allRoutes.length}`);
  console.log(`Locations analysées: ${locations.length}`);
}

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, extensions));
      } else if (stat.isFile()) {
        const ext = item.split('.').pop();
        if (extensions.includes(`.${ext}`)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Dossier n'existe pas
  }
  
  return files;
}

function extractFunctions(content: string): string[] {
  const functions: string[] = [];
  
  // Chercher les fonctions exportées
  const exportMatches = content.match(/export\s+(async\s+)?function\s+(\w+)/g);
  if (exportMatches) {
    for (const match of exportMatches) {
      const funcMatch = match.match(/function\s+(\w+)/);
      if (funcMatch) functions.push(funcMatch[1]);
    }
  }

  // Chercher les exports const avec fonctions
  const constMatches = content.match(/export\s+const\s+(\w+)\s*=\s*(async\s+)?\(/g);
  if (constMatches) {
    for (const match of constMatches) {
      const constMatch = match.match(/const\s+(\w+)/);
      if (constMatch) functions.push(constMatch[1]);
    }
  }

  return functions;
}

function groupByRoute(routes: RouteInfo[]): Record<string, RouteInfo[]> {
  const groups: Record<string, RouteInfo[]> = {};

  for (const route of routes) {
    const relativePath = route.path.replace(/.*\/api\//, 'api/');
    const routeKey = relativePath.replace(/\/route\.ts$/, '');

    if (!groups[routeKey]) groups[routeKey] = [];
    groups[routeKey].push(route);
  }

  return groups;
}

analyzeAPIRoutes();
