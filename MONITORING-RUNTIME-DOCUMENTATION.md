# Monitoring Runtime Documentation

**Date:** 2026-08-05  
**Version:** 1.0.0  
**Objectif:** Créer un Monitoring Runtime avec Dashboard interne

---

## RÉSUMÉ

**Système de monitoring runtime implémenté avec succès.**

Dashboard interne affichant:
- ✅ Temps de matching
- ✅ Temps de search
- ✅ Temps graph
- ✅ Temps reasoning
- ✅ Cache hit
- ✅ Cache miss
- ✅ Nombre de nodes
- ✅ Nombre de relations
- ✅ Latence
- ✅ CPU
- ✅ RAM
- ✅ Erreurs

---

## ARCHITECTURE

### Composants Principaux

1. **RuntimeMetricsService** (`runtime-metrics.service.ts`)
   - Collecte les métriques runtime (CPU, mémoire, uptime)
   - Suit les opérations (matching, search, graph, reasoning)
   - Calcule les percentiles de latence (P50, P95, P99)
   - Enregistre les erreurs par type

2. **GraphMetricsService** (`graph-metrics.service.ts`)
   - Collecte les métriques spécifiques aux graphes
   - Suit les nodes et edges par type
   - Enregistre les cache hits/misses
   - Calcule les statistiques de graphe

3. **MonitoringController** (`monitoring.controller.ts`)
   - Expose les endpoints REST pour les métriques
   - Fournit des endpoints granulaires et agrégés
   - Permet le reset et le refresh des métriques

4. **MonitoringModule** (`monitoring.module.ts`)
   - Module NestJS regroupant tous les composants
   - Exporte les services pour utilisation dans d'autres modules

5. **Dashboard Frontend** (`apps/web/src/app/monitoring/page.tsx`)
   - Interface utilisateur pour visualiser les métriques
   - Rafraîchissement automatique toutes les 5 secondes
   - Affichage en temps réel des métriques système

---

## INSTALLATION

### Dépendances

Aucune dépendance supplémentaire n'est requise. Les services utilisent:
- `os` (Node.js builtin) pour les métriques système
- `MetricsService` de l'observabilité existante

### Configuration

Ajouter `MonitoringModule` dans `AppModule`:

```typescript
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [MonitoringModule, ...],
  // ...
})
export class AppModule {}
```

---

## API ENDPOINTS

### Métriques Runtime

#### GET `/monitoring/runtime`
Retourne toutes les métriques runtime:
```json
{
  "cpu": {
    "usage": 0.45,
    "loadAverage": [1.2, 1.5, 1.8]
  },
  "memory": {
    "total": 17179869184,
    "used": 8589934592,
    "free": 8589934592,
    "usage": 0.5
  },
  "uptime": 3600000,
  "errors": {
    "total": 5,
    "byType": {
      "ValidationError": 3,
      "DatabaseError": 2
    }
  },
  "latency": {
    "p50": 150,
    "p95": 300,
    "p99": 500,
    "avg": 200
  }
}
```

#### GET `/monitoring/operations`
Retourne les métriques d'opérations:
```json
{
  "matching": {
    "time": 250,
    "count": 100,
    "errors": 2
  },
  "search": {
    "time": 150,
    "count": 200,
    "errors": 1
  },
  "graph": {
    "time": 500,
    "count": 50,
    "errors": 0
  },
  "reasoning": {
    "time": 1000,
    "count": 25,
    "errors": 1
  }
}
```

#### GET `/monitoring/cpu`
Retourne les métriques CPU uniquement.

#### GET `/monitoring/memory`
Retourne les métriques mémoire uniquement.

#### GET `/monitoring/uptime`
Retourne l'uptime du système:
```json
{
  "uptime": 3600000
}
```

#### GET `/monitoring/errors`
Retourne les métriques d'erreurs uniquement.

#### GET `/monitoring/latency`
Retourne les métriques de latence uniquement.

### Métriques d'Opérations

#### GET `/monitoring/matching`
Retourne les métriques de matching uniquement.

#### GET `/monitoring/search`
Retourne les métriques de search uniquement.

#### GET `/monitoring/graph-operations`
Retourne les métriques d'opérations de graphe uniquement.

#### GET `/monitoring/reasoning`
Retourne les métriques de reasoning uniquement.

### Métriques de Graphe

#### GET `/monitoring/graph`
Retourne toutes les métriques de graphe:
```json
{
  "nodes": {
    "total": 1000,
    "byType": {
      "CANDIDATE": 100,
      "SKILL": 500,
      "EXPERIENCE": 200,
      "EDUCATION": 100,
      "CERTIFICATION": 50,
      "LANGUAGE": 50
    }
  },
  "edges": {
    "total": 2500,
    "byType": {
      "HAS_SKILL": 1000,
      "HAS_EXPERIENCE": 500,
      "HAS_EDUCATION": 200,
      "HAS_CERTIFICATION": 100,
      "SPEAKS_LANGUAGE": 100,
      "WORKED_AT": 300,
      "LOCATED_IN": 100,
      "USES_TECHNOLOGY": 200
    }
  },
  "cache": {
    "hits": 800,
    "misses": 200,
    "hitRate": 0.8
  },
  "graphs": {
    "total": 50,
    "active": 45
  }
}
```

#### GET `/monitoring/nodes`
Retourne les métriques de nodes uniquement.

#### GET `/monitoring/edges`
Retourne les métriques d'edges uniquement.

#### GET `/monitoring/cache`
Retourne les métriques de cache uniquement:
```json
{
  "hits": 800,
  "misses": 200,
  "hitRate": 0.8
}
```

#### GET `/monitoring/graph-statistics`
Retourne les statistiques de graphe:
```json
{
  "nodeCount": 1000,
  "edgeCount": 2500,
  "averageDegree": 5,
  "density": 0.005,
  "connectedComponents": 10
}
```

### Endpoints Agrégés

#### GET `/monitoring/all`
Retourne toutes les métriques (runtime, operations, graph, statistics):
```json
{
  "runtime": { /* RuntimeMetrics */ },
  "operations": { /* OperationMetrics */ },
  "graph": { /* GraphMetrics */ },
  "statistics": { /* GraphStatistics */ }
}
```

### Endpoints de Gestion

#### GET `/monitoring/reset-runtime`
Reset toutes les métriques runtime:
```json
{
  "message": "Runtime metrics reset successfully"
}
```

#### GET `/monitoring/reset-graph`
Reset toutes les métriques de graphe:
```json
{
  "message": "Graph metrics reset successfully"
}
```

#### GET `/monitoring/refresh-graph`
Refresh les métriques de graphe depuis le repository:
```json
{
  "message": "Graph metrics refreshed successfully"
}
```

---

## UTILISATION DES SERVICES

### RuntimeMetricsService

#### Enregistrer une opération

```typescript
import { RuntimeMetricsService } from './monitoring/runtime-metrics.service';

@Injectable()
export class MyService {
  constructor(private readonly runtimeMetrics: RuntimeMetricsService) {}

  async myOperation() {
    const startTime = Date.now();
    
    try {
      // Logique de l'opération
      this.runtimeMetrics.incrementOperationCount('matching');
      
      const duration = Date.now() - startTime;
      this.runtimeMetrics.recordOperationTime('matching', duration);
      
      return result;
    } catch (error) {
      this.runtimeMetrics.incrementOperationError('matching');
      this.runtimeMetrics.recordError(error.name);
      throw error;
    }
  }
}
```

#### Obtenir les métriques

```typescript
const runtimeMetrics = this.runtimeMetrics.getRuntimeMetrics();
const operationMetrics = this.runtimeMetrics.getAllOperationMetrics();
const specificMetrics = this.runtimeMetrics.getOperationMetrics('matching');
```

### GraphMetricsService

#### Enregistrer les événements de cache

```typescript
import { GraphMetricsService } from './monitoring/graph-metrics.service';

@Injectable()
export class MyService {
  constructor(private readonly graphMetrics: GraphMetricsService) {}

  async getFromCache(key: string) {
    const cached = await this.cache.get(key);
    
    if (cached) {
      this.graphMetrics.recordCacheHit();
      return cached;
    } else {
      this.graphMetrics.recordCacheMiss();
      return null;
    }
  }
}
```

#### Mettre à jour les métriques de graphe

```typescript
// Mettre à jour le nombre de nodes
this.graphMetrics.updateNodeCount(1000);

// Mettre à jour le nombre d'edges
this.graphMetrics.updateEdgeCount(2500);

// Mettre à jour les nodes par type
this.graphMetrics.updateNodesByType('CANDIDATE', 100);

// Mettre à jour les edges par type
this.graphMetrics.updateEdgesByType('HAS_SKILL', 500);
```

#### Obtenir les métriques

```typescript
const graphMetrics = await this.graphMetrics.getGraphMetrics();
const nodeMetrics = this.graphMetrics.getNodeMetrics();
const edgeMetrics = this.graphMetrics.getEdgeMetrics();
const cacheMetrics = this.graphMetrics.getCacheMetrics();
const statistics = this.graphMetrics.getGraphStatistics();
```

---

## DASHBOARD

### Accès

Le dashboard est accessible à l'URL: `/monitoring`

### Fonctionnalités

- **Affichage en temps réel** des métriques système
- **Rafraîchissement automatique** toutes les 5 secondes
- **Visualisation graphique** des métriques CPU et mémoire
- **Tableaux de bord** pour les opérations, latence, cache, et erreurs
- **Formatage intelligent** des bytes et temps

### Sections du Dashboard

1. **CPU**
   - Utilisation CPU avec barre de progression
   - Load average (1, 5, 15 minutes)

2. **Mémoire**
   - Utilisation mémoire avec barre de progression
   - Total, utilisé, libre en format lisible

3. **Opérations**
   - Temps moyen par type d'opération
   - Nombre d'opérations par type
   - Nombre d'erreurs par type

4. **Latence**
   - P50, P95, P99, Average en millisecondes

5. **Graphe**
   - Nombre total de nodes
   - Nombre total d'edges
   - Nombre total de graphes
   - Nombre de graphes actifs

6. **Cache**
   - Cache hits
   - Cache misses
   - Hit rate avec barre de progression

7. **Erreurs**
   - Total des erreurs
   - Erreurs par type

8. **Système**
   - Uptime du système

---

## INTÉGRATION AVEC L'OBSERVABILITÉ

### Utilisation avec TracingService

Les métriques de runtime peuvent être combinées avec le tracing existant:

```typescript
import { TracingService } from './observability/tracing.service';
import { RuntimeMetricsService } from './monitoring/runtime-metrics.service';

@Injectable()
export class MyService {
  constructor(
    private readonly tracingService: TracingService,
    private readonly runtimeMetrics: RuntimeMetricsService,
  ) {}

  async myOperation() {
    const startTime = Date.now();
    
    return this.tracingService.traceGraphOperation(
      'graph_123',
      'my.operation',
      async (span) => {
        try {
          this.runtimeMetrics.incrementOperationCount('graph');
          
          // Logique de l'opération
          
          const duration = Date.now() - startTime;
          this.runtimeMetrics.recordOperationTime('graph', duration);
          
          return result;
        } catch (error) {
          this.runtimeMetrics.incrementOperationError('graph');
          this.runtimeMetrics.recordError(error.name);
          throw error;
        }
      },
    );
  }
}
```

### Utilisation avec MetricsService

Les métriques de runtime peuvent être enrichies avec les métriques OpenTelemetry:

```typescript
import { MetricsService } from './observability/metrics.service';
import { RuntimeMetricsService } from './monitoring/runtime-metrics.service';

@Injectable()
export class MyService {
  constructor(
    private readonly metricsService: MetricsService,
    private readonly runtimeMetrics: RuntimeMetricsService,
  ) {}

  async myOperation() {
    const startTime = Date.now();
    
    try {
      this.metricsService.trackGraphOperation('my.operation', 'graph_123');
      this.runtimeMetrics.incrementOperationCount('graph');
      
      // Logique de l'opération
      
      const duration = Date.now() - startTime;
      this.metricsService.trackGraphOperationDuration('my.operation', 'graph_123', duration);
      this.runtimeMetrics.recordOperationTime('graph', duration);
      
      return result;
    } catch (error) {
      this.metricsService.trackError(error.name, error.message);
      this.runtimeMetrics.recordError(error.name);
      throw error;
    }
  }
}
```

---

## BONNES PRATIQUES

### 1. Enregistrer systématiquement les opérations

Enregistrer le temps et le compte pour chaque opération:

```typescript
const startTime = Date.now();
try {
  // Logique
  this.runtimeMetrics.incrementOperationCount('matching');
  this.runtimeMetrics.recordOperationTime('matching', Date.now() - startTime);
} catch (error) {
  this.runtimeMetrics.incrementOperationError('matching');
  this.runtimeMetrics.recordError(error.name);
  throw error;
}
```

### 2. Mettre à jour les métriques de graphe régulièrement

Mettre à jour les métriques de graphe après chaque modification:

```typescript
await this.graphRepository.addNode(node);
this.graphMetrics.updateNodeCount(this.graphMetrics.getNodeMetrics().total + 1);
this.graphMetrics.updateNodesByType(node.type, 
  this.graphMetrics.getNodeMetrics().byType[node.type] + 1);
```

### 3. Enregistrer les événements de cache

Enregistrer systématiquement les hits et misses:

```typescript
const cached = await this.cache.get(key);
if (cached) {
  this.graphMetrics.recordCacheHit();
} else {
  this.graphMetrics.recordCacheMiss();
}
```

### 4. Utiliser le décorateur @Instrument

Combiner avec le décorateur d'instrumentation pour un tracing complet:

```typescript
import { Instrument } from './observability/instrumentation.decorator';

@Injectable()
export class MyService {
  constructor(
    private readonly runtimeMetrics: RuntimeMetricsService,
  ) {}

  @Instrument({
    name: 'matching.execute',
    type: 'matching',
    attributes: {
      candidateId: 'candidate_123',
      jobId: 'job_456',
    },
  })
  async executeMatching() {
    // Logique
    // Le décorateur gère automatiquement le tracing
    // Les métriques de runtime sont mises à jour manuellement
  }
}
```

---

## DÉPANNAGE

### Métriques non mises à jour

Vérifier que:
- Les services sont correctement injectés
- Les méthodes d'enregistrement sont appelées
- Le MonitoringModule est importé dans AppModule

### Dashboard ne se charge pas

Vérifier que:
- L'API est accessible
- Les endpoints retournent des données valides
- Le frontend est correctement configuré

### Métriques incorrectes

Vérifier que:
- Les compteurs sont initialisés correctement
- Les mises à jour sont appelées au bon moment
- Les resets ne sont pas appelés inopinément

---

## PERFORMANCE

### Impact sur les performances

Les métriques de runtime ont un impact minimal sur les performances:
- Enregistrement d'opérations: O(1)
- Calcul de percentiles: O(n log n) avec n ≤ 1000
- Calcul de moyennes: O(n)
- Métriques système: O(1)

### Optimisations

- Les métriques sont limitées aux 1000 dernières mesures
- Les calculs sont effectués à la demande
- Les mises à jour sont asynchrones lorsque possible

---

## SÉCURITÉ

### Contrôle d'accès

Les endpoints de monitoring sont actuellement publics. Pour restreindre l'accès:

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

@Controller('monitoring')
@UseGuards(AuthGuard)
export class MonitoringController {
  // ...
}
```

### Données sensibles

Les métriques ne contiennent pas de données sensibles, mais il est recommandé de:
- Restreindre l'accès au dashboard
- Utiliser HTTPS en production
- Logger les accès aux endpoints de monitoring

---

## FUTURES AMÉLIORATIONS

### Court terme

1. **Alertes**
   - Configuration de seuils d'alerte
   - Notifications par email/webhook
   - Intégration avec PagerDuty/Slack

2. **Historique**
   - Stockage des métriques dans une base de données
   - Graphiques historiques
   - Comparaison temporelle

3. **Export**
   - Export des métriques en CSV/JSON
   - Intégration avec Grafana/Prometheus
   - Support de formats standards (OpenTelemetry)

### Moyen terme

1. **Prédictions**
   - Prédiction de charge
   - Détection d'anomalies
   - Recommandations d'optimisation

2. **Comparaison**
   - Comparaison entre environnements
   - Benchmarking
   - Analyse de tendances

3. **Personnalisation**
   - Dashboard personnalisable
   - Widgets configurables
   - Thèmes et layouts

---

## CONCLUSION

**Système de monitoring runtime implémenté avec succès.**

Dashboard interne affichant:
- ✅ Temps de matching
- ✅ Temps de search
- ✅ Temps graph
- ✅ Temps reasoning
- ✅ Cache hit
- ✅ Cache miss
- ✅ Nombre de nodes
- ✅ Nombre de relations
- ✅ Latence
- ✅ CPU
- ✅ RAM
- ✅ Erreurs

---

## FICHIERS CRÉÉS

1. `apps/api/src/monitoring/runtime-metrics.service.ts` - Service de métriques runtime
2. `apps/api/src/monitoring/graph-metrics.service.ts` - Service de métriques de graphe
3. `apps/api/src/monitoring/monitoring.controller.ts` - Contrôleur de monitoring
4. `apps/api/src/monitoring/monitoring.module.ts` - Module de monitoring
5. `apps/web/src/app/monitoring/page.tsx` - Dashboard frontend

## FICHIERS MODIFIÉS

1. `apps/api/src/app.module.ts` - Ajout de MonitoringModule

## DOCUMENTATION

1. `MONITORING-RUNTIME-DOCUMENTATION.md` - Ce document
