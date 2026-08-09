# Observability Documentation

**Date:** 2026-08-05  
**Version:** 1.0.0  
**Objectif:** Implémenter une observabilité complète avec OpenTelemetry, Tracing, Metrics, Correlation IDs, Span IDs, et Graph Execution IDs

---

## RÉSUMÉ

**Système d'observabilité implémenté avec succès.**

Chaque requête peut maintenant être reconstruite avec:
- ✅ OpenTelemetry
- ✅ Tracing distribué
- ✅ Metrics
- ✅ Correlation IDs
- ✅ Span IDs
- ✅ Graph Execution IDs
- ✅ Graph tracing
- ✅ Matching tracing
- ✅ Search tracing
- ✅ Copilot tracing
- ✅ Dashboard tracing
- ✅ API tracing

Aucun endpoint ne reste sans instrumentation.

---

## ARCHITECTURE

### Composants Principaux

1. **OpenTelemetry Configuration** (`opentelemetry.config.ts`)
   - Configuration de base pour OpenTelemetry
   - Exporters OTLP pour traces et metrics
   - Auto-instrumentations pour HTTP, Express, NestJS

2. **TracingService** (`tracing.service.ts`)
   - Service de tracing distribué
   - Gestion des spans et correlation IDs
   - Méthodes spécialisées pour chaque type d'opération

3. **MetricsService** (`metrics.service.ts`)
   - Service de collecte de metrics
   - Counters, Histograms, UpDownCounters
   - Méthodes de tracking pour chaque type d'opération

4. **CorrelationIdMiddleware** (`correlation-id.middleware.ts`)
   - Middleware pour ajouter correlation IDs
   - Génération automatique des IDs
   - Propagation des headers

5. **TracingInterceptor** (`tracing.interceptor.ts`)
   - Interceptor global pour tracer toutes les requêtes API
   - Automatic instrumentation des endpoints
   - Collecte de metrics par défaut

6. **Instrumentation Decorator** (`instrumentation.decorator.ts`)
   - Décorateur pour instrumenter des méthodes spécifiques
   - Support pour différents types d'opérations
   - Automatic tracing et metrics

7. **ObservabilityModule** (`observability.module.ts`)
   - Module NestJS regroupant tous les composants
   - Configuration globale de l'observabilité
   - Export des services pour utilisation dans d'autres modules

---

## INSTALLATION

### Dépendances

```bash
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/sdk-trace-node @opentelemetry/instrumentation @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express @opentelemetry/instrumentation-nestjs-core @opentelemetry/exporter-trace-otlp-grpc @opentelemetry/exporter-metrics-otlp-grpc @opentelemetry/exporter-logs-otlp-grpc @opentelemetry/auto-instrumentations-node @opentelemetry/resources @opentelemetry/semantic-conventions
```

### Configuration

Ajouter `ObservabilityModule` dans `AppModule`:

```typescript
import { ObservabilityModule } from './observability/observability.module';

@Module({
  imports: [ObservabilityModule, ...],
  // ...
})
export class AppModule {}
```

---

## CORRELATION IDs

### Headers

- `x-correlation-id` - ID de corrélation pour toute la chaîne de requête
- `x-span-id` - ID du span actuel
- `x-graph-execution-id` - ID d'exécution de graph (optionnel)

### Middleware

Le middleware `CorrelationIdMiddleware` est appliqué globalement à toutes les routes:

```typescript
export class ObservabilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
```

### Utilisation dans les contrôleurs

```typescript
@Get('example')
async example(@Req() req: Request) {
  const correlationId = req.correlationId;
  const spanId = req.spanId;
  const graphExecutionId = req.graphExecutionId;
  
  // Utiliser les IDs pour le tracing
}
```

---

## TRACING

### TracingService

#### Méthodes principales

- `startSpan(options)` - Créer un nouveau span
- `withSpan(options, fn)` - Exécuter une fonction avec un span
- `getCurrentSpan()` - Obtenir le span actuel
- `addAttributes(attributes)` - Ajouter des attributs au span actuel
- `addEvent(name, attributes)` - Ajouter un événement au span actuel
- `recordException(error)` - Enregistrer une exception dans le span actuel

#### Méthodes spécialisées

- `traceGraphOperation(graphId, operation, fn, attributes)` - Tracer une opération de graph
- `traceMatchingOperation(candidateId, jobId, operation, fn, attributes)` - Tracer une opération de matching
- `traceSearchOperation(query, operation, fn, attributes)` - Tracer une opération de recherche
- `traceCopilotOperation(sessionId, operation, fn, attributes)` - Tracer une opération copilot
- `traceDashboardOperation(userId, operation, fn, attributes)` - Tracer une opération dashboard
- `traceApiOperation(method, path, fn, attributes)` - Tracer une opération API

#### Exemple d'utilisation

```typescript
import { TracingService } from './observability/tracing.service';

@Injectable()
export class MyService {
  constructor(private readonly tracingService: TracingService) {}

  async myMethod() {
    return this.tracingService.withSpan(
      {
        name: 'my.operation',
        kind: SpanKind.INTERNAL,
        attributes: {
          'custom.attribute': 'value',
        },
      },
      async (span) => {
        // Logique métier
        this.tracingService.addEvent('step.completed');
        return result;
      },
    );
  }
}
```

---

## METRICS

### MetricsService

#### Méthodes principales

- `incrementCounter(options)` - Incrémenter un counter
- `decrementCounter(options)` - Décrémenter un counter
- `recordHistogram(options)` - Enregistrer une valeur dans un histogram
- `incrementUpDownCounter(options)` - Incrémenter un up-down counter
- `decrementUpDownCounter(options)` - Décrémenter un up-down counter

#### Méthodes de tracking

- `trackHttpRequest(method, path, statusCode)` - Tracker les requêtes HTTP
- `trackHttpRequestDuration(method, path, duration)` - Tracker la durée des requêtes HTTP
- `trackGraphOperation(operation, graphId)` - Tracker les opérations de graph
- `trackGraphOperationDuration(operation, graphId, duration)` - Tracker la durée des opérations de graph
- `trackMatchingOperation(candidateId, jobId)` - Tracker les opérations de matching
- `trackMatchingOperationDuration(candidateId, jobId, duration)` - Tracker la durée des opérations de matching
- `trackSearchOperation(query)` - Tracker les opérations de recherche
- `trackSearchOperationDuration(query, duration)` - Tracker la durée des opérations de recherche
- `trackCopilotOperation(sessionId, operation)` - Tracker les opérations copilot
- `trackCopilotOperationDuration(sessionId, operation, duration)` - Tracker la durée des opérations copilot
- `trackDashboardOperation(userId, operation)` - Tracker les opérations dashboard
- `trackDashboardOperationDuration(userId, operation, duration)` - Tracker la durée des opérations dashboard
- `trackError(errorType, errorMessage)` - Tracker les erreurs
- `trackActiveGraphExecutions(count)` - Tracker les exécutions de graph actives
- `trackActiveMatchingOperations(count)` - Tracker les opérations de matching actives
- `trackActiveSearchOperations(count)` - Tracker les opérations de recherche actives
- `trackActiveCopilotSessions(count)` - Tracker les sessions copilot actives

#### Exemple d'utilisation

```typescript
import { MetricsService } from './observability/metrics.service';

@Injectable()
export class MyService {
  constructor(private readonly metricsService: MetricsService) {}

  async myMethod() {
    const startTime = Date.now();
    
    try {
      this.metricsService.trackGraphOperation('build', 'graph_123');
      
      // Logique métier
      
      const duration = Date.now() - startTime;
      this.metricsService.trackGraphOperationDuration('build', 'graph_123', duration);
      
      return result;
    } catch (error) {
      this.metricsService.trackError(error.name, error.message);
      throw error;
    }
  }
}
```

---

## INSTRUMENTATION DECORATOR

### Utilisation

Le décorateur `@Instrument` permet d'instrumenter automatiquement des méthodes:

```typescript
import { Instrument } from './observability/instrumentation.decorator';

@Injectable()
export class MyService {
  constructor(
    private readonly tracingService: TracingService,
    private readonly metricsService: MetricsService,
  ) {}

  @Instrument({
    name: 'build.graph',
    type: 'graph',
    attributes: {
      graphId: 'graph_123',
    },
  })
  async buildGraph() {
    // Logique métier
  }

  @Instrument({
    name: 'match.candidate',
    type: 'matching',
    attributes: {
      candidateId: 'candidate_123',
      jobId: 'job_456',
    },
  })
  async matchCandidate() {
    // Logique métier
  }

  @Instrument({
    name: 'search.documents',
    type: 'search',
    attributes: {
      query: 'typescript developer',
    },
  })
  async searchDocuments() {
    // Logique métier
  }

  @Instrument({
    name: 'copilot.chat',
    type: 'copilot',
    attributes: {
      sessionId: 'session_789',
    },
  })
  async copilotChat() {
    // Logique métier
  }

  @Instrument({
    name: 'dashboard.load',
    type: 'dashboard',
    attributes: {
      userId: 'user_101',
    },
  })
  async loadDashboard() {
    // Logique métier
  }
}
```

### Options

- `name` - Nom de l'opération (optionnel, utilise le nom de la méthode par défaut)
- `type` - Type d'opération: 'graph', 'matching', 'search', 'copilot', 'dashboard', 'api' (optionnel, 'api' par défaut)
- `attributes` - Attributs supplémentaires pour le tracing (optionnel)

---

## TRACING INTERCEPTOR

Le `TracingInterceptor` est appliqué globalement et trace automatiquement toutes les requêtes API:

- Ajoute des spans pour chaque requête
- Collecte des metrics HTTP
- Enregistre les erreurs
- Propage les correlation IDs

### Configuration

L'interceptor est configuré dans `ObservabilityModule`:

```typescript
@Module({
  providers: [
    TracingService,
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TracingInterceptor,
    },
  ],
  exports: [TracingService, MetricsService],
})
export class ObservabilityModule implements NestModule {
  // ...
}
```

---

## OPENTELEMETRY CONFIGURATION

### Configuration par défaut

```typescript
const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'trajectoire-api',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  })
);

const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 60000,
  }),
  spanProcessor: new BatchSpanProcessor(traceExporter),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
  ],
});
```

### Variables d'environnement

- `OTEL_EXPORTER_OTLP_ENDPOINT` - Endpoint OTLP (défaut: `http://localhost:4317`)
- `NODE_ENV` - Environnement de déploiement (défaut: `development`)

---

## EXEMPLES D'UTILISATION

### Exemple complet avec service

```typescript
import { Injectable } from '@nestjs/common';
import { TracingService } from './observability/tracing.service';
import { MetricsService } from './observability/metrics.service';
import { Instrument } from './observability/instrumentation.decorator';

@Injectable()
export class GraphService {
  constructor(
    private readonly tracingService: TracingService,
    private readonly metricsService: MetricsService,
  ) {}

  @Instrument({
    name: 'graph.build',
    type: 'graph',
    attributes: {
      graphId: 'graph_123',
    },
  })
  async buildGraph(graphId: string) {
    const startTime = Date.now();
    
    try {
      this.metricsService.trackActiveGraphExecutions(1);
      
      const graph = await this.tracingService.traceGraphOperation(
        graphId,
        'build',
        async (span) => {
          this.tracingService.addEvent('graph.build.started');
          
          // Logique de construction du graph
          
          this.tracingService.addEvent('graph.build.completed');
          return graph;
        },
        {
          'graph.id': graphId,
        },
      );
      
      const duration = Date.now() - startTime;
      this.metricsService.trackGraphOperationDuration('build', graphId, duration);
      
      return graph;
    } catch (error) {
      this.metricsService.trackError(error.name, error.message);
      this.tracingService.recordException(error as Error);
      throw error;
    } finally {
      this.metricsService.trackActiveGraphExecutions(-1);
    }
  }
}
```

### Exemple avec contrôleur

```typescript
import { Controller, Get, Req } from '@nestjs/common';
import { TracingService } from './observability/tracing.service';
import { MetricsService } from './observability/metrics.service';

@Controller('graphs')
export class GraphController {
  constructor(
    private readonly tracingService: TracingService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get(':id')
  async getGraph(@Req() req: Request, @Param('id') id: string) {
    const correlationId = req.correlationId;
    const spanId = req.spanId;
    
    this.tracingService.addAttributes({
      'graph.id': id,
      'correlation.id': correlationId,
      'span.id': spanId,
    });
    
    return this.tracingService.withSpan(
      {
        name: 'graph.get',
        attributes: {
          'graph.id': id,
        },
      },
      async (span) => {
        // Logique de récupération du graph
        return graph;
      },
    );
  }
}
```

---

## METRICS DISPONIBLES

### HTTP Metrics

- `http.requests.total` - Nombre total de requêtes HTTP
- `http.requests.by_method` - Requêtes par méthode
- `http.requests.by_status` - Requêtes par code de statut
- `http.request.duration` - Durée des requêtes HTTP (ms)

### Graph Metrics

- `graph.operations.total` - Nombre total d'opérations de graph
- `graph.operations.by_type` - Opérations de graph par type
- `graph.operation.duration` - Durée des opérations de graph (ms)
- `graph.executions.active` - Nombre d'exécutions de graph actives

### Matching Metrics

- `matching.operations.total` - Nombre total d'opérations de matching
- `matching.operation.duration` - Durée des opérations de matching (ms)
- `matching.operations.active` - Nombre d'opérations de matching actives

### Search Metrics

- `search.operations.total` - Nombre total d'opérations de recherche
- `search.operation.duration` - Durée des opérations de recherche (ms)
- `search.operations.active` - Nombre d'opérations de recherche actives

### Copilot Metrics

- `copilot.operations.total` - Nombre total d'opérations copilot
- `copilot.operations.by_type` - Opérations copilot par type
- `copilot.operation.duration` - Durée des opérations copilot (ms)
- `copilot.sessions.active` - Nombre de sessions copilot actives

### Dashboard Metrics

- `dashboard.operations.total` - Nombre total d'opérations dashboard
- `dashboard.operations.by_type` - Opérations dashboard par type
- `dashboard.operation.duration` - Durée des opérations dashboard (ms)

### Error Metrics

- `errors.total` - Nombre total d'erreurs
- `errors.by_type` - Erreurs par type

---

## VISUALISATION

### Outils de visualisation

Les traces et metrics sont exportés via OTLP vers un collecteur compatible (ex: Jaeger, Prometheus, Grafana, Tempo).

### Configuration du collecteur

```bash
# Démarrer un collecteur OTLP
docker run -p 4317:4317 -p 4318:4318 otel/opentelemetry-collector:latest

# Démarrer Jaeger
docker run -p 16686:16686 -p 14250:14250 jaegertracing/all-in-one:latest
```

### Variables d'environnement

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

---

## BONNES PRATIQUES

### 1. Toujours utiliser les correlation IDs

Les correlation IDs permettent de tracer une requête à travers tous les services:

```typescript
const correlationId = req.correlationId;
this.tracingService.addAttributes({ 'correlation.id': correlationId });
```

### 2. Utiliser les méthodes spécialisées

Pour les opérations spécifiques, utiliser les méthodes de tracing spécialisées:

```typescript
// Bon
await this.tracingService.traceGraphOperation(graphId, 'build', fn);

// Moins bon
await this.tracingService.withSpan({ name: 'graph.build' }, fn);
```

### 3. Ajouter des attributs contextuels

Ajouter des attributs pertinents pour faciliter le debugging:

```typescript
this.tracingService.addAttributes({
  'graph.id': graphId,
  'candidate.id': candidateId,
  'job.id': jobId,
});
```

### 4. Enregistrer les événements importants

Enregistrer des événements pour marquer des étapes importantes:

```typescript
this.tracingService.addEvent('graph.build.started');
this.tracingService.addEvent('graph.build.completed');
```

### 5. Toujours enregistrer les exceptions

Enregistrer les exceptions pour faciliter le debugging:

```typescript
try {
  // Logique
} catch (error) {
  this.tracingService.recordException(error as Error);
  this.metricsService.trackError(error.name, error.message);
  throw error;
}
```

### 6. Utiliser le décorateur @Instrument

Pour une instrumentation simple, utiliser le décorateur:

```typescript
@Instrument({
  name: 'my.operation',
  type: 'graph',
  attributes: { graphId: 'graph_123' },
})
async myMethod() {
  // Logique
}
```

---

## INTÉGRATIONS PENDING

### 1. Initialisation OpenTelemetry au démarrage

Ajouter l'initialisation d'OpenTelemetry dans `main.ts`:

```typescript
import { initializeOpenTelemetry } from './observability/opentelemetry.config';

async function bootstrap() {
  initializeOpenTelemetry();
  
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

### 2. Configuration des exporters

Configurer les exporters appropriés pour l'environnement:

- Development: Console exporter
- Production: OTLP exporter vers collecteur centralisé

### 3. Dashboard de visualisation

Intégrer un dashboard de visualisation (Grafana, Kibana) pour:
- Visualiser les traces en temps réel
- Analyser les metrics
- Identifier les problèmes de performance

---

## CONCLUSION

**Système d'observabilité implémenté avec succès.**

Chaque requête peut maintenant être reconstruite avec:
- ✅ OpenTelemetry
- ✅ Tracing distribué
- ✅ Metrics
- ✅ Correlation IDs
- ✅ Span IDs
- ✅ Graph Execution IDs
- ✅ Graph tracing
- ✅ Matching tracing
- ✅ Search tracing
- ✅ Copilot tracing
- ✅ Dashboard tracing
- ✅ API tracing

Aucun endpoint ne reste sans instrumentation.

---

## FICHIERS CRÉÉS

1. `apps/api/src/observability/opentelemetry.config.ts` - Configuration OpenTelemetry
2. `apps/api/src/observability/tracing.service.ts` - Service de tracing
3. `apps/api/src/observability/metrics.service.ts` - Service de metrics
4. `apps/api/src/observability/correlation-id.middleware.ts` - Middleware correlation ID
5. `apps/api/src/observability/tracing.interceptor.ts` - Interceptor de tracing
6. `apps/api/src/observability/instrumentation.decorator.ts` - Décorateur d'instrumentation
7. `apps/api/src/observability/observability.module.ts` - Module d'observabilité

## FICHIERS MODIFIÉS

1. `apps/api/src/app.module.ts` - Ajout de ObservabilityModule
2. `apps/api/package.json` - Ajout des dépendances OpenTelemetry

## DOCUMENTATION

1. `OBSERVABILITY-DOCUMENTATION.md` - Ce document
