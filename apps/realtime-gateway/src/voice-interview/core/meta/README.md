# Meta-Brain Integration Guide

## Overview

Le module `meta/` implémente le cerveau multi-moteur qui orchestre les décisions d'entretien en fusionnant les signaux de V1/V2/V3 et en utilisant des prompts LLM pour l'évaluation unifiée, la décision méta et la génération de questions.

## Architecture

```
transcript → V1/V2/V3 (évaluation parallèle)
         → UNIFIED_EVALUATION_ENGINE (fusion signaux)
         → META_DECISION_ENGINE (stratégie globale)
         → MULTI_ENGINE_QUESTION_GENERATOR (question générée)
         → RecruiterMind (mise à jour état mental)
         → Transport (WebSocket)
```

## Structure du Module

```
meta/
├── types.ts                      # Interfaces TypeScript pour les sorties LLM
├── loadPrompt.ts                 # Utilitaire pour charger les prompts depuis docs/
├── unified-evaluation.ts         # Moteur d'évaluation unifié
├── meta-decision.ts              # Moteur de décision méta
├── multi-engine-question.ts      # Générateur de questions multi-moteur
├── index.ts                      # Export de tous les modules
└── README.md                     # Ce fichier
```

## Modes d'Intégration

Le meta-brain supporte trois modes d'intégration progressifs :

### Palier 1 : Mode Shadow (Observation)

Le meta-brain tourne en parallèle sans piloter les questions. Utile pour observer les décisions et valider la cohérence.

**Activation :** `USE_META_BRAIN` non défini ou `false`

**Comportement :**
- Le meta-brain exécute les 3 étapes (évaluation, décision, génération)
- Les décisions sont loggées sous `meta_brain_shadow`
- V3 continue d'utiliser sa logique actuelle (adaptive-controller)
- Zéro impact sur le flux existant

### Palier 2 : Mode Pilotage (Production)

Le meta-brain pilote réellement les questions. Activé après validation en mode shadow.

**Activation :** `USE_META_BRAIN=true`

**Comportement :**
- Le meta-brain exécute les 3 étapes (évaluation, décision, génération)
- `state.phase` et `state.pressureLevel` sont mis à jour avec les cibles méta
- La question générée remplace celle de l'adaptive-controller
- Les décisions sont loggées sous `meta_brain_pilot`
- Fallback automatique sur V3 en cas d'erreur

### Palier 3 : Signaux V1/V2 Rudimentaires

Pour lier les 3 cerveaux, les signaux V1 et V2 sont progressivement injectés dans l'évaluation unifiée.

**Implémentation :**
- `extractLegacySignalsRudimentary()` mappe les signaux V3 vers V1/V2
- v1_signals : score (0-100) + decision_hint (probe/deepen/move-on)
- v2_signals : specificity, ownership, technical_depth (0-10)
- Mapping progressif sans casser le flux existant

**Enrichissement futur :**
- Remplacer le mapping rudimentaire par des appels réels aux moteurs V1/V2
- Utiliser `extractV1Signals()` et `extractV2Signals()` quand les états sont disponibles

## Utilisation

### 1. Évaluation Unifiée

```typescript
import { runUnifiedEvaluation } from "./meta/index.js";

const unified = await runUnifiedEvaluation({
  candidate_answer: "Réponse du candidat...",
  v1_signals: {
    score: 72,
    decision_hint: "deepen"
  },
  v2_signals: {
    specificity: 6,
    ownership: 7,
    technical_depth: 5
  },
  v3_signals: {
    bluff_score: 4,
    vagueness_level: 5,
    integrity_risk_index: 6.5,
    leadership_signal: 7
  },
  recruiter_mind_snapshot: {
    trust: 6,
    suspicion: 3,
    engagement: 7,
    pressure_level: 3,
    fatigue: 2
  }
});
```

### 2. Décision Méta

```typescript
import { runMetaDecision } from "./meta/index.js";

const metaDecision = await runMetaDecision({
  unified_signals: unified,
  recruiter_mind_snapshot: {
    trust: 6,
    suspicion: 3,
    engagement: 7,
    pressure_level: 3,
    fatigue: 2,
    confidence: 0.5,
    momentum: 0.3
  },
  interview_state: {
    current_phase: "tech",
    turn_count: 4,
    current_pressure_level: 3,
    profile_level: "senior",
    max_turns: 8
  }
});
```

### 3. Génération de Question

```typescript
import { runMultiEngineQuestionGenerator } from "./meta/index.js";

const question = await runMultiEngineQuestionGenerator({
  job_context: {
    job_title: "Senior Backend Engineer",
    job_requirements: ["Node.js", "scalability", "API design"]
  },
  candidate_profile: {
    cv_summary: "Résumé du parcours...",
    key_strengths: ["Node.js", "API design"],
    key_gaps: ["people management"]
  },
  interview_state: {
    current_phase: metaDecision.meta_decision.target_phase,
    current_pressure_level: metaDecision.meta_decision.target_pressure_level,
    profile_level: "senior",
    turn_count: 4,
    max_turns: 8
  },
  meta_decision: metaDecision.meta_decision,
  engine_routing: metaDecision.engine_routing,
  unified_signals: unified,
  candidate_recent_answers: [
    {
      question: "Question précédente...",
      answer: "Réponse précédente...",
      timestamp: "2025-03-10T10:15:00Z"
    }
  ]
});
```

## Intégration dans V3

L'intégration est déjà implémentée dans `interview-engine-v3.ts` avec les deux modes.

### Variables d'environnement

```bash
# Mode shadow (observation) - défaut
USE_META_BRAIN=false

# Mode pilotage (production)
USE_META_BRAIN=true
```

### Mapping des Phases

**V3 → Meta :**
- Phase1 → "hr"
- Phase2 → "tech"
- Phase3 → "pressure"
- Phase4 → "leadership"

**Meta → V3 :**
- "hr" → Phase1
- "tech" → Phase2
- "pressure" → Phase3
- "leadership" → Phase4
- "wrap" → Phase4

### Logs

**Mode Shadow :**
```json
{
  "meta_brain_shadow": {
    "turn": 4,
    "phase": "Phase2",
    "unified": { ... },
    "metaDecision": { ... },
    "metaQuestion": {
      "question_text": "...",
      "interviewer_role": "tech",
      "tone": "neutral",
      "primary_goal": "probe_technical_depth"
    }
  }
}
```

**Mode Pilotage :**
```json
{
  "meta_brain_pilot": {
    "turn": 4,
    "phase": "Phase2",
    "pressureLevel": 3,
    "unified": { ... },
    "metaDecision": { ... },
    "metaQuestion": {
      "question_text": "...",
      "interviewer_role": "tech",
      "tone": "neutral",
      "primary_goal": "probe_technical_depth"
    }
  }
}
```

## Configuration Requise

### Variables d'environnement

```
OPENAI_API_KEY=your_openai_api_key
USE_META_BRAIN=false  # ou true pour le mode pilotage
```

### Dépendances

```json
{
  "openai": "^4.x",
  "zod": "^3.x"
}
```

## Notes d'Intégration

1. **Intégration Progressive** : Commencer par le mode shadow, observer les logs, puis passer en mode pilotage
2. **Fallback** : En cas d'erreur du meta-brain, le système fallback automatiquement sur la logique V3 existante
3. **Performance** : Les 3 appels LLM sont séquentiels, envisager le parallélisme si nécessaire
4. **Coût** : Chaque tour consomme ~3 appels LLM (gpt-4o-mini), surveiller les coûts
5. **Latence** : Ajout de ~2-3 secondes par tour pour les appels LLM meta
6. **V1/V2 Signals** : Pour l'instant seuls les signaux V3 sont utilisés, v1/v2 à enrichir plus tard

## Prochaines Étapes

- [ ] Intégrer V1/V2 signals dans l'évaluation unifiée
- [ ] Dériver RecruiterMind depuis l'état V3 de manière plus sophistiquée
- [ ] Optimiser la latence (parallélisme, caching)
- [ ] Ajouter des tests unitaires pour chaque module meta
- [ ] Étendre l'intégration à V1 et V2
