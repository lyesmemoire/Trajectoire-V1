# Blueprint V3 - Plan de Migration Zéro Interruption

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Migrer vers l'architecture V2 Enterprise avec **zéro interruption de service** et **zéro régression** pour les utilisateurs.

---

## Principes

### 1. Zero Downtime

- Aucune interruption de service
- Déploiement progressif
- Feature flags pour basculement
- Rollback immédiat (< 5 minutes)

### 2. Backward Compatibility

- Aucune rupture de compatibilité
- Coexistence V1 + V2
- Migration progressive des données
- Tests de régression complets

### 3. Observability

- Monitoring temps réel
- Métriques par version
- Alertes automatiques
- Dashboards de migration

### 4. Safety First

- Canary testing
- Chaos engineering
- Runbooks de récupération
- Communication proactive

---

## Stratégie de Migration

### Phase 1 : Préparation (2 semaines)

#### 1.1 Infrastructure

**Objectif** : Préparer l'infrastructure pour V2

**Tâches**
- [ ] Déployer Redis Cluster (HA)
- [ ] Configurer BullMQ
- [ ] Déployer Interview Orchestrator (NestJS)
- [ ] Configurer Event Bus
- [ ] Configurer OpenTelemetry
- [ ] Configurer Feature Flags

**Validation**
- [ ] Redis Cluster HA testé
- [ ] BullMQ fonctionnel
- [ ] Orchestrator déployé
- [ ] Event Bus fonctionnel
- [ ] Tracing distribué fonctionnel

#### 1.2 Data Migration

**Objectif** : Migrer les données existantes

**Tâches**
- [ ] Analyser les données existantes
- [ ] Créer les scripts de migration
- [ ] Tester la migration sur staging
- [ ] Planifier la migration en production

**Validation**
- [ ] Migration testée sur staging
- [ ] Runbook de migration validé
- [ ] Rollback plan validé

#### 1.3 Testing

**Objectif** : Tester tous les flux

**Tâches**
- [ ] Tests E2E V1 (régression)
- [ ] Tests E2E V2
- [ ] Tests de performance (V1 vs V2)
- [ ] Tests de charge (100 sessions simultanées)
- [ ] Tests de rollback

**Validation**
- [ ] Tests E2E V1 passent
- [ ] Tests E2E V2 passent
- [ ] Performance V2 ≤ 2x V1
- [ ] Charge test réussi
- [ ] Rollback test réussi

---

### Phase 2 : Canary (2 semaines)

#### 2.1 Déploiement V2 (Feature Flag Off)

**Objectif** : Déployer V2 sans l'activer

**Tâches**
- [ ] Déployer Interview Orchestrator
- [ ] Déployer Event Bus
- [ ] Configurer feature flag `USE_V2_ORCHESTRATOR=false`
- [ ] Vérifier que V1 fonctionne toujours

**Validation**
- [ ] V1 fonctionnel
- [ ] V2 déployé mais inactif
- [ ] Aucune régression détectée

#### 2.2 Activation Canary (1%)

**Objectif** : Activer V2 pour 1% des utilisateurs

**Tâches**
- [ ] Configurer feature flag pour 1%
- [ ] Activer monitoring intensif
- [ ] Configurer alertes
- [ ] Préparer runbook de rollback

**Validation**
- [ ] 1% des utilisateurs sur V2
- [ ] Monitoring fonctionnel
- [ ] Alertes configurées
- [ ] Runbook prêt

#### 2.3 Monitoring Canary (7 jours)

**Objectif** : Surveiller V2 en production

**Métriques**
- Taux d'erreur V2 < 0.5%
- Latence V2 < 2x V1
- Aucun bug critique
- Utilisateurs satisfaits

**Actions**
- [ ] Monitoring 24/7
- [ ] Analyse des métriques
- [ ] Ajustements si nécessaires
- [ ] Communication avec l'équipe

**Validation**
- [ ] Taux d'erreur < 0.5%
- [ ] Latence acceptable
- [ ] Aucun bug critique
- [ ] Feedback positif

---

### Phase 3 : Rollout (4 semaines)

#### 3.1 5% → 10% → 25% (1 semaine)

**Objectif** : Augmenter progressivement le pourcentage

**Tâches**
- [ ] Passer à 5% (jour 1)
- [ ] Passer à 10% (jour 3)
- [ ] Passer à 25% (jour 7)
- [ ] Monitoring continu

**Validation**
- [ ] Taux d'erreur < 0.5%
- [ ] Latence acceptable
- [ ] Aucun bug critique

#### 3.2 50% (1 semaine)

**Objectif** : Atteindre 50% des utilisateurs

**Tâches**
- [ ] Passer à 50% (jour 1)
- [ ] Monitoring continu
- [ ] Analyse des métriques

**Validation**
- [ ] Taux d'erreur < 0.5%
- [ ] Latence acceptable
- [ ] Aucun bug critique

#### 3.3 100% (2 semaines)

**Objectif** : Migrer tous les utilisateurs

**Tâches**
- [ ] Passer à 100% (jour 1)
- [ ] Monitoring continu (2 semaines)
- [ ] Communication utilisateurs
- [ ] Documentation mise à jour

**Validation**
- [ ] 100% des utilisateurs sur V2
- [ ] Aucune régression
- [ ] Performance stable
- [ ] Documentation à jour

---

### Phase 4 : Nettoyage (1 semaine)

#### 4.1 Suppression V1

**Objectif** : Supprimer le code V1

**Tâches**
- [ ] Supprimer le Runtime vocal V1
- [ ] Supprimer le feature flag
- [ ] Nettoyer le code
- [ ] Mettre à jour la documentation

**Validation**
- [ ] Code V1 supprimé
- [ ] Feature flag supprimé
- [ ] Documentation à jour

#### 4.2 Archivage

**Objectif** : Archiver les données V1

**Tâches**
- [ ] Archiver les données V1
- [ ] Sauvegarder les logs
- [ ] Documenter l'architecture V1

**Validation**
- [ ] Données V1 archivées
- [ ] Logs sauvegardés
- [ ] Architecture V1 documentée

---

## Feature Flag Strategy

### Configuration

```typescript
// Feature flag configuration
const FEATURE_FLAGS = {
  USE_V2_ORCHESTRATOR: {
    key: 'use_v2_orchestrator',
    type: 'percentage',
    defaultValue: false,
    description: 'Use V2 Interview Orchestrator instead of V1',
    rolloutPercentage: 0, // 0-100
    userWhitelist: [], // User IDs forced to V2
    userBlacklist: [], // User IDs forced to V1
  },
} as const;
```

### Implementation

```typescript
class FeatureFlagService {
  private flags: Map<string, FeatureFlag> = new Map();

  constructor() {
    this.loadFlags();
  }

  isEnabled(flagKey: string, userId?: string): boolean {
    const flag = this.flags.get(flagKey);
    if (!flag) return false;

    // Whitelist
    if (userId && flag.userWhitelist.includes(userId)) {
      return true;
    }

    // Blacklist
    if (userId && flag.userBlacklist.includes(userId)) {
      return false;
    }

    // Percentage
    if (flag.type === 'percentage') {
      return this.shouldEnableForUser(userId, flag.rolloutPercentage);
    }

    return flag.defaultValue;
  }

  private shouldEnableForUser(userId: string | undefined, percentage: number): boolean {
    if (!userId) return false;

    // Hash du userId pour déterminer si l'utilisateur est dans le pourcentage
    const hash = this.hashUserId(userId);
    return (hash % 100) < percentage;
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  async setRolloutPercentage(flagKey: string, percentage: number): Promise<void> {
    const flag = this.flags.get(flagKey);
    if (!flag) throw new Error(`Flag ${flagKey} not found`);

    flag.rolloutPercentage = percentage;
    await this.saveFlags();
  }

  private loadFlags(): void {
    // Charger depuis la base de données ou le fichier de config
  }

  private async saveFlags(): Promise<void> {
    // Sauvegarder dans la base de données ou le fichier de config
  }
}
```

### Usage

```typescript
// Dans l'Orchestrator Adapter
class OrchestratorAdapter {
  private featureFlagService: FeatureFlagService;

  async handleTranscript(sessionId: string, transcript: string): Promise<void> {
    const useV2 = this.featureFlagService.isEnabled('USE_V2_ORCHESTRATOR', sessionId);

    if (useV2) {
      // V2 : Envoyer à l'Orchestrator via Event Bus
      await this.eventBus.publish('TranscriptReceived', {
        sessionId,
        transcript,
        timestamp: new Date(),
      });
    } else {
      // V1 : Runtime vocal existant
      const session = getVoiceSession(sessionId);
      if (session?.sink) {
        session.sink.dispatch({
          type: 'transcript',
          text: transcript,
          isFinal: true,
        });
      }
    }
  }
}
```

---

## Rollback Strategy

### Conditions de Rollback

**Rollback immédiat (< 5 minutes)**
- Taux d'erreur > 5%
- Latence > 5x V1
- Bug critique (crash, data loss)
- Event Bus down

**Rollback planifié**
- Taux d'erreur > 1% (pendant 1 heure)
- Latence > 3x V1 (pendant 1 heure)
- Feedback négatif massif

### Procédure de Rollback

```typescript
class RollbackManager {
  async rollback(): Promise<void> {
    // 1. Mettre à jour le feature flag
    await this.featureFlagService.setRolloutPercentage('USE_V2_ORCHESTRATOR', 0);

    // 2. Redémarrer les services (si nécessaire)
    await this.restartServices();

    // 3. Vérifier que V1 fonctionne
    await this.verifyV1();

    // 4. Notifier l'équipe
    await this.notifyTeam('Rollback completed');

    // 5. Logger le rollback
    this.logRollback();
  }

  private async restartServices(): Promise<void> {
    // Redémarrer les services si nécessaire
  }

  private async verifyV1(): Promise<void> {
    // Vérifier que V1 fonctionne
  }

  private async notifyTeam(message: string): Promise<void> {
    // Notifier l'équipe via Slack/Email
  }

  private logRollback(): void {
    console.log('[Rollback] Rollback completed at', new Date());
  }
}
```

### Runbook de Rollback

```markdown
# Rollback Runbook

## Conditions de Rollback
- Taux d'erreur > 5%
- Latence > 5x V1
- Bug critique
- Event Bus down

## Procédure
1. Mettre à jour le feature flag : `USE_V2_ORCHESTRATOR=0`
2. Vérifier que V1 fonctionne
3. Notifier l'équipe
4. Logger le rollback

## Temps estimé
- < 5 minutes

## Après Rollback
- Analyser les logs
- Identifier la cause
- Corriger le problème
- Planifier un nouveau rollout
```

---

## Monitoring

### Métriques

```typescript
interface MigrationMetrics {
  // Feature flag
  v2_orchestrator_enabled_percentage: number;
  v2_orchestrator_user_count: number;
  v1_orchestrator_user_count: number;

  // Performance
  v2_orchestrator_latency_p50: number;
  v2_orchestrator_latency_p95: number;
  v2_orchestrator_latency_p99: number;
  v1_orchestrator_latency_p50: number;
  v1_orchestrator_latency_p95: number;
  v1_orchestrator_latency_p99: number;

  // Errors
  v2_orchestrator_error_rate: number;
  v1_orchestrator_error_rate: number;
  v2_orchestrator_error_count: number;
  v1_orchestrator_error_count: number;

  // Event Bus
  event_bus_publish_rate: number;
  event_bus_consume_rate: number;
  event_bus_latency: number;
  event_bus_error_rate: number;

  // Redis
  redis_memory_usage: number;
  redis_cpu_usage: number;
  redis_connections: number;
  redis_commands_per_second: number;

  // BullMQ
  bullmq_queue_size: number;
  bullmq_active_jobs: number;
  bullmq_completed_jobs: number;
  bullmq_failed_jobs: number;
}
```

### Dashboards

**Dashboard Principal**
- Pourcentage V1 vs V2
- Latence V1 vs V2
- Taux d'erreur V1 vs V2
- Event Bus metrics
- Redis metrics
- BullMQ metrics

**Dashboard Canary**
- Métriques V2 uniquement
- Alertes canary
- Feedback utilisateurs

### Alertes

```typescript
const ALERTS = {
  // Critical
  V2_ERROR_RATE_HIGH: {
    condition: 'v2_orchestrator_error_rate > 0.05',
    severity: 'critical',
    action: 'rollback_immediate',
  },
  V2_LATENCY_HIGH: {
    condition: 'v2_orchestrator_latency_p95 > 5 * v1_orchestrator_latency_p95',
    severity: 'critical',
    action: 'rollback_immediate',
  },
  EVENT_BUS_DOWN: {
    condition: 'event_bus_error_rate > 0.5',
    severity: 'critical',
    action: 'rollback_immediate',
  },

  // Warning
  V2_ERROR_RATE_MEDIUM: {
    condition: 'v2_orchestrator_error_rate > 0.01',
    severity: 'warning',
    action: 'notify_team',
  },
  V2_LATENCY_MEDIUM: {
    condition: 'v2_orchestrator_latency_p95 > 3 * v1_orchestrator_latency_p95',
    severity: 'warning',
    action: 'notify_team',
  },

  // Info
  V2_ROLLOUT_CHANGED: {
    condition: 'v2_orchestrator_enabled_percentage changed',
    severity: 'info',
    action: 'log',
  },
} as const;
```

---

## Chaos Engineering

### Scenarios

**Scenario 1 : Event Bus Down**
- Simuler une panne de l'Event Bus
- Vérifier que le rollback fonctionne
- Vérifier que V1 fonctionne

**Scenario 2 : Redis Down**
- Simuler une panne de Redis
- Vérifier que le rollback fonctionne
- Vérifier que V1 fonctionne

**Scenario 3 : High Latency**
- Simuler une latence élevée
- Vérifier que le rollback fonctionne
- Vérifier que V1 fonctionne

**Scenario 4 : Feature Flag Failure**
- Simuler une panne du feature flag
- Vérifier que le système fonctionne avec la valeur par défaut

### Implementation

```typescript
class ChaosEngine {
  async injectFailure(scenario: string): Promise<void> {
    switch (scenario) {
      case 'event_bus_down':
        await this.simulateEventBusDown();
        break;
      case 'redis_down':
        await this.simulateRedisDown();
        break;
      case 'high_latency':
        await this.simulateHighLatency();
        break;
      case 'feature_flag_failure':
        await this.simulateFeatureFlagFailure();
        break;
    }
  }

  private async simulateEventBusDown(): Promise<void> {
    // Simuler une panne de l'Event Bus
  }

  private async simulateRedisDown(): Promise<void> {
    // Simuler une panne de Redis
  }

  private async simulateHighLatency(): Promise<void> {
    // Simuler une latence élevée
  }

  private async simulateFeatureFlagFailure(): Promise<void> {
    // Simuler une panne du feature flag
  }
}
```

---

## Communication

### Avant Migration

**Communication Interne**
- [ ] Présentation de la migration à l'équipe
- [ ] Runbook partagé
- [ ] Calendrier partagé
- [ ] Rôles et responsabilités définis

**Communication Externe**
- [ ] Aucune communication (transparent pour les utilisateurs)

### Pendant Migration

**Communication Interne**
- [ ] Mises à jour quotidiennes
- [ ] Alertes automatiques
- [ ] Standups quotidiens
- [ ] Retro après chaque phase

**Communication Externe**
- [ ] Aucune communication (transparent pour les utilisateurs)

### Après Migration

**Communication Interne**
- [ ] Post-mortem
- [ ] Leçons apprises
- [ ] Documentation mise à jour

**Communication Externe**
- [ ] Aucune communication (transparent pour les utilisateurs)

---

## Timeline

| Phase | Durée | Début | Fin |
|-------|-------|-------|-----|
| Phase 1 : Préparation | 2 semaines | Semaine 1 | Semaine 2 |
| Phase 2 : Canary | 2 semaines | Semaine 3 | Semaine 4 |
| Phase 3 : Rollout | 4 semaines | Semaine 5 | Semaine 8 |
| Phase 4 : Nettoyage | 1 semaine | Semaine 9 | Semaine 9 |
| **Total** | **9 semaines** | Semaine 1 | Semaine 9 |

---

## Checklist

### Avant Migration

- [ ] Infrastructure prête
- [ ] Data migration testée
- [ ] Tests E2E passent
- [ ] Feature flags configurés
- [ ] Monitoring en place
- [ ] Alertes configurées
- [ ] Runbook de rollback validé
- [ ] Équipe formée
- [ ] Communication interne faite

### Pendant Migration

- [ ] Canary activé (1%)
- [ ] Monitoring 24/7
- [ ] Métriques dans les limites
- [ ] Aucun bug critique
- [ ] Rollout progressif (5%, 10%, 25%, 50%, 100%)
- [ ] Monitoring continu
- [ ] Communication interne continue

### Après Migration

- [ ] 100% des utilisateurs sur V2
- [ ] Aucune régression
- [ ] Performance stable
- [ ] Code V1 supprimé
- [ ] Documentation à jour
- [ ] Post-mortem fait
- [ ] Leçons apprises documentées

---

## Conclusion

Ce plan de migration zéro interruption garantit :

1. **Zero downtime** : Déploiement progressif avec feature flags
2. **Rollback immédiat** : < 5 minutes pour revenir à V1
3. **Tests complets** : E2E, performance, charge, rollback
4. **Monitoring continu** : Métriques, alertes, dashboards
5. **Chaos engineering** : Scenarios de panne testés
6. **Communication proactive** : Interne et externe
7. **Documentation complète** : Runbooks, post-mortem, leçons apprises

La migration est **risque maîtrisé** avec des points de contrôle à chaque étape.
