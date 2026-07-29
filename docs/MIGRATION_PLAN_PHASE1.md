# Phase 1 - Plan de Migration Sans Régression

## Objectif

Migrer vers l'architecture V2 sans interrompre le service existant, sans régression, et avec un basculement transparent.

---

## Principes Fondamentaux

### 1. Ne PAS toucher à l'existant

**Composants figés (aucune modification)**
- ✅ Frontend (Next.js)
- ✅ Gateway (Fastify + WebSocket)
- ✅ WebSocket protocol
- ✅ JWT verification
- ✅ Session management
- ✅ Replay UI
- ✅ Supabase (schéma existant)
- ✅ Redis (structure existante)

### 2. Remplacer uniquement le cerveau

**Architecture avant**

```
Frontend → Gateway → Runtime Vocal → OpenAI
```

**Architecture après**

```
Frontend → Gateway → Interview Orchestrator → OpenAI Realtime
```

**Le Frontend ne voit AUCUNE différence**

### 3. Coexistence V1 + V2

Pendant la migration, les deux versions coexistent :
- V1 : Runtime vocal actuel (dans Gateway)
- V2 : Interview Orchestrator (NestJS)

Un feature flag permet de basculer :
- `USE_V2_ORCHESTRATOR=false` → V1 (par défaut)
- `USE_V2_ORCHESTRATOR=true` → V2

---

## Stratégie de Migration

### Étape 1 : Création de l'Interview Orchestrator (NestJS)

**Nouveau service** : `apps/interview-orchestrator`

**Responsabilités**
- Coordination des moteurs
- Communication avec Gateway via Event Bus
- Logique métier complète

**Indépendance**
- Aucune dépendance directe avec Gateway
- Communication uniquement via Event Bus (Redis)
- Peut être déployé indépendamment

### Étape 2 : Création de l'Event Bus (Redis Streams + BullMQ)

**Nouveau composant** : `infrastructure/event-bus`

**Fonctionnalités**
- Redis Streams pour événements temps réel
- BullMQ pour jobs asynchrones
- Event Sourcing pour replay

**Événements principaux**

```typescript
// Session events
SessionCreated
SessionInitialized
SessionStarted
SessionCompleted

// Turn events
TurnStarted
TranscriptReceived
SpeechAnalyzed
MemoryUpdated
EvaluationUpdated
DecisionMade
TurnCompleted

// Stage events
StageStarted
StageCompleted
StageTransitionRequested
```

### Étape 3 : Adaptateur Gateway → Orchestrator

**Nouveau fichier** : `apps/realtime-gateway/src/orchestrator-adapter.ts`

**Responsabilités**
- Convertir les messages Gateway en événements Event Bus
- Convertir les événements Event Bus en messages Gateway
- Feature flag pour basculer V1/V2

**Implémentation**

```typescript
class OrchestratorAdapter {
  private useV2: boolean = envServer.USE_V2_ORCHESTRATOR === 'true';

  async handleTranscript(sessionId: string, transcript: string) {
    if (this.useV2) {
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

### Étape 4 : Feature Flag

**Variable d'environnement**

```bash
# .env
USE_V2_ORCHESTRATOR=false  # Désactivé par défaut
```

**Activation progressive**

1. **Phase test** : `USE_V2_ORCHESTRATOR=false` pour 100% des utilisateurs
2. **Phase canary** : `USE_V2_ORCHESTRATOR=true` pour 1% des utilisateurs (basé sur userId)
3. **Phase rollout** : Augmentation progressive (5%, 10%, 25%, 50%, 100%)
4. **Phase rollback** : Si problème, retour immédiat à `false`

### Étape 5 : Monitoring & Observabilité

**Nouvelles métriques**

```typescript
// Gateway
- v2_orchestrator_requests_total
- v2_orchestrator_requests_success
- v2_orchestrator_requests_failed
- v2_orchestrator_latency_seconds

// Orchestrator
- director_decisions_total
- director_decisions_by_action
- memory_updates_total
- evaluation_updates_total
- event_bus_publish_latency
- event_bus_consume_latency
```

**Alertes**

- Taux d'erreur V2 > 1%
- Latence V2 > 2x latence V1
- Event Bus backlog > 1000 messages

---

## Plan Détaillé par Phase

### Phase 1.1 : Infrastructure (2 semaines)

**Objectif** : Créer l'infrastructure commune

**Tâches**
1. ✅ Créer `apps/interview-orchestrator` (NestJS)
2. ✅ Créer `infrastructure/event-bus` (Redis Streams + BullMQ)
3. ✅ Créer `libs/domain` (Domain pur)
4. ✅ Configurer Redis pour Event Bus
5. ✅ Configurer BullMQ pour jobs
6. ✅ Tests d'intégration Event Bus

**Livrables**
- Event Bus fonctionnel
- NestJS scaffold
- Domain libraries

### Phase 1.2 : Moteurs V2 (4 semaines)

**Objectif** : Implémenter les moteurs de l'Orchestrator

**Tâches**
1. ✅ Interview Planner + FSM
2. ✅ Conversation Director
3. ✅ Persona Engine
4. ✅ Memory Engine structurée
5. ✅ Evaluation Engine continu
6. ✅ Speech Analyzer
7. ✅ Contradiction Detector
8. ✅ STAR Detector
9. ✅ Difficulty Engine
10. ✅ Prompt Orchestrator
11. ✅ Context Builder
12. ✅ AI Guard

**Livrables**
- Tous les moteurs implémentés
- Tests unitaires > 80%
- Tests d'intégration

### Phase 1.3 : Adaptateur Gateway (1 semaine)

**Objectif** : Connecter Gateway à l'Orchestrator

**Tâches**
1. ✅ Créer `orchestrator-adapter.ts`
2. ✅ Implémenter feature flag
3. ✅ Convertir messages Gateway ↔ Event Bus
4. ✅ Tests d'intégration Gateway ↔ Orchestrator
5. ✅ Monitoring V2

**Livrables**
- Adaptateur fonctionnel
- Feature flag opérationnel
- Monitoring en place

### Phase 1.4 : Tests E2E (1 semaine)

**Objectif** : Valider le flux complet

**Tâches**
1. ✅ Tests E2E V2 (sans feature flag)
2. ✅ Tests E2E V1 (régression)
3. ✅ Tests de performance (latence V1 vs V2)
4. ✅ Tests de charge (100 sessions simultanées)
5. ✅ Tests de rollback (V2 → V1)

**Livrables**
- Suite de tests E2E
- Rapport de performance
- Procédure de rollback

### Phase 1.5 : Canary (2 semaines)

**Objectif** : Déploiement progressif

**Tâches**
1. ✅ Déployer V2 en production (feature flag off)
2. ✅ Activer V2 pour 1% des utilisateurs
3. ✅ Monitoring intensif (24/7)
4. ✅ Analyse des métriques
5. ✅ Ajustements si nécessaires

**Critères de succès**
- Taux d'erreur < 0.5%
- Latence < 2x V1
- Aucun bug critique

### Phase 1.6 : Rollout (2 semaines)

**Objectif** : Déploiement complet

**Tâches**
1. ✅ 5% → 10% → 25% → 50% → 100%
2. ✅ Monitoring continu
3. ✅ Communication utilisateurs
4. ✅ Documentation mise à jour

**Critères de succès**
- 100% des utilisateurs sur V2
- Aucune régression détectée
- Performance stable

### Phase 1.7 : Nettoyage (1 semaine)

**Objectif** : Supprimer V1

**Tâches**
1. ✅ Supprimer le Runtime vocal V1
2. ✅ Supprimer le feature flag
3. ✅ Nettoyer le code
4. ✅ Mettre à jour la documentation

**Livrables**
- Code V1 supprimé
- Documentation à jour

---

## Stratégie de Rollback

### Condition de rollback immédiat

- Taux d'erreur > 5%
- Latence > 5x V1
- Bug critique (crash, data loss)
- Event Bus down

### Procédure de rollback

1. **Feature flag** : `USE_V2_ORCHESTRATOR=false`
2. **Redéploiement** : Push de la config
3. **Vérification** : Monitoring V1
4. **Communication** : Notification équipe

**Temps de rollback** : < 5 minutes

---

## Tests de Régression

### Tests automatisés

```typescript
// Test : V1 vs V2 comportement identique
describe('Migration V1 → V2', () => {
  it('should produce same questions for same input', async () => {
    const input = {
      profile: candidateProfile,
      persona: 'neutral',
      transcript: 'Je suis développeur senior...',
    };

    const v1Result = await nextV2Step(input); // V1 actuel
    const v2Result = await orchestrator.processTurn(input); // V2

    // Vérifier que les résultats sont cohérents
    expect(v2Result.question).toBeDefined();
    expect(v2Result.updatedState.phase).toBe(v1Result.phase);
  });
});
```

### Tests manuels

- [ ] Session complète V1
- [ ] Session complète V2
- [ ] Replay V1
- [ ] Replay V2
- [ ] Interruption V1
- [ ] Interruption V2
- [ ] Victor Mode V1
- [ ] Victor Mode V2

---

## Risques et Mitigations

### Risque 1 : Latence V2 > V1

**Mitigation**
- Optimiser l'Event Bus
- Cache les décisions fréquentes
- Monitoring temps réel
- Rollback immédiat si > 2x

### Risque 2 : Event Bus down

**Mitigation**
- Redis cluster (HA)
- Fallback vers V1
- Alertes automatiques
- Runbook de récupération

### Risque 3 : Incohérence V1/V2

**Mitigation**
- Tests E2E complets
- Canary progressive
- Monitoring comportement
- Rollback immédiat

### Risque 4 : Data loss pendant migration

**Mitigation**
- Backup avant migration
- Event Sourcing (reconstitution possible)
- Tests de récupération
- Procédure d'urgence

---

## Timeline

| Phase | Durée | Début | Fin |
|-------|-------|-------|-----|
| 1.1 Infrastructure | 2 semaines | Semaine 1 | Semaine 2 |
| 1.2 Moteurs V2 | 4 semaines | Semaine 3 | Semaine 6 |
| 1.3 Adaptateur Gateway | 1 semaine | Semaine 7 | Semaine 7 |
| 1.4 Tests E2E | 1 semaine | Semaine 8 | Semaine 8 |
| 1.5 Canary | 2 semaines | Semaine 9 | Semaine 10 |
| 1.6 Rollout | 2 semaines | Semaine 11 | Semaine 12 |
| 1.7 Nettoyage | 1 semaine | Semaine 13 | Semaine 13 |

**Total** : 13 semaines (~3 mois)

---

## Checklist de Validation

### Avant migration

- [ ] Tests unitaires > 80%
- [ ] Tests d'intégration > 70%
- [ ] Tests E2E passent
- [ ] Performance V2 ≤ 2x V1
- [ ] Event Bus HA configuré
- [ ] Monitoring en place
- [ ] Alertes configurées
- [ ] Documentation à jour
- [ ] Runbook de rollback
- [ ] Équipe formée

### Pendant canary

- [ ] Taux d'erreur < 0.5%
- [ ] Latence < 2x V1
- [ ] Aucun bug critique
- [ ] Utilisateurs satisfaits
- [ ] Replay fonctionnel
- [ ] Victor Mode fonctionnel

### Après rollout

- [ ] 100% utilisateurs sur V2
- [ ] Aucune régression
- [ ] Performance stable
- [ ] Monitoring normal
- [ ] Documentation finale
- [ ] Code V1 supprimé

---

## Conclusion

Ce plan de migration garantit :

1. **Zéro interruption** : Coexistence V1/V2 avec feature flag
2. **Rollback immédiat** : < 5 minutes pour revenir à V1
3. **Tests complets** : Unitaires, intégration, E2E, performance
4. **Déploiement progressif** : Canary → rollout
5. **Monitoring continu** : Métriques, alertes, dashboards

La migration est **risque maîtrisé** avec des points de contrôle à chaque étape.
