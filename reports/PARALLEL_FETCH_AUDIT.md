# Parallel Fetch Audit

## Fetch Sequentiels Identifies
Dans le Dashboard, les appels aux moteurs de generation (DigitalTwin, Forecast, Scenario, Autonomous, Outcome, etc.) ne dependent pas les uns des autres (ils consomment tous le `CandidateGraph` deja charge). Ils sont neanmoins exécutes l'un après l'autre.

## Solution Proposee (Avant vs Apres)

**Avant** :
```typescript
const a = await EngineA();
const b = await EngineB();
const c = await EngineC();
```

**Apres (Quick Win)** :
```typescript
const [a, b, c] = await Promise.all([
  EngineA(),
  EngineB(),
  EngineC()
]);
```

*Cout actuel* : Addition des temps de reponse (ex: 100ms + 150ms + 200ms = 450ms).
*Gain attendu* : Temps de reponse egal au plus lent (ex: max(100, 150, 200) = 200ms).
*Niveau de Confiance* : 100%
