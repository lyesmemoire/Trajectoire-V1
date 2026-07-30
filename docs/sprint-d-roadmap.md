# Sprint D - Intelligence Roadmap

## Architecture Cognitive

Le Sprint D suit une architecture cognitive structurée pour créer de la valeur utilisateur directe.

---

## D0 - Knowledge Graph Foundation ⭐⭐⭐⭐⭐

**Objectif**: Infrastructure commune pour tous les moteurs

**Composants**:
```
Node
Edge
Relation
EntityId
CanonicalId
MergePolicy
GraphRepository
GraphQueryService
```

**Importance**: Socle commun - tous les moteurs écriront dedans

**Avantage**: Identity, Hypothesis, Decision, Interview n'auront jamais à recréer leur propre représentation

---

## D1 - Identity Graph

**Objectif**: Normalisation canonique (pas d'intelligence, pas de déduction)

**Exemple**:
```
Au lieu de:
"K8S"
"Kubernetes"
"Kube"

On obtient:
Technology
  id: kubernetes
  aliases:
  - k8s
  - kube
```

**Types normalisés**:
- Technology
- Entreprise
- Projet
- Equipe
- Mission
- Client
- Produit
- Personne
- Date
- Metric

**Sortie**: Graphe canonique stable

**Note**: Ce moteur ne fait aucune déduction, seulement de la normalisation

---

## D2 - Hypothesis Engine ⭐⭐⭐⭐⭐

**Objectif**: Moteur de raisonnement principal - le véritable cerveau d'IOS v3

**Structure**:
```
HypothesisLedger
├── id
├── statement
├── supportingEvidence
├── contradictingEvidence
├── missingEvidence
├── confidence
└── state
```

**States possibles**:
- Candidate
- Supported
- Weak
- Rejected
- Confirmed

**Importance**: Toutes les futures décisions lisent uniquement ce ledger

**Note**: Dans IOS v3, le cerveau est HypothesisEngine (pas Evidence, pas Decision, pas Interview)

---

## D3 - Decision Engine

**Objectif**: Prendre des décisions basées uniquement sur les artefacts structurés

**Entrées** (uniquement):
- Hypothesis
- Evidence
- Confidence
- Contradiction

**NE JAMAIS**:
- Texte
- CV
- Transcription
- Prompt
- Observations

**Sorties**:
- Accepted
- Rejected
- Pending
- NeedMoreEvidence

**Note**: DecisionEngine ignore complètement comment les hypothèses ont été produites

---

## D4 - Interview Planner

**Objectif**: Décider quelle information manque (pas quelle question poser)

**Entrées**:
- Hypotheses
- Missing Evidence
- Contradictions

**Sorties**:
```
NeedEvidence
├── Hypothesis: "Senior Kubernetes Engineer"
├── Need: "production scale metric"
└── Reason: "confidence too low"
```

ou

```
NeedConfirmation
├── Hypothesis: "..."
└── Need: "..."
```

**Note**: Jamais de production de questions

---

## D5 - Question Selection

**Objectif**: Transformer "Need evidence" en "Question" via policies

**Entrée**: NeedEvidence X
**Sortie**: Question Y

**Exemples**:
```
"Vous avez parlé de Kubernetes. Pouvez-vous me donner un exemple de production ?"
"Combien de clusters ?"
"Quelle volumétrie ?"
```

**Note**: Toutes les variantes sont dans les Policies

---

## D6 - Explainability / Reasoning Graph

**Objectif**: Composant majeur - rendre chaque décision navigable

**Structure**:
```
ReasoningGraph
├── Decision
├── Hypothesis
├── Evidence
├── Observation
├── Phrase CV
├── Prompt
├── Model
└── Event
```

**Importance**: Différenciation majeure d'IOS v3

**Avantages**:
- Débogage
- Confiance des utilisateurs
- Navigation dans le raisonnement

---

## D7 - Growth Engine

**Objectif**: [À définir]

**Entrées**:
- Identity
- Hypothesis
- Decision
- Interview
- Confidence
- Timeline
- Contradictions

**Priorité**: En dernier, car dépend de tout

---

## Garde-fous avant D1

### Contrats immuables

**Hypothesis Schema**:
- statement
- supportingEvidence
- contradictingEvidence
- missingEvidence
- confidence
- state
- traceability

**Knowledge Graph**:
- Types de nœuds
- Types d'arêtes
- Règles de fusion (MergePolicy)
- Identifiants canoniques

**Decision Structure**:
- Résultat
- Justification
- Niveau de confiance
- Hypothèses utilisées

**NeedEvidence / NeedConfirmation**:
- Contrat unique entre InterviewPlanner et QuestionSelection

**Note**: Ces contrats éviteront que les moteurs D2 à D5 divergent au fil des itérations

---

## Ordre d'Exécution

1. **D0** - Knowledge Graph Foundation ⭐⭐⭐⭐⭐ (infrastructure commune)
2. **D1** - Identity Graph (normalisation canonique)
3. **D2** - Hypothesis Engine ⭐⭐⭐⭐⭐ (moteur de raisonnement principal)
4. **D3** - Decision Engine (décisions sur artefacts structurés)
5. **D4** - Interview Planner (décider manque information)
6. **D5** - Question Selection (transformer en questions)
7. **D6** - Explainability / Reasoning Graph (navigation dans raisonnement)
8. **D7** - Growth Engine (en dernier)

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

---

## Architecture Cognitive

Chaque couche ne consomme que les artefacts de la couche précédente :

```
Knowledge Graph Foundation
    ↓
Identity Graph
    ↓
Hypothesis Engine
    ↓
Decision Engine
    ↓
Interview Planner
    ↓
Question Selection
    ↓
Explainability / Reasoning Graph
    ↓
Growth Engine
```

Cette architecture devrait bien résister à l'ajout futur de nouveaux moteurs cognitifs sans remettre en cause les fondations.
