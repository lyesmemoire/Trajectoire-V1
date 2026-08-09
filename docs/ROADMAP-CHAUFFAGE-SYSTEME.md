# Roadmap - Chauffage du système

Ce document guide les étapes pour "chauffer" le système d'entretien avec la base de questions et le meta-brain.

## État actuel

✅ **Fondations en place :**
- Meta-brain implémenté (évaluation unifiée, décision méta, générateur multi-moteur)
- Base de questions structurée (question-model + question-db)
- Pont LLM/déterministe dans multi-engine-question
- Script d'extraction offline prêt
- Prompt d'extraction des docs RH prêt

## Chantier 1 : Remplir massivement la base de questions

### 1.1 Script d'extraction offline ✅

**Fichier :** `scripts/extract-questions-from-doc.ts`

**Prérequis :**
```bash
npm install openai dotenv
```

**Configuration :**
```env
# .env à la racine
OPENAI_API_KEY=your_openai_api_key
```

**Lancement :**
```bash
npx tsx scripts/extract-questions-from-doc.ts
```

**Comportement :**
- Charge les questions existantes
- Traite 5 docs RH par défaut
- Fusionne et déduplique par ID
- Sauvegarde dans `question-db/questions.fr.json`

### 1.2 Contrôle qualité minimal (à faire)

**Vérification rapide :**
- Rôle/tone/phase cohérents
- Difficulty raisonnable (1-5)
- Target_profile crédible
- Tags pertinents
- Triggers appropriés

**Tests d'entretien :**
- Questions trop vagues ?
- Doublons évidents ?
- Questions inadaptées au profil ?

**Itération recommandée :**
1. Lancer sur 3-5 docs
2. Relire le JSON produit
3. Corriger à la main si nécessaire
4. Élargir progressivement

## Chantier 2 : Brancher le meta-brain sur V3

### 2.1 Activer le shadow mode

**Configuration :**
```bash
# Mode shadow (observation) - défaut
USE_META_BRAIN=false

# Ou laisser non défini (comportement par défaut)
```

**Comportement :**
- Meta-brain exécute les 3 étapes (évaluation, décision, génération)
- Logs sous `meta_brain_shadow`
- V3 continue d'utiliser adaptive-controller
- Zéro impact sur le flux existant

**Logs à observer :**
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

### 2.2 Analyser les logs

**Critères de validation :**
- Les décisions méta ressemblent-elles à ce qu'un humain ferait ?
- Les questions générées sont-elles pertinentes ?
- Le mapping phase/pressure est-il cohérent ?
- Les signaux unifiés sont-ils raisonnables ?

**Durée recommandée :** 5-10 entretiens internes

### 2.3 Passer au pilotage réel

**Si les logs sont cohérents :**
```bash
USE_META_BRAIN=true
```

**Comportement :**
- Meta-brain pilote réellement les questions
- `state.phase` et `state.pressureLevel` mis à jour avec les cibles méta
- Question générée remplace adaptive-controller
- Logs sous `meta_brain_pilot`
- Fallback automatique sur V3 en cas d'erreur

**Recommandation :** Garder V3 en opt-in (`?engine=v3`) pendant cette phase

## Chantier 3 : Faire monter la température progressivement

### 3.1 Augmenter la part de questions de la base

**Stratégie par profil :**
- **Junior/Senior** : Privilégier la base déterministe
- **Executive** : Laisser plus de place aux questions LLM

**Modification de `meta-decision.ts` :**
```typescript
// Dans runMetaDecision, ajuster engine_routing selon le profil
if (profile_level === "junior" || profile_level === "senior") {
  engine_routing.use_llm_question = false; // base déterministe
} else if (profile_level === "executive") {
  engine_routing.use_llm_question = true; // LLM pour style personnalisé
}
```

### 3.2 Alimenter v1_signals et v2_signals

**État actuel :** Rudimentaire (mapping depuis V3)

**Enrichissement progressif :**
- Remplacer le mapping par des appels réels aux moteurs V1/V2
- Utiliser `extractV1Signals()` et `extractV2Signals()` quand les états sont disponibles
- Ajouter plus de signaux spécifiques à chaque moteur

### 3.3 Logger tout en JSON

**Objectifs de calibration :**
- Quelles questions reviennent le plus ?
- Quelles decisions "escalate_pressure" / "wrap_up" sont pertinentes ?
- Quelles zones (tech/behav/leadership) sont sous-couvertes ?

**Logs existants :**
- `meta_brain_shadow` / `meta_brain_pilot`
- `unified` (signaux unifiés)
- `metaDecision` (décision méta)
- `metaQuestion` (question générée)

**Analyse :** Exporter les logs en JSON et analyser avec des outils de data

## Prochaines étapes immédiates

1. **Lancer le script d'extraction** sur 3-5 docs RH
2. **Contrôle qualité** des questions extraites
3. **Activer shadow mode** sur V3 pour 5-10 entretiens
4. **Analyser les logs** et valider la cohérence
5. **Passer au pilotage réel** si validé

## Documents de référence

- `scripts/extract-questions-from-doc.ts` - Script d'extraction
- `scripts/README.md` - Documentation du script
- `docs/PROMPT-QUESTION-EXTRACTION.md` - Prompt pour extraction
- `apps/realtime-gateway/src/voice-interview/core/meta/README.md` - Meta-brain integration guide
- `apps/realtime-gateway/src/voice-interview/core/question-db/` - Base de questions
