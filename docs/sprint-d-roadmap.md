# Sprint D - Intelligence Roadmap

## Architecture Cognitive

Le Sprint D suit une architecture cognitive structurée pour créer de la valeur utilisateur directe.

---

## D1 - Identity Intelligence

**Objectif**: Construire un graphe identitaire stable

**Structure**:
```
Candidate
├── Person
├── Companies
├── Projects
├── Technologies
├── Roles
├── Skills
├── Metrics
├── Dates
└── Relations
```

**Sortie**: Graphe identitaire stable et cohérent

---

## D2 - Hypothesis Engine

**Objectif**: Produire des hypothèses, jamais des certitudes

**Structure**:
```
Hypothesis
├── statement: "Candidate maîtrise Kubernetes"
├── supportingEvidence:
│   ├── Observation A
│   ├── Observation B
│   └── Metric C
├── confidence: 0.82
└── missingEvidence:
    ├── production scale
    └── ownership
```

**Importance**: Moteur le plus important de la plateforme

---

## D3 - Decision Engine

**Objectif**: Prendre des décisions basées sur les hypothèses

**Entrées**:
- Hypotheses
- Evidence
- Confidence
- Contradictions

**Sorties**:
- Accepted
- Rejected
- Pending
- NeedMoreEvidence

**Contrainte**: Ne jamais lire directement le texte

---

## D4 - Interview Planner

**Objectif**: Décider quelle information manque

**Entrées**:
- Hypotheses
- Missing Evidence
- Contradictions

**Sortie**: Quelle information manque (pas quelle question poser)

**Note**: Très important de séparer "manque information" de "quelle question"

---

## D5 - Question Selection

**Objectif**: Transformer "Need evidence X" en "Question Y"

**Mécanisme**: Utilisation de policies

**Entrée**: Need evidence X
**Sortie**: Question Y

---

## D6 - Explainability

**Objectif**: Rendre chaque décision explicable

**Chaîne d'explicabilité**:
```
Pourquoi ?
↓
Hypothesis 17
↓
Evidence 41
↓
Observation 8
↓
Phrase CV
↓
Prompt
↓
Model
↓
Event
```

**Importance**: Avantage majeur pour le débogage et la confiance des utilisateurs

**Priorité**: À monter très tôt

---

## D7 - Growth Engine

**Objectif**: [À définir]

**Priorité**: En dernier, quand tout le raisonnement fonctionne

---

## Éléments de Qualité et Exploitation (v1.0 publique)

### Property-based Testing
- Vérifier des invariants sur de nombreux cas générés automatiquement

### Stress Tests
- Exécutions longues
- Nombreuses sessions
- Volumes élevés

### Replay Inter-Version
- Vérifier compatibilité entre versions du runtime
- Détection propre des incompatibilités

### Benchmarks
- Temps par moteur
- Coût LLM
- Consommation mémoire
- Throughput

**Note**: Ce sont des travaux de qualité et d'exploitation, pas des fondations.

---

## Ordre d'Exécution

1. D1 - Identity Intelligence
2. D2 - Hypothesis Engine (moteur le plus important)
3. D3 - Decision Engine
4. D4 - Interview Planner
5. D5 - Question Selection
6. D6 - Explainability (à monter très tôt)
7. D7 - Growth Engine (en dernier)

---

## Base Solide

Le runtime IOS v3 a atteint un bon niveau de maturité :
- ✅ Runtime déterministe
- ✅ Event sourcing
- ✅ Ledgers
- ✅ Registries
- ✅ Container DI
- ✅ Pipeline validation
- ✅ Golden replay
- ✅ Snapshot hashing
- ✅ Prompt versioning
- ✅ Catalogs data-driven

Cette base est suffisamment solide pour créer directement de la valeur utilisateur.
