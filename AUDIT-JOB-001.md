# AUDIT-JOB-001 — Job Intelligence Pipeline

**Mission:** Audit du pipeline complet Fiche de Poste  
**Date:** 5 août 2026  
**Auditeur:** Lead Product Manager + QA Lead  
**Référence:** Pipeline complet Job Intelligence

---

## PIPELINE COMPLET

```
Upload
↓

Extraction
↓

Normalisation
↓

Knowledge Graph
↓

Matching
↓

Search
↓

Copilot
```

---

## DÉTAIL PAR ÉTAPE

### ÉTAPE 1: UPLOAD

**Composants:**
- `JobInput.tsx` (`apps/web/src/components/analyze/JobInput.tsx`) - Textarea
- `JobUploader.tsx` (`apps/web/src/components/recruiter/JobUploader.tsx`) - File upload

**Données créées:** Aucune

**Données transformées:** Aucune

**Données stockées:** Aucune (client-side seulement)

**Données utilisées:**
- Texte brut (JobInput)
- File object (JobUploader)

**Données perdues:** Aucune

**Données ignorées:** Aucune

**Backend flow:**
1. Saisie texte dans textarea (JobInput)
2. Upload fichier PDF/DOCX (JobUploader)
3. Transmission à l'étape suivante

**Note:** JobUploader appelle `/job/upload` API qui n'existe pas (404).

---

### ÉTAPE 2: EXTRACTION

**Fichier:** `extract-job-content.ts` (`apps/web/src/lib/jobs/extract-job-content.ts`)  
**Schema:** `job-extraction.schema.ts` (`apps/web/src/lib/ats/schemas/job-extraction.schema.ts`)

**Données créées:**
- `JobExtraction` (schema)
  - job_title: string
  - company: string
  - must_have: { hard_skills, experience_years, education }
  - nice_to_have: { hard_skills, soft_skills }
  - missions: string[]
  - contract: enum
  - remote: enum

**Données transformées:**
- Texte brut → JSON structuré (via AI non implémentée)

**Données stockées:** Aucune (schema seulement, pas d'implémentation)

**Données utilisées:**
- Texte brut (input)
- JobExtraction (output théorique)

**Données perdues:**
- Toutes les données (pas d'implémentation d'extraction)
- Structure originale de la fiche de poste
- Formatage original

**Données ignorées:**
- Toutes les données (pas d'extraction réelle)

**Backend flow:**
1. **PLACEHOLDER** - extractJobContent retourne input tel quel
2. Pas d'extraction AI
3. Pas de parsing selon schema
4. Retour texte brut

**Note:** ÉTAPE CRITIQUE - Extraction non implémentée, schema existe mais pas utilisé.

---

### ÉTAPE 3: NORMALISATION

**Fichiers:**
- `normalize-job-input.ts` (`apps/web/src/lib/jobs/normalize-job-input.ts`)
- `job-extraction.schema.ts` - normalizeExtractedSkills()

**Données créées:**
- Texte nettoyé
- Skills normalisés (théorique)

**Données transformées:**
- URL → URL sans tracking params
- Texte → Texte sans espaces multiples
- Skills → Skills canoniques (via SKILL_ALIASES)

**Données stockées:** Aucune

**Données utilisées:**
- Input brut (input)
- Input nettoyé (output)

**Données perdues:**
- Tracking params (supprimés)
- Espaces multiples (supprimés)
- Texte > 8000 caractères (tronqué)

**Données ignorées:**
- Aucune

**Backend flow:**
1. Suppression tracking params (URL)
2. Nettoyage espaces multiples (texte)
3. Troncation > 8000 caractères
4. Normalisation skills (via SKILL_ALIASES - 7 aliases seulement)

**Note:** Normalisation limitée à 7 aliases, pas de normalisation complète.

---

### ÉTAPE 4: KNOWLEDGE GRAPH

**Fichier:** Aucun (non implémenté)

**Données créées:** Aucune

**Données transformées:** Aucune

**Données stockées:** Aucune

**Données utilisées:** Aucune

**Données perdues:** Toutes les données

**Données ignorées:** Toutes les données

**Backend flow:**
1. **NON IMPLÉMENTÉ**
2. Pas de création de KnowledgeGraph pour les jobs
3. Pas de persistance

**Note:** ÉTAPE CRITIQUE - Knowledge Graph non implémenté pour les jobs.

---

### ÉTAPE 5: MATCHING

**Composant:** `MatchingPanel.tsx` (`apps/web/src/components/recruiter/MatchingPanel.tsx`)  
**Service:** `matching.service.ts` (non audité)

**Données créées:**
- `MatchingReport` (théorique)
  - scores: { global, dimensions[] }
  - strengths: string[]
  - missingSkills: string[]
  - transferableSkills: Array<{ from, to, confidence }>
  - summary: string

**Données transformées:**
- CV + Job → Score de matching (non audité)

**Données stockées:** Aucune (calcul à la volée)

**Données utilisées:**
- JobData (input théorique)
- CVData (input théorique)
- MatchingReport (output théorique)

**Données perdues:**
- Détails du calcul de matching
- Historique des matchings

**Données ignorées:**
- Contexte temporel
- Poids des différentes dimensions

**Backend flow:**
1. **NON AUDITÉ** - Backend inconnu
2. Pas de vérification d'implémentation

**Note:** Backend non audité - implémentation inconnue.

---

### ÉTAPE 6: SEARCH

**Composant:** `JobSearch.tsx` (`apps/web/src/components/search/JobSearch.tsx`)

**Données créées:**
- Résultats de recherche (non audités)

**Données transformées:**
- Texte → Vecteurs embeddings (non audité)
- Vecteurs → Scores de similarité (non audité)

**Données stockées:** Aucune (non audité)

**Données utilisées:**
- JobData (input théorique)
- Embeddings (intermédiaire théorique)
- Résultats recherche (output théorique)

**Données perdues:**
- Vecteurs embeddings (non persistés)
- Historique des recherches

**Données ignorées:**
- Contexte de recherche
- Filtres avancés

**Backend flow:**
1. **NON AUDITÉ** - Backend inconnu
2. Pas de vérification d'implémentation

**Note:** Backend non audité - implémentation inconnue.

---

### ÉTAPE 7: COPILOT

**Composant:** `ChatWorkspace.tsx` (`apps/web/src/components/copilot/ChatWorkspace.tsx`)  
**Service:** `copilot.service.ts` (non audité)

**Données créées:**
- Messages conversation
- Réponses IA
- Sources citées
- Reasoning

**Données transformées:**
- Question → Réponse IA
- JobData → Contexte conversation

**Données stockées:** Aucune (non audité)

**Données utilisées:**
- JobData (contexte théorique)
- KnowledgeGraph (contexte - non implémenté)
- Messages (input/output)

**Données perdues:**
- Historique des conversations (non persisté)
- Sources utilisées (non auditée)

**Données ignorées:**
- Métadonnées des sources
- Confiance des réponses

**Backend flow:**
1. **NON AUDITÉ** - Backend inconnu
2. Pas de vérification d'implémentation

**Note:** Backend non audité - Knowledge Graph non implémenté pour les jobs.

---

## INFORMATIONS PERDUES

### DONNÉES EXTRAITES MAIS JAMAIS STOCKÉES

1. **Job title**
   - Extrait dans schema (job_title)
   - Jamais stocké dans Prisma
   - Stocké seulement dans InterviewSession.jobTitle
   - Volume: 100% des jobs

2. **Company**
   - Extrait dans schema (company)
   - Jamais stocké dans Prisma
   - Stocké seulement dans InterviewSession.company
   - Volume: 100% des jobs

3. **Must-have hard skills**
   - Extrait dans schema (must_have.hard_skills)
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des jobs

4. **Nice-to-have hard skills**
   - Extrait dans schema (nice_to_have.hard_skills)
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des jobs

5. **Nice-to-have soft skills**
   - Extrait dans schema (nice_to_have.soft_skills)
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des jobs

6. **Missions**
   - Extrait dans schema (missions)
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des jobs

7. **Contract type**
   - Extrait dans schema (contract)
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des jobs

8. **Remote work**
   - Extrait dans schema (remote)
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des jobs

9. **Experience years**
   - Extrait dans schema (must_have.experience_years)
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des jobs

10. **Education requirement**
    - Extrait dans schema (must_have.education)
    - Jamais stocké
    - Jamais utilisé
    - Volume: 100% des jobs

11. **JobExtract complet**
    - Stocké dans PreviewAnalysis.jobExtract
    - Jamais lu après création
    - Volume: 100% des PreviewAnalysis avec job

---

## INFORMATIONS INUTILISÉES

### DONNÉES STOCKÉES MAIS JAMAIS LUES

1. **PreviewAnalysis.jobExtract**
   - Stocké dans PostgreSQL
   - Jamais lu après création
   - Volume: 100% des PreviewAnalysis avec job
   - Impact: Stockage inutile

2. **InterviewSession.jobTitle**
   - Stocké dans PostgreSQL
   - Jamais utilisé pour matching
   - Volume: 100% des InterviewSession
   - Impact: Stockage partiellement inutile

3. **InterviewSession.company**
   - Stocké dans PostgreSQL
   - Jamais utilisé pour matching
   - Volume: 100% des InterviewSession
   - Impact: Stockage partiellement inutile

### SCHÉMAS NON UTILISÉS

1. **JobExtractionSchema**
   - Défini dans job-extraction.schema.ts
   - Jamais utilisé pour validation
   - Jamais utilisé pour extraction
   - Volume: 100% des jobs

2. **JobProfile type**
   - Défini dans recruiter.types.ts
   - Jamais instancié
   - Jamais utilisé
   - Volume: 0

3. **KnowledgeGraph type (job)**
   - Défini dans recruiter.types.ts
   - Jamais instancié pour les jobs
   - Jamais utilisé
   - Volume: 0

---

## NORMALISATIONS INCOMPLÈTES

### ALIASES LIMITÉS

1. **SKILL_ALIASES incomplet**
   - Défini dans job-extraction.schema.ts
   - Seulement 7 aliases (AWS, GCP, Azure, React, Next.js, TypeScript, PostgreSQL, Docker, Kubernetes, CI/CD, Product Management)
   - Couvre < 1% des technologies possibles
   - Impact: Normalisation très limitée

2. **Pas de normalisation companies**
   - Aucun alias pour les entreprises
   - Aucune résolution canonique
   - Impact: Entreprises non normalisées

3. **Pas de normalisation locations**
   - Aucune normalisation des localisations
   - Aucune résolution géographique
   - Impact: Localisations non normalisées

4. **Pas de normalisation contract types**
   - Enum limitée (CDI, CDD, FREELANCE, STAGE, ALTERNANCE, UNKNOWN)
   - Pas de normalisation des variantes
   - Impact: Types de contrat non normalisés

5. **Pas de normalisation seniority**
   - Aucune normalisation des niveaux de séniorité
   - Aucune résolution canonique
   - Impact: Séniorité non normalisée

### NETTOYAGE LIMITÉ

1. **Troncation agressive**
   - Texte tronqué à 8000 caractères
   - Pas de warning utilisateur
   - Impact: Perte de données sans notification

2. **Pas de normalisation salaire**
   - Aucune extraction/normalisation des salaires
   - Aucune conversion devise
   - Impact: Salaires non exploitables

3. **Pas de normalisation dates**
   - Aucune extraction/normalisation des dates
   - Aucune résolution temporelle
   - Impact: Dates non exploitables

---

## SCORE /100

### CALCUL

**Score = 100 - (Pénalités)**

**Pénalités:**

1. **Extraction non implémentée (critique):** -25 points
   - Schema existe mais pas utilisé
   - Toutes les données perdues

2. **Knowledge Graph non implémenté (critique):** -20 points
   - Pas de KnowledgeGraph pour les jobs
   - Toutes les données perdues

3. **API /job/upload inexistante (critique):** -10 points
   - JobUploader appelle API 404
   - Upload fichier non fonctionnel

4. **Normalisations incomplètes (critique):** -15 points
   - 7 aliases seulement
   - Pas de normalisation companies, locations, seniority, salaire, dates

5. **Informations perdues (critique):** -10 points
   - 11 types de données jamais stockées
   - jobExtract jamais utilisé

6. **Informations inutilisées (moyen):** -5 points
   - 3 types de données stockées mais jamais lues
   - 3 schémas non utilisés

7. **Matching non audité (moyen):** -5 points
   - Backend inconnu

8. **Search non audité (moyen):** -5 points
   - Backend inconnu

9. **Copilot non audité (moyen):** -5 points
   - Backend inconnu

**Total pénalités:** -100 points

**SCORE = 100 - 100 = 0/100**

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

1. Schema JobExtraction bien défini
2. Normalisation basique implémentée (tracking params, espaces)
3. SKILL_ALIASES existe (limité mais existe)
4. Types TypeScript bien définis

### FAIBLESSES CRITIQUES

1. **Extraction non implémentée** - Schema existe mais pas utilisé
2. **Knowledge Graph non implémenté** - Pas de graphe pour les jobs
3. **API /job/upload inexistante** - Upload fichier non fonctionnel
4. **Normalisations incomplètes** - 7 aliases seulement, pas de normalisation companies/locations/seniority/salaire/dates
5. **Informations perdues** - 11 types de données jamais stockées
6. **Backend non audité** - Matching, Search, Copilot inconnus

### RECOMMANDATIONS IMMÉDIATES

1. **Implémenter extraction Job** (P0)
   - Utiliser JobExtractionSchema
   - Intégrer AI pour extraction
   - Impact: +25 points

2. **Implémenter Knowledge Graph pour les jobs** (P0)
   - Créer KnowledgeGraph pour les jobs
   - Persister dans PostgreSQL
   - Impact: +20 points

3. **Créer API /job/upload** (P0)
   - Implémenter endpoint upload
   - Intégrer avec extraction
   - Impact: +10 points

4. **Étendre normalisations** (P0)
   - Ajouter aliases companies
   - Ajouter normalisation locations
   - Ajouter normalisation seniority
   - Ajouter extraction salaire
   - Ajouter extraction dates
   - Impact: +15 points

5. **Stocker les données extraites** (P0)
   - Créer model Prisma Job
   - Stocker toutes les données extraites
   - Impact: +10 points

### POTENTIEL D'AMÉLIORATION

**Score cible:** 80/100  
**Actions requises:** 5  
**Estimation:** 4-5 semaines

---

**FIN DE L'AUDIT AUDIT-JOB-001**
