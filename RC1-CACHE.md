# RC1-CACHE - Cache Redis

**Date:** 2026-08-06  
**Mission:** RC1.4 - Mettre en place Redis Cache  
**Statut:** ✅ **IMPLÉMENTÉ**

---

## 📊 RÉSUMÉ EXÉCUTIF

**Objectif:** Implémenter un cache Redis pour les services Graph, Matching, Search, Copilot et Career avec TTL configurable et métriques (Cache Hit, Cache Miss, Latency).

**Résultat:** Cache Redis complètement implémenté avec métriques détaillées et TTL configurable par service.

---

## 🔍 ÉTAT ACTUEL

### Infrastructure Cache

**Fichier:** `apps/api/src/cache/cache.module.ts`

**Configuration:**
- **Store:** Redis (cache-manager-redis-store)
- **Host:** REDIS_HOST (default: localhost)
- **Port:** REDIS_PORT (default: 6379)
- **Password:** REDIS_PASSWORD
- **DB:** REDIS_DB (default: 0)
- **TTL Global:** CACHE_TTL (default: 3600s = 1 heure)
- **Max Items:** CACHE_MAX (default: 1000)

**Service:** `apps/api/src/cache/cache.decorator.ts`

**Fonctionnalités:**
- `get<T>(key: string)` - Récupérer une valeur du cache avec tracking de métriques
- `set(key, value, ttl?)` - Stocker une valeur dans le cache
- `del(key)` - Supprimer une valeur du cache
- `wrap<T>(key, factory, ttl?)` - Pattern cache-aside
- `generateKey(prefix, ...args)` - Génération de clés de cache
- `getMetrics(prefix?)` - Récupérer les métriques de cache
- `resetMetrics(prefix?)` - Réinitialiser les métriques

---

## 🎯 SERVICES AVEC CACHE

### 1. Graph Cache

**Service:** `apps/api/src/runtime/kg/graph-repository.service.ts`

**Méthodes cachées:**
- `createGraph()` - Cache après création (TTL: 3600s)
- `getGraphById()` - Cache-aside pattern (TTL: 3600s)
- `updateGraph()` - Invalidation du cache après mise à jour

**Clé de cache:** `graph:{graphId}`

**TTL:** 1 heure (3600 secondes)

**Implémentation:**
```typescript
async getGraphById(id: string, filter: GraphFilter = {}): Promise<Graph | null> {
  const cacheKey = this.cacheService.generateKey('graph', id);
  
  // Try cache first
  const cached = await this.cacheService.get<Graph>(cacheKey);
  if (cached) {
    return cached;
  }

  // ... fetch from database ...
  
  // Cache the result
  await this.cacheService.set(cacheKey, graph, 3600);
  
  return graph;
}
```

---

### 2. Matching Cache

**Service:** `apps/api/src/runtime/kg/graph-matching.service.ts`

**Méthodes cachées:**
- `match(candidateGraph, jobGraph)` - Cache-aside pattern (TTL: 1800s)

**Clé de cache:** `matching:{candidateId}:{jobId}`

**TTL:** 30 minutes (1800 secondes)

**Implémentation:**
```typescript
async match(candidateGraph: Graph, jobGraph: Graph): Promise<MatchingResult> {
  const candidateId = this.extractId(candidateGraph);
  const jobId = this.extractId(jobGraph);
  const cacheKey = this.cacheService.generateKey('matching', candidateId, jobId);
  
  // Try cache first
  const cached = await this.cacheService.get<MatchingResult>(cacheKey);
  if (cached) {
    return cached;
  }

  // ... perform matching ...
  
  // Cache the result with 30 minute TTL
  await this.cacheService.set(cacheKey, result, 1800);

  return result;
}
```

---

### 3. Search Cache

**Service:** `apps/api/src/runtime/kg/graph-search.service.ts`

**Méthodes cachées:**
- `searchCandidatesByNeighborhood()` - Cache-aside pattern (TTL: 900s)

**Clé de cache:** `search_neighborhood:{jobGraphId}:{maxDepth}:{limit}`

**TTL:** 15 minutes (900 secondes)

**Implémentation:**
```typescript
async searchCandidatesByNeighborhood(
  jobGraph: Graph,
  candidateGraphs: Graph[],
  options: { maxDepth?: number; limit?: number } = {}
): Promise<NeighborhoodSearchResult[]> {
  const maxDepth = options.maxDepth ?? 2;
  const limit = options.limit ?? 20;
  const cacheKey = this.cacheService.generateKey('search_neighborhood', jobGraph.id, maxDepth, limit);
  
  // Try cache first
  const cached = await this.cacheService.get<NeighborhoodSearchResult[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // ... perform search ...
  
  // Cache the result with 15 minute TTL
  await this.cacheService.set(cacheKey, sortedResults, 900);
  
  return sortedResults;
}
```

---

### 4. Copilot Cache

**Service:** `apps/api/src/copilot/copilot.service.ts`

**Méthodes cachées:**
- `processMessage(sessionId, message)` - Cache-aside pattern (TTL: 300s)

**Clé de cache:** `copilot:{sessionId}:{message}`

**TTL:** 5 minutes (300 secondes)

**Implémentation:**
```typescript
async processMessage(sessionId: string, message: string): Promise<CopilotResponse> {
  const cacheKey = this.cacheService.generateKey('copilot', sessionId, message);
  
  // Try cache first (5 minute TTL for conversations)
  const cached = await this.cacheService.get<CopilotResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  // ... process message ...
  
  // Cache the response with 5 minute TTL
  await this.cacheService.set(cacheKey, response, 300);

  return response;
}
```

---

### 5. Career Cache

**Statut:** ⚠️ **NON APPLICABLE**

**Raison:** Aucun service Career dédié n'existe dans le codebase actuel. Les données de carrière sont gérées via le service CV et le Dashboard.

---

## 📈 MÉTRIQUES

### Types de Métriques

**Interface CacheMetrics:**
```typescript
export interface CacheMetrics {
  hits: number;              // Nombre de cache hits
  misses: number;            // Nombre de cache misses
  latency: {
    avg: number;             // Latence moyenne (ms)
    min: number;             // Latence minimum (ms)
    max: number;             // Latence maximum (ms)
    p95: number;             // 95ème percentile (ms)
    p99: number;             // 99ème percentile (ms)
  };
  lastReset: Date;           // Dernière réinitialisation
}
```

**Interface CacheStats:**
```typescript
export interface CacheStats {
  key: string;               // Préfixe de la clé de cache
  hits: number;              // Nombre de hits
  misses: number;            // Nombre de misses
  hitRate: number;           // Taux de hit (%)
  avgLatency: number;        // Latence moyenne (ms)
}
```

### Tracking des Métriques

**Mécanisme:**
- Chaque appel à `get()` enregistre automatiquement:
  - **Hit** si la valeur est trouvée dans le cache
  - **Miss** si la valeur n'est pas trouvée
  - **Latency** temps de réponse en millisecondes

**Calcul des percentiles:**
- Les 1000 dernières latences sont conservées
- P95 = valeur au 95ème percentile
- P99 = valeur au 99ème percentile

### Récupération des Métriques

**Méthode:** `CacheService.getMetrics(prefix?: string)`

**Exemple d'utilisation:**
```typescript
// Récupérer toutes les métriques
const allMetrics = cacheService.getMetrics();

// Récupérer les métriques pour un service spécifique
const graphMetrics = cacheService.getMetrics('graph');
const matchingMetrics = cacheService.getMetrics('matching');
const searchMetrics = cacheService.getMetrics('search_neighborhood');
const copilotMetrics = cacheService.getMetrics('copilot');
```

**Réinitialisation:**
```typescript
// Réinitialiser toutes les métriques
cacheService.resetMetrics();

// Réinitialiser les métriques d'un service spécifique
cacheService.resetMetrics('graph');
```

---

## ⚙️ CONFIGURATION TTL

### Variables d'Environnement

**Variables globales (dans `.env`):**
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
CACHE_TTL=3600
CACHE_MAX=1000
```

### TTL par Service

| Service | TTL (secondes) | TTL (minutes) | Raison |
|---------|----------------|---------------|--------|
| **Graph** | 3600 | 60 | Les graphes changent rarement |
| **Matching** | 1800 | 30 | Les résultats de matching sont valides pour une période moyenne |
| **Search** | 900 | 15 | Les résultats de recherche changent plus fréquemment |
| **Copilot** | 300 | 5 | Les conversations sont contextuelles et changent rapidement |

### Modification du TTL

**Pour modifier le TTL d'un service:**

1. **Modifier directement dans le code:**
```typescript
// Dans graph-repository.service.ts
await this.cacheService.set(cacheKey, graph, 7200); // 2 heures

// Dans graph-matching.service.ts
await this.cacheService.set(cacheKey, result, 3600); // 1 heure
```

2. **Utiliser des variables d'environnement par service:**
```typescript
// Dans cache.module.ts
useFactory: async (configService: ConfigService) => ({
  // ... existing config ...
  ttl: configService.get('CACHE_TTL', 3600),
  graphTTL: configService.get('GRAPH_CACHE_TTL', 3600),
  matchingTTL: configService.get('MATCHING_CACHE_TTL', 1800),
  searchTTL: configService.get('SEARCH_CACHE_TTL', 900),
  copilotTTL: configService.get('COPILOT_CACHE_TTL', 300),
}),
```

---

## 🔧 ARCHITECTURE

### Flux de Cache

```
Request
  ↓
CacheService.get(key)
  ↓
Cache Hit? → Yes → Return cached value
  ↓ No
Execute operation
  ↓
CacheService.set(key, value, ttl)
  ↓
Return value
```

### Invalidation du Cache

**Stratégies:**
1. **Time-based (TTL):** Les données expirent automatiquement après le TTL
2. **Explicit:** Suppression manuelle via `del(key)`
3. **Update-based:** Invalidation lors des mises à jour (ex: `updateGraph()`)

**Exemple d'invalidation:**
```typescript
async updateGraph(id: string, input: GraphUpdateInput): Promise<Graph> {
  // ... update in database ...
  
  // Invalidate cache
  const cacheKey = this.cacheService.generateKey('graph', id);
  await this.cacheService.del(cacheKey);
  
  return graph;
}
```

---

## 📊 MONITORING

### Métriques Disponibles

**Par service:**
- **Hits:** Nombre de requêtes servies depuis le cache
- **Misses:** Nombre de requêtes non trouvées dans le cache
- **Hit Rate:** Pourcentage de hits (hits / (hits + misses) * 100)
- **Avg Latency:** Latence moyenne des requêtes cache

**Latence détaillée:**
- **Min:** Latence minimum observée
- **Max:** Latence maximum observée
- **P95:** 95ème percentile (95% des requêtes sont plus rapides)
- **P99:** 99ème percentile (99% des requêtes sont plus rapides)

### Endpoint de Monitoring (Proposition)

**Ajouter un controller pour exposer les métriques:**

```typescript
// apps/api/src/cache/cache.controller.ts
@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('metrics')
  getMetrics(@Query('prefix') prefix?: string) {
    return this.cacheService.getMetrics(prefix);
  }

  @Post('metrics/reset')
  resetMetrics(@Query('prefix') prefix?: string) {
    this.cacheService.resetMetrics(prefix);
    return { success: true };
  }
}
```

---

## ✅ VALIDATION

### Services Cachés

- ✅ **Graph:** GraphRepository avec cache (TTL: 3600s)
- ✅ **Matching:** GraphMatchingService avec cache (TTL: 1800s)
- ✅ **Search:** GraphSearchService avec cache (TTL: 900s)
- ✅ **Copilot:** CopilotService avec cache (TTL: 300s)
- ⚠️ **Career:** Non applicable (pas de service dédié)

### Métriques

- ✅ **Cache Hit:** Tracking automatique
- ✅ **Cache Miss:** Tracking automatique
- ✅ **Latency:** Tracking avec percentiles (avg, min, max, p95, p99)

### TTL Configurable

- ✅ **Configuration globale:** Via variables d'environnement
- ✅ **Configuration par service:** TTL spécifique dans chaque service
- ✅ **Flexibilité:** Possibilité de modifier le TTL facilement

---

## 🎯 CONCLUSION

**Implémentation RC1.4:** ✅ **COMPLÉTÉE**

Le cache Redis a été implémenté avec succès pour les services Graph, Matching, Search et Copilot. Les métriques (Cache Hit, Cache Miss, Latency) sont automatiquement collectées et disponibles via `CacheService.getMetrics()`. Le TTL est configurable par service et via variables d'environnement.

**Prochaine étape:** Ajouter un endpoint de monitoring pour exposer les métriques via l'API.

---

**Rapport généré par:** Cascade AI  
**Date:** 2026-08-06  
**Version:** 1.0
