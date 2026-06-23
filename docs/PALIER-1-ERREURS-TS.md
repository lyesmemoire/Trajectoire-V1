# Palier 1 - Erreurs TypeScript (tsc -b)

> Date : 23 Juin 2026  
> Contexte : Diagnostic compilation du moteur vocal

---

## 📊 Résumé

**Commande** : `pnpm exec tsc -b --pretty`  
**Résultat** : 106 erreurs (exit code 1)  
**Sous-app realtime-gateway seule** : 104 erreurs

---

## 🔍 Catégories d'erreurs

### Catégorie A - Configuration TypeScript (rootDir restrictif)

**Description** : Les sous-apps ont un `rootDir` trop restrictif qui ne couvre pas les dossiers `core/` et `src/` qu'elles importent.

**Codes d'erreur** : TS6059, TS6307

**Exemples** :
```
core/p6/orchestrator/runtime-orchestrator.ts:5:33 - error TS6059: 
File 'C:/Trajectoire/core/p5/integration/execution-facade.ts' is not under 'rootDir' 'C:/Trajectoire/apps/realtime-gateway'. 
'rootDir' is expected to contain all source files.

core/p6/orchestrator/runtime-orchestrator.ts:6:32 - error TS6307: 
File 'C:/Trajectoire/core/p6/voice/build-plan.ts' is not listed within the file list of project 
'C:/Trajectoire/apps/realtime-gateway/tsconfig.json'. 
Projects must list all files or use an 'include' pattern.
```

**Estimation** : ~90% des erreurs (95+ erreurs)

---

### Catégorie B - Imports croisés src/ ↔ apps/

**Description** : Violation de couche architecturale. `src/` importe depuis `apps/realtime-gateway`.

**Code d'erreur** : TS2307

**Exemples** :
```
src/chaos/attacks/AttackRunner.ts:1:37 - error TS2307: 
Cannot find module '../../../apps/realtime-gateway/src/voice-interview/runtime/fsm/orchestrator/RuntimeOrchestrator' 
or its corresponding type declarations.

src/control-plane/RuntimeControlPlane.ts:8:31 - error TS2307: 
Cannot find module '../../apps/realtime-gateway/src/voice-interview/runtime/fsm/distributed/healing/HealingEngine' 
or its corresponding type declarations.
```

**Estimation** : ~5% des erreurs (5-10 erreurs)

---

### Catégorie C - Types d'environnement manquants

**Description** : Variables d'environnement utilisées mais non déclarées dans le type Zod.

**Code d'erreur** : TS2339

**Exemples** :
```
lib/logger.ts:7:20 - error TS2339: 
Property 'LOG_LEVEL' does not exist on type '{ NEXT_PUBLIC_SUPABASE_URL: string; NEXT_PUBLIC_SUPABASE_ANON_KEY: string; ... }'.

level: envServer.LOG_LEVEL || (isDev ? 'debug' : 'info'),
              ~~~~~~~~~
```

**Estimation** : ~5% des erreurs (5-10 erreurs)

---

## 🎯 Verdict

**Statut** : Non bloquant pour la livraison web

**Raison** :
- Les erreurs sont structurelles (configuration + architecture)
- Elles n'affectent pas l'application web Next.js (app/, apps/web/)
- Le moteur vocal temps réel n'est pas critique pour la landing page

**Recommandation** : Reporter au Palier 6 (refactoring monorepo)

**Actions requises au Palier 6** :
1. Décider de l'architecture cible (monorepo avec packages/ vs autre)
2. Refactorer les imports croisés src/ ↔ apps/
3. Harmoniser les configurations TypeScript
4. Ajouter les variables d'environnement manquantes

---

## 📋 Répartition par sous-app

| Sous-app | Erreurs | Statut |
|----------|---------|--------|
| apps/realtime-gateway | 104 | ❌ Ne compile pas |
| apps/api | ~2 | ❌ Ne compile pas |
| apps/web | 0 | ✅ Compile (Next.js gère son propre TS) |

---

## 🔄 Historique

- **23 Juin 2026** : Diagnostic initial - 106 erreurs identifiées
- **23 Juin 2026** : Suppression @deepgram/sdk racine (B3) - Aucun impact sur les erreurs TS
