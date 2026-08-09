# AUDIT-MATCH-001 — Matching Engine

**Mission:** Audit du Matching Engine  
**Date:** 5 août 2026  
**Auditeur:** Lead Product Manager + QA Lead  
**Référence:** Engine de Matching CV-Job

---

## AUDIT DES COMPOSANTS

### SCORING

**Fichier:** `scoring-engine.ts` (`apps/web/src/core/p7/scoring-engine/scoring-engine.ts`)  
**Contexte:** P7 Scoring Engine (interview simulations, PAS CV-job matching)

**Implémentation:**
- Calcul du score global basé sur des signaux (signals)
- Extraction de signaux via TrustExtractor et StabilityExtractor
- Agrégation via Aggregator
- Score global = Σ(compétence.score * poids)

**Problèmes:**
1. **Mauvais contexte** - Ce scoring est pour les simulations d'entretien, pas pour le matching CV-job
2. **Signaux limités** - Seulement 2 extractors (Trust, Stability)
3. **Pas de matching CV-job** - Aucun calcul de matching entre CV et job

**Statut:** NON APPLICABLE (mauvais contexte)

---

### POIDS

**Fichier:** `scoring-contract.ts` (`apps/web/src/core/p7/scoring-engine/scoring-contract.ts`)

**Poids définis:**
```typescript
export const P7_WEIGHTS = {
  clarity: 0.25,
  stability: 0.25,
  technical_depth: 0.30,
  communication: 0.20,
} as const;
```

**Problèmes:**
1. **Poids arbitraires** - Aucune justification scientifique ou empirique
2. **Mauvais contexte** - Ces poids sont pour les entretiens, pas pour le matching CV-job
3. **Pas de poids pour matching CV-job** - Aucun système de pondération pour le matching

**Statut:** NON APPLICABLE (mauvais contexte)

---

### COMPÉTENCES

**Fichier:** Aucun (non implémenté)

**Implémentation:**
- Aucun algorithme de matching des compétences
- Aucune comparaison CV skills vs Job skills
- Aucun calcul de score de compétences

**Problèmes:**
1. **Non implémenté** - Pas de matching des compétences
2. **Pas de normalisation** - Pas de normalisation des compétences
3. **Pas de pondération** - Pas de pondération des compétences

**Statut:** CRITIQUE (non implémenté)

---

### SOFT SKILLS

**Fichier:** Aucun (non implémenté)

**Implémentation:**
- Aucun algorithme de matching des soft skills
- Aucune comparaison CV soft skills vs Job soft skills
- Aucun calcul de score de soft skills

**Problèmes:**
1. **Non implémenté** - Pas de matching des soft skills
2. **Pas de normalisation** - Pas de normalisation des soft skills
3. **Pas de pondération** - Pas de pondération des soft skills

**Statut:** CRITIQUE (non implémenté)

---

### EXPÉRIENCE

**Fichier:** Aucun (non implémenté)

**Implémentation:**
- Aucun algorithme de matching de l'expérience
- Aucune comparaison CV experience vs Job requirements
- Aucun calcul de score d'expérience

**Problèmes:**
1. **Non implémenté** - Pas de matching de l'expérience
2. **Pas de normalisation** - Pas de normalisation des années d'expérience
3. **Pas de pondération** - Pas de pondération de l'expérience

**Statut:** CRITIQUE (non implémenté)

---

### FORMATION

**Fichier:** Aucun (non implémenté)

**Implémentation:**
- Aucun algorithme de matching de la formation
- Aucune comparaison CV education vs Job requirements
- Aucun calcul de score de formation

**Problèmes:**
1. **Non implémenté** - Pas de matching de la formation
2. **Pas de normalisation** - Pas de normalisation des diplômes
3. **Pas de pondération** - Pas de pondération de la formation

**Statut:** CRITIQUE (non implémenté)

---

### LANGUES

**Fichier:** Aucun (non implémenté)

**Implémentation:**
- Aucun algorithme de matching des langues
- Aucune comparaison CV languages vs Job requirements
- Aucun calcul de score de langues

**Problèmes:**
1. **Non implémenté** - Pas de matching des langues
2. **Pas de normalisation** - Pas de normalisation des niveaux de langue
3. **Pas de pondération** - Pas de pondération des langues

**Statut:** CRITIQUE (non implémenté)

---

### CERTIFICATIONS

**Fichier:** Aucun (non implémenté)

**Implémentation:**
- Aucun algorithme de matching des certifications
- Aucune comparaison CV certifications vs Job requirements
- Aucun calcul de score de certifications

**Problèmes:**
1. **Non implémenté** - Pas de matching des certifications
2. **Pas de normalisation** - Pas de normalisation des certifications
3. **Pas de pondération** - Pas de pondération des certifications

**Statut:** CRITIQUE (non implémenté)

---

### COMPÉTENCES TRANSFÉRABLES

**Fichier:** Aucun (non implémenté)

**Implémentation:**
- Aucun algorithme de calcul des compétences transférables
- Aucune détection de transférabilité
- Aucun calcul de confiance de transfert

**Problèmes:**
1. **Non implémenté** - Pas de calcul des compétences transférables
2. **Pas de base de connaissances** - Pas de graphe de transférabilité
3. **Pas de calcul de confiance** - Pas de calcul de confiance de transfert

**Statut:** CRITIQUE (non implémenté)

---

### EXPLICATIONS

**Fichier:** `matching.service.ts` (`apps/web/src/services/matching.service.ts`)

**Implémentation:**
- Méthode `explainMatch(candidateId, jobId)` existe
- Appelle API `/matching/explain` qui n'existe pas

**Problèmes:**
1. **API inexistante** - `/matching/explain` n'existe pas (404)
2. **Non implémenté** - Pas de génération d'explications
3. **Pas de contexte** - Pas de contexte pour les explications

**Statut:** CRITIQUE (non implémenté)

---

### RAPPORT RH

**Fichier:** `matching.service.ts` (`apps/web/src/services/matching.service.ts`)

**Implémentation:**
- Méthode `getReport(candidateId, jobId)` existe
- Appelle API `/matching/report` qui n'existe pas
- Type `MatchingReport` défini dans `recruiter.types.ts`

**Problèmes:**
1. **API inexistante** - `/matching/report` n'existe pas (404)
2. **Non implémenté** - Pas de génération de rapport RH
3. **Pas de données** - Pas de données pour le rapport

**Statut:** CRITIQUE (non implémenté)

---

## CALCULS MOCKÉS

### CALCULS SIMULÉS

1. **MatchingPanel.tsx**
   - Affiche des scores mockés
   - Pas de calcul réel
   - UI seulement

2. **P7 Scoring Engine**
   - Calcul pour les entretiens, pas pour le matching CV-job
   - Pas applicable au contexte

3. **API endpoints**
   - Toutes les APIs retournent des données mockées (si elles existaient)
   - Pas de calcul réel

---

## SCORES FIXES

### SCORES STATIQUES

1. **P7_WEIGHTS**
   - Poids fixes: clarity: 0.25, stability: 0.25, technical_depth: 0.30, communication: 0.20
   - Pas de dynamisme
   - Pas d'adaptation au contexte

2. **Seuils de recommandation**
   - strong_yes: >= 80
   - yes: >= 60
   - neutral: 50-59
   - no: 30-49
   - strong_no: <= 30
   - Seuils fixes, pas d'adaptation

---

## PONDÉRATIONS ARBITRAIRES

### POIDS SANS JUSTIFICATION

1. **P7_WEIGHTS**
   - clarity: 0.25 (pourquoi 0.25 ?)
   - stability: 0.25 (pourquoi 0.25 ?)
   - technical_depth: 0.30 (pourquoi 0.30 ?)
   - communication: 0.20 (pourquoi 0.20 ?)
   - Aucune justification scientifique
   - Aucune validation empirique

2. **Pas de pondération CV-job**
   - Aucun système de pondération pour le matching CV-job
   - Pas de poids pour les compétences
   - Pas de poids pour l'expérience
   - Pas de poids pour la formation

---

## ALGORITHMES INCOMPLETS

### ALGORITHMES PARTIELS

1. **ScoringEngine**
   - Seulement 2 extractors (Trust, Stability)
   - Pas d'extractor pour les compétences
   - Pas d'extractor pour l'expérience
   - Pas d'extractor pour la formation
   - Pas d'extractor pour les langues
   - Pas d'extractor pour les certifications

2. **RankingEngine**
   - Seulement pour les entretiens, pas pour le matching CV-job
   - Pas applicable au contexte

3. **Aggregator**
   - Agrégation basique
   - Pas de pondération dynamique
   - Pas d'adaptation au contexte

---

## VARIABLES INUTILISÉES

### VARIABLES DÉFINIES MAIS JAMAIS UTILISÉES

1. **MatchingReport.strengths**
   - Défini dans le type
   - Jamais calculé
   - Jamais utilisé

2. **MatchingReport.weaknesses**
   - Défini dans le type
   - Jamais calculé
   - Jamais utilisé

3. **MatchingReport.recommendations**
   - Défini dans le type
   - Jamais calculé
   - Jamais utilisé

4. **MatchingReport.transferableSkills**
   - Défini dans le type
   - Jamais calculé
   - Jamais utilisé

5. **MatchingReport.missingSkills**
   - Défini dans le type
   - Jamais calculé
   - Jamais utilisé

6. **ScoreDimension.weight**
   - Défini dans le type
   - Jamais calculé
   - Jamais utilisé

7. **Signal.excerpt**
   - Défini dans le type
   - Jamais utilisé
   - Optionnel mais jamais renseigné

8. **CandidateEvaluation.metadata.sourceHash**
   - Défini comme "hash-placeholder"
   - Jamais calculé
   - Jamais utilisé

---

## SCORE /100

### CALCUL

**Score = 100 - (Pénalités)**

**Pénalités:**

1. **Matching CV-job non implémenté (critique):** -30 points
   - Aucun algorithme de matching CV-job
   - P7 Scoring Engine est pour les entretiens
   - Pas de scoring pour le matching

2. **Compétences non implémentées (critique):** -10 points
   - Pas de matching des compétences
   - Pas de calcul de score de compétences

3. **Soft Skills non implémentées (critique):** -10 points
   - Pas de matching des soft skills
   - Pas de calcul de score de soft skills

4. **Expérience non implémentée (critique):** -10 points
   - Pas de matching de l'expérience
   - Pas de calcul de score d'expérience

5. **Formation non implémentée (critique):** -10 points
   - Pas de matching de la formation
   - Pas de calcul de score de formation

6. **Langues non implémentées (critique):** -5 points
   - Pas de matching des langues
   - Pas de calcul de score de langues

7. **Certifications non implémentées (critique):** -5 points
   - Pas de matching des certifications
   - Pas de calcul de score de certifications

8. **Compétences transférables non implémentées (critique):** -5 points
   - Pas de calcul des compétences transférables
   - Pas de graphe de transférabilité

9. **Explications non implémentées (critique):** -5 points
   - API `/matching/explain` inexistante
   - Pas de génération d'explications

10. **Rapport RH non implémenté (critique):** -5 points
    - API `/matching/report` inexistante
    - Pas de génération de rapport RH

11. **Pondérations arbitraires (moyen):** -5 points
    - P7_WEIGHTS sans justification
    - Pas de pondération CV-job

**Total pénalités:** -100 points

**SCORE = 100 - 100 = 0/100**

---

## RISQUES

### RISQUES CRITIQUES

1. **Fonctionnalité inexistante**
   - Le matching CV-job n'existe pas
   - Les utilisateurs ne peuvent pas matcher des CV avec des jobs
   - Impact: Fonctionnalité core manquante

2. **APIs inexistantes**
   - Toutes les APIs de matching sont 404
   - Le frontend appelle des APIs qui n'existent pas
   - Impact: Erreurs 404 pour tous les appels

3. **Données non utilisées**
   - Les données CV et Job sont stockées mais jamais utilisées pour le matching
   - Impact: Stockage inutile

4. **Mauvais contexte**
   - P7 Scoring Engine est pour les entretiens, pas pour le matching CV-job
   - Impact: Confusion sur la fonctionnalité

### RISQUES MOYENS

5. **Pondérations arbitraires**
   - Les poids sont sans justification
   - Impact: Scores non fiables

6. **Variables inutilisées**
   - Plusieurs variables définies mais jamais utilisées
   - Impact: Code inutile

---

## PLAN DE CORRECTION

### P0 - CRITIQUE (Cette semaine)

1. **Implémenter Matching CV-job**
   - Créer algorithme de matching CV-job
   - Implémenter scoring multi-dimensionnel
   - Impact: +30 points

2. **Implémenter matching des compétences**
   - Créer algorithme de matching des compétences
   - Normaliser les compétences
   - Calculer score de compétences
   - Impact: +10 points

3. **Implémenter matching des soft skills**
   - Créer algorithme de matching des soft skills
   - Normaliser les soft skills
   - Calculer score de soft skills
   - Impact: +10 points

4. **Implémenter matching de l'expérience**
   - Créer algorithme de matching de l'expérience
   - Normaliser les années d'expérience
   - Calculer score d'expérience
   - Impact: +10 points

5. **Implémenter matching de la formation**
   - Créer algorithme de matching de la formation
   - Normaliser les diplômes
   - Calculer score de formation
   - Impact: +10 points

### P1 - IMPORTANT (Ce mois)

6. **Implémenter matching des langues**
   - Créer algorithme de matching des langues
   - Normaliser les niveaux de langue
   - Calculer score de langues
   - Impact: +5 points

7. **Implémenter matching des certifications**
   - Créer algorithme de matching des certifications
   - Normaliser les certifications
   - Calculer score de certifications
   - Impact: +5 points

8. **Implémenter compétences transférables**
   - Créer algorithme de calcul des compétences transférables
   - Créer graphe de transférabilité
   - Calculer confiance de transfert
   - Impact: +5 points

9. **Créer APIs de matching**
   - Implémenter `/matching/score`
   - Implémenter `/matching/explain`
   - Implémenter `/matching/report`
   - Impact: +10 points

### P2 - AMÉLIORATION (Ce trimestre)

10. **Justifier les pondérations**
    - Valider empiriquement les poids
    - Adapter les poids au contexte
    - Impact: +5 points

11. **Utiliser les variables inutilisées**
    - Calculer strengths
    - Calculer weaknesses
    - Calculer recommendations
    - Impact: +5 points

---

## ESTIMATION DU GAIN APRÈS CORRECTION

### GAIN ESTIMÉ

**Score actuel:** 0/100

**Score après corrections P0:** 70/100  
**Score après corrections P0 + P1:** 90/100  
**Score après corrections P0 + P1 + P2:** 100/100

### IMPACT MÉTIER

**Avant corrections:**
- Fonctionnalité matching inexistante
- Erreurs 404 pour tous les appels
- Données CV et Job non utilisées

**Après corrections P0:**
- Matching CV-jobs fonctionnel
- Scoring multi-dimensionnel
- Utilisation des données CV et Job

**Après corrections P0 + P1:**
- Matching complet (compétences, soft skills, expérience, formation, langues, certifications)
- Compétences transférables calculées
- APIs de matching fonctionnelles

**Après corrections P0 + P1 + P2:**
- Pondérations justifiées empiriquement
- Variables inutilisées utilisées
- Matching optimisé et fiable

### ESTIMATION TEMPS

**P0:** 2-3 semaines  
**P1:** 2-3 semaines  
**P2:** 1-2 semaines

**Total:** 5-8 semaines

---

## SYNTHÈSE

### SCORE GLOBAL: 0/100

**Interprétation:**
- **0-20:** Critique
- **21-40:** Mauvais
- **41-60:** Moyen
- **61-80:** Bon
- **81-100:** Excellent

**Statut:** CRITIQUE

### FORCES

1. Types TypeScript bien définis
2. Architecture P7 bien conçue (pour les entretiens)
3. UI MatchingPanel bien conçue

### FAIBLESSES CRITIQUES

1. **Matching CV-job non implémenté** - Fonctionnalité core manquante
2. **Compétences non implémentées** - Pas de matching des compétences
3. **Soft Skills non implémentées** - Pas de matching des soft skills
4. **Expérience non implémentée** - Pas de matching de l'expérience
5. **Formation non implémentée** - Pas de matching de la formation
6. **APIs inexistantes** - Toutes les APIs de matching sont 404
7. **Mauvais contexte** - P7 Scoring Engine est pour les entretiens

### RECOMMANDATIONS IMMÉDIATES

1. **Implémenter Matching CV-job** (P0)
   - Créer algorithme de matching CV-job
   - Implémenter scoring multi-dimensionnel
   - Impact: +30 points

2. **Implémenter matching des compétences** (P0)
   - Créer algorithme de matching des compétences
   - Impact: +10 points

3. **Implémenter matching des soft skills** (P0)
   - Créer algorithme de matching des soft skills
   - Impact: +10 points

4. **Implémenter matching de l'expérience** (P0)
   - Créer algorithme de matching de l'expérience
   - Impact: +10 points

5. **Implémenter matching de la formation** (P0)
   - Créer algorithme de matching de la formation
   - Impact: +10 points

### POTENTIEL D'AMÉLIORATION

**Score cible:** 100/100  
**Actions requises:** 11  
**Estimation:** 5-8 semaines

---

**FIN DE L'AUDIT AUDIT-MATCH-001**
