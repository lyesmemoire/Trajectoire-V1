# Token Budget

## Version

**Version** : 1.0.0  
**Date** : 2024-01-23  
**Auteur** : Distinguished Engineer  
**Statut** : Draft

---

## Objectif

Ce document définit le budget de tokens par composant pour l'architecture V2 basée sur OpenAI Realtime API, avec une règle stricte : jamais plus de 2500 tokens par tour.

---

## Budget par Composant

| Composant | Tokens (input) | Tokens (output) | Total | Justification |
|-----------|----------------|-----------------|-------|---------------|
| **System Prompt** | 600 | 0 | 600 | Instructions système pour l'IA |
| **Persona** | 120 | 0 | 120 | Définition de la persona de l'intervieweur |
| **Memory** | 350 | 0 | 350 | Mémoire du candidat (compétences, expériences) |
| **Evaluation** | 250 | 0 | 250 | Évaluations précédentes et feedback |
| **Planner** | 200 | 0 | 200 | Plan du tour courant (compétence, difficulté) |
| **ATS** | 180 | 0 | 180 | Analyse ATS du CV vs Job Description |
| **Career DNA** | 160 | 0 | 160 | Profil de carrière du candidat |
| **Context** | 300 | 0 | 300 | Contexte de conversation (historique récent) |
| **User Input** | 150 | 0 | 150 | Réponse du candidat (transcript) |
| **AI Response** | 0 | 500 | 500 | Réponse de l'IA (question, feedback) |
| **AI Guard** | 50 | 0 | 50 | Validation et correction (injection) |
| **Total** | **2310** | **500** | **2810** | **Dépasse le budget** |

---

## Budget Optimisé

| Composant | Tokens (input) | Tokens (output) | Total | Justification |
|-----------|----------------|-----------------|-------|---------------|
| **System Prompt** | 500 | 0 | 500 | Réduction de 100 tokens (instructions optimisées) |
| **Persona** | 100 | 0 | 100 | Réduction de 20 tokens (persona condensée) |
| **Memory** | 300 | 0 | 300 | Réduction de 50 tokens (mémoire filtrée) |
| **Evaluation** | 200 | 0 | 200 | Réduction de 50 tokens (évaluations récentes) |
| **Planner** | 150 | 0 | 150 | Réduction de 50 tokens (plan condensé) |
| **ATS** | 150 | 0 | 150 | Réduction de 30 tokens (ATS condensé) |
| **Career DNA** | 140 | 0 | 140 | Réduction de 20 tokens (DNA condensé) |
| **Context** | 250 | 0 | 250 | Réduction de 50 tokens (historique réduit) |
| **User Input** | 150 | 0 | 150 | Inchangé (réponse candidat) |
| **AI Response** | 0 | 400 | 400 | Réduction de 100 tokens (réponse concise) |
| **AI Guard** | 40 | 0 | 40 | Réduction de 10 tokens (validation optimisée) |
| **Total** | **1980** | **400** | **2380** | **Respecte le budget** |

---

## Règle de Budget

### Règle Principale

**Jamais plus de 2500 tokens par tour**

Cette règle s'applique à :
- Input tokens (prompt envoyé à OpenAI)
- Output tokens (réponse générée par OpenAI)
- Total (input + output)

### Exceptions

**Phase d'initialisation** (premier tour)
- Budget étendu à 3500 tokens
- Justification : Initialisation du contexte complet
- Une seule fois par session

**Phase d'évaluation** (tour final)
- Budget étendu à 3000 tokens
- Justification : Synthèse complète de l'entretien
- Une seule fois par session

---

## Stratégie de Compression

### Compression Dynamique

Si le budget est dépassé, le Context Builder applique une stratégie de compression dynamique :

1. **Priorité 1 (Conserver)**
   - System Prompt (500 tokens)
   - Persona (100 tokens)
   - User Input (150 tokens)

2. **Priorité 2 (Réduire)**
   - Memory : 300 → 200 tokens (garder les compétences les plus importantes)
   - Evaluation : 200 → 150 tokens (garder les évaluations récentes)
   - Context : 250 → 150 tokens (garder les 3 derniers tours)

3. **Priorité 3 (Supprimer)**
   - Planner : 150 → 100 tokens (condenser le plan)
   - ATS : 150 → 100 tokens (condenser l'ATS)
   - Career DNA : 140 → 100 tokens (condenser le DNA)

4. **Priorité 4 (Dernier recours)**
   - AI Guard : 40 → 20 tokens (validation minimale)
   - AI Response : 400 → 300 tokens (réponse très concise)

### Algorithme de Compression

```typescript
function compressContext(context: Context, budget: number): Context {
  const currentTokens = countTokens(context);
  
  if (currentTokens <= budget) {
    return context;
  }
  
  const excess = currentTokens - budget;
  
  // Priorité 1 : Réduire Memory
  if (context.memory.tokens > 200) {
    context.memory = compressMemory(context.memory, 200);
    excess -= (context.memory.tokens - 200);
  }
  
  // Priorité 2 : Réduire Evaluation
  if (excess > 0 && context.evaluation.tokens > 150) {
    context.evaluation = compressEvaluation(context.evaluation, 150);
    excess -= (context.evaluation.tokens - 150);
  }
  
  // Priorité 3 : Réduire Context
  if (excess > 0 && context.context.tokens > 150) {
    context.context = compressConversation(context.context, 150);
    excess -= (context.context.tokens - 150);
  }
  
  // Priorité 4 : Réduire Planner
  if (excess > 0 && context.planner.tokens > 100) {
    context.planner = compressPlanner(context.planner, 100);
    excess -= (context.planner.tokens - 100);
  }
  
  // Priorité 5 : Réduire ATS
  if (excess > 0 && context.ats.tokens > 100) {
    context.ats = compressATS(context.ats, 100);
    excess -= (context.ats.tokens - 100);
  }
  
  // Priorité 6 : Réduire Career DNA
  if (excess > 0 && context.careerDNA.tokens > 100) {
    context.careerDNA = compressCareerDNA(context.careerDNA, 100);
    excess -= (context.careerDNA.tokens - 100);
  }
  
  // Priorité 7 : Réduire AI Guard
  if (excess > 0 && context.aiGuard.tokens > 20) {
    context.aiGuard = compressAIGuard(context.aiGuard, 20);
    excess -= (context.aiGuard.tokens - 20);
  }
  
  // Priorité 8 : Réduire AI Response
  if (excess > 0 && context.aiResponse.tokens > 300) {
    context.aiResponse = compressAIResponse(context.aiResponse, 300);
  }
  
  return context;
}
```

---

## Monitoring du Budget

### KPIs

- **Budget respecté** : Pourcentage de tours qui respectent le budget (< 2500 tokens)
- **Budget dépassé** : Pourcentage de tours qui dépassent le budget (> 2500 tokens)
- **Compression appliquée** : Pourcentage de tours qui nécessitent une compression
- **Tokens moyens par tour** : Moyenne des tokens par tour
- **Tokens P95 par tour** : 95e percentile des tokens par tour

### Alertes

- **Alerte warning** : Si budget dépassé > 10% des tours
- **Alerte critical** : Si budget dépassé > 20% des tours
- **Alerte emergency** : Si budget dépassé > 30% des tours

### Logging

- Loguer chaque tour avec :
  - Tokens input
  - Tokens output
  - Tokens total
  - Compression appliquée (oui/non)
  - Composants compressés

---

## Scénarios de Budget

### Scénario 1 : Tour Normal

**Contexte**
- System Prompt : 500 tokens
- Persona : 100 tokens
- Memory : 300 tokens
- Evaluation : 200 tokens
- Planner : 150 tokens
- ATS : 150 tokens
- Career DNA : 140 tokens
- Context : 250 tokens
- User Input : 150 tokens
- AI Guard : 40 tokens

**Total Input** : 1980 tokens

**Output**
- AI Response : 400 tokens

**Total** : 2380 tokens

**Résultat** : Budget respecté (2380 < 2500)

---

### Scénario 2 : Tour avec Contexte Gros

**Contexte**
- System Prompt : 500 tokens
- Persona : 100 tokens
- Memory : 400 tokens (excess 100)
- Evaluation : 250 tokens (excess 50)
- Planner : 150 tokens
- ATS : 150 tokens
- Career DNA : 140 tokens
- Context : 300 tokens (excess 50)
- User Input : 150 tokens
- AI Guard : 40 tokens

**Total Input** : 2180 tokens (excess 200)

**Compression**
- Memory : 400 → 200 tokens (-200)
- Evaluation : 250 → 150 tokens (-100)
- Context : 300 → 150 tokens (-150)

**Total Input après compression** : 1730 tokens

**Output**
- AI Response : 400 tokens

**Total** : 2130 tokens

**Résultat** : Budget respecté après compression (2130 < 2500)

---

### Scénario 3 : Tour d'Initialisation

**Contexte**
- System Prompt : 500 tokens
- Persona : 100 tokens
- Memory : 300 tokens
- Evaluation : 0 tokens (pas encore)
- Planner : 150 tokens
- ATS : 150 tokens
- Career DNA : 140 tokens
- Context : 0 tokens (pas encore)
- User Input : 0 tokens (pas encore)
- AI Guard : 40 tokens

**Total Input** : 1380 tokens

**Output**
- AI Response : 500 tokens (première question)

**Total** : 1880 tokens

**Résultat** : Budget respecté (1880 < 3500, exception init)

---

### Scénario 4 : Tour d'Évaluation

**Contexte**
- System Prompt : 500 tokens
- Persona : 100 tokens
- Memory : 300 tokens
- Evaluation : 250 tokens (toutes les évaluations)
- Planner : 150 tokens
- ATS : 150 tokens
- Career DNA : 140 tokens
- Context : 300 tokens (tout l'historique)
- User Input : 150 tokens
- AI Guard : 40 tokens

**Total Input** : 2080 tokens

**Output**
- AI Response : 600 tokens (synthèse complète)

**Total** : 2680 tokens

**Résultat** : Budget respecté (2680 < 3000, exception évaluation)

---

## Recommandations

### Implémentation

1. **Context Builder** : Implémenter l'algorithme de compression dynamique
2. **Monitoring** : Implémenter le monitoring du budget (KPIs, alertes, logging)
3. **Tests** : Tester les scénarios de budget (normal, gros contexte, initialisation, évaluation)

### Optimisation

1. **System Prompt** : Optimiser pour réduire à 500 tokens
2. **Persona** : Condenser pour réduire à 100 tokens
3. **Memory** : Filtrer pour réduire à 300 tokens
4. **Evaluation** : Garder les récentes pour réduire à 200 tokens
5. **Context** : Garder les 3 derniers tours pour réduire à 250 tokens

### Validation

1. **Unit tests** : Tester la compression de chaque composant
2. **Integration tests** : Tester le budget par tour
3. **Load tests** : Tester le budget sous charge

---

## Conclusion

Le budget de tokens est défini à 2500 tokens par tour, avec des exceptions pour l'initialisation (3500 tokens) et l'évaluation (3000 tokens). Le budget optimisé respecte cette règle avec 2380 tokens.

Une stratégie de compression dynamique est implémentée pour gérer les cas où le budget est dépassé, avec des priorités claires pour chaque composant.

Le monitoring du budget est essentiel pour assurer le respect de la règle et détecter les problèmes potentiels.
