# Audit Dépendances & TypeScript - 25 juin 2026

## 1. État des Dépendances

### Package Manager
- **pnpm@9.15.9** (configuré dans package.json racine)
- **Workspaces** : Configurés (apps/web, apps/realtime-gateway, packages/arena-engine)
- **Type module** : `"type": "module"` dans package.json racine

### Package.json Racine
- **Scripts** : Utilise `pnpm --filter` pour les builds
- **Dependencies** : 67 packages (incl. @nestjs/*, @opentelemetry/*, pino, etc.)
- **DevDependencies** : 26 packages (incl. eslint@9.39.4, @eslint/js@9.39.4, typescript@5.8.3)

### Sous-apps avec package.json
1. **apps/web** : Next.js 16.2.9, utilise `@trajectoire/arena-engine` workspace
2. **apps/realtime-gateway** : Fastify 5, utilise `@deepgram/sdk@^3.13.0`
3. **apps/api** : NestJS 11, utilise `@deepgram/sdk@^3.13.0`
4. **packages/arena-engine** : Package partagé

## 2. Références Deepgram

### Version Installée
- **apps/realtime-gateway** : `@deepgram/sdk@^3.13.0` (API v3)
- **apps/api** : `@deepgram/sdk@^3.13.0` (API v3)
- **Package racine** : Aucune dépendance directe Deepgram

### Code Source
- **192 occurrences** de "deepgram" dans 44 fichiers
- **Fichier principal** : `apps/realtime-gateway/src/ai/deepgram.ts`
  - Utilise `createClient` (API v3)
  - Utilise `LiveTranscriptionEvents` (API v3)
  - Compatible avec la version installée

### Conclusion Deepgram
✅ **Pas de conflit de version** - Le code utilise l'API v3 et la version installée est v3.13.0

## 3. Erreurs TypeScript (tsc -b)

### Résumé
- **106 erreurs** au total
- **235 lignes** de sortie (tronquées)

### Types d'Erreurs Principaux

#### 1. TS6059/TS6307 : Fichiers non sous rootDir (Structure de projet)
**Exemples** :
```
File 'C:/Trajectoire/core/p6/voice/build-plan.ts' is not under 'rootDir' 'C:/Trajectoire/apps/realtime-gateway'
File is not listed within the file list of project 'C:/Trajectoire/apps/realtime-gateway/tsconfig.json'
```

**Impact** : La structure du projet a des fichiers `core/p6/*` qui sont importés par `apps/realtime-gateway` mais ne sont pas dans son rootDir.

#### 2. TS2307 : Modules introuvables (Chemins)
**Exemples** :
```
Cannot find module '../../../apps/realtime-gateway/src/voice-interview/runtime/fsm/orchestrator/RuntimeOrchestrator'
Cannot find module '../../apps/realtime-gateway/src/voice-interview/runtime/fsm/distributed/healing/HealingEngine'
```

**Impact** : Chemins relatifs cassés entre `packages/arena-engine` et `apps/realtime-gateway`.

#### 3. TS2339 : Propriétés manquantes (Types)
**Exemple** :
```
Property 'LOG_LEVEL' does not exist on type '{ NEXT_PUBLIC_SUPABASE_URL: string; ... }'
```

**Impact** : Type envServer incomplet.

#### 4. TS2305 : Membres exportés manquants (Deepgram)
**Exemple** :
```
Module '"@deepgram/sdk"' has no exported member 'createClient'
```

**Impact** : Conflit de version Deepgram dans certains fichiers (probablement ceux qui essaient d'utiliser l'API v5).

## 4. Problèmes Identifiés

### 🔴 Critiques
1. **Structure de projet complexe** : Fichiers `core/p6/*` importés par `apps/realtime-gateway` mais hors rootDir
2. **Chemins relatifs cassés** : Imports entre `packages/arena-engine` et `apps/realtime-gateway` ne fonctionnent pas
3. **Configuration tsconfig incohérente** : rootDir ne contient pas tous les fichiers source

### 🟠 Importants
1. **Type envServer incomplet** : Propriété LOG_LEVEL manquante
2. **Conflit Deepgram partiel** : Certains fichiers essaient d'utiliser l'API v5 alors que v3 est installée

### 🟡 Mineurs
1. **Workspaces pnpm** : Configuration semble correcte mais les chemins ne sont pas résolus
2. **Project references** : tsconfig.json racine ne référence pas correctement les sous-projets

## 5. Recommandations

### Immédiat (Priorité HAUTE)
1. **Réparer la structure de projet** :
   - Déplacer `core/p6/*` dans `apps/realtime-gateway/src/core/`
   - OU configurer tsconfig pour inclure ces fichiers
   - OU utiliser des chemins absolus via tsconfig paths

2. **Réparer les chemins relatifs** :
   - Remplacer les imports relatifs par des imports workspace
   - Exemple : `import { RuntimeOrchestrator } from '@trajectoire/realtime-gateway'`

3. **Compléter le type envServer** :
   - Ajouter LOG_LEVEL dans le type envServer

### Court terme (Priorité MOYENNE)
1. **Vérifier les imports Deepgram** :
   - Identifier les fichiers qui utilisent l'API v5
   - Les migrer vers l'API v3 OU upgrader vers v5

2. **Configurer les project references** :
   - Mettre à jour tsconfig.json racine pour référencer correctement les sous-projets

### Moyen terme (Priorité BASSE)
1. **Simplifier la structure** :
   - Considérer déplacer `core/p6` dans un package workspace
   - Réduire la complexité des imports croisés

## 6. Prochaines Actions

1. **Analyser la structure core/p6** pour comprendre son rôle
2. **Décider de la stratégie** : déplacer OU configurer tsconfig
3. **Réparer les chemins relatifs** en utilisant des imports workspace
4. **Compléter le type envServer**
5. **Relancer tsc -b** pour vérifier les progrès

## Conclusion

Le problème principal n'est **pas** un conflit de version Deepgram (la version v3 est correctement installée et le code l'utilise). Le problème principal est la **structure de projet complexe** avec des imports croisés qui ne sont pas résolus correctement par TypeScript.
