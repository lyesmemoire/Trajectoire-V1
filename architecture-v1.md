# Architecture v1 — Certified Decision System

## 1. Vision globale

Le système est un pipeline déterministe en 5 couches :

```
P4 → P5 → P6 → INFRA → P7 → P7.5
```

Chaque couche est :
- isolée
- testable indépendamment
- sans fuite de dépendances ascendantes
- sans I/O dans le core

---

## 2. Couche P4 — Governance Plane

### Rôle
Décider **quoi exécuter**

### Responsabilités
- policies métier
- validation des intentions
- génération de RuntimeDecision

### Interdictions
- pas d'état runtime
- pas d'exécution
- pas de connaissance P6+

---

## 3. Couche P5 — Execution Plane

### Rôle
Exécuter un système **purement fonctionnel**

### Propriétés
- reduceMind(state, event)
- déterminisme strict
- immutabilité totale

### Sorties
- MindState
- Journal
- Timeline

---

## 4. Couche P6 — Runtime Plane

### Rôle
Orchestration déterministe

### Sous-systèmes
- SessionRuntimeAdapter
- ExecutionFacade
- Lifecycle Engine
- Transaction system
- Voice Binding (P6.2)
- Transport Layer (P6.3)

### Propriétés
- zéro I/O direct
- orchestration uniquement
- composition de P5

---

## 5. INFRA — Observability Layer

### Rôle
Capture sans influence

### Composants
- RuntimeTrace Collector
- Session Registry
- Event Wire Capture

### Propriété critique
> zéro impact sur le comportement du core

---

## 6. P7 — Evaluation Layer

### Rôle
Analyse offline des traces

### Pipeline
```
Trace → Signals → Evidence → Score → Ranking
```

### Propriétés
- déterminisme total
- aucun accès runtime actif
- aucune mutation du système P5/P6

---

## 7. P7.5 — Report Generator

### Rôle
Compilation finale des résultats

### Sorties
- JSON (machine)
- PDF (humain)
- AuditPack (forensic)

---

## 8. Invariants globaux

### S1 — Deterministic Closure
Même input → même output

### S2 — Layer Isolation
Aucune dépendance ascendante

### S3 — No IO in Core
P4 → P7.5 = pure logic

### S4 — Replayability
P5 + Journal = reconstruction totale

### S5 — Observability without influence
INFRA ne modifie jamais le core

---

## 9. Architecture Graph

```
[P4]
↓
[P5]
↓
[P6]
↓
[INFRA]
↓
[P7]
↓
[P7.5]
```

---

## 10. Version

```text
architecture-v1 (LOCKED CANDIDATE)
```
