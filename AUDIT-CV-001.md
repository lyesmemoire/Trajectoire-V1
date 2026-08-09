# AUDIT-CV-001 — CV Intelligence Pipeline

**Mission:** Audit du pipeline complet CV  
**Date:** 5 août 2026  
**Auditeur:** Lead Product Manager + QA Lead  
**Référence:** Pipeline complet CV Intelligence

---

## PIPELINE COMPLET

```
Upload CV
↓

Extraction texte
↓

Extraction connaissances
↓

Normalisation
↓

Knowledge Graph
↓

Candidate Profile
↓

Matching
↓

Semantic Search
↓

Copilot
```

---

## DÉTAIL PAR ÉTAPE

### ÉTAPE 1: UPLOAD CV

**Composant:** `CVUploader` (`apps/web/src/components/analyze/CVUploader.tsx`)  
**Validation:** `cv-validator.ts` (`apps/web/src/lib/validators/cv-validator.ts`)

**Données créées:** Aucune

**Données transformées:** Aucune

**Données stockées:** Aucune (client-side seulement)

**Données utilisées:** File object (client-side)

**Données perdues:** Aucune

**Données ignorées:** Aucune

**Backend flow:**
1. Validation type (PDF, DOCX)
2. Validation taille (< 10MB)
3. Preview fichier
4. Transmission à l'étape suivante

---

### ÉTAPE 2: EXTRACTION TEXTE

**Fichier:** `extract-pdf-text.ts` (`apps/web/src/lib/ats/extraction/extract-pdf-text.ts`)  
**Méthode:** `extractCVText(buffer: Buffer)`

**Données créées:**
- `ExtractionResult`
  - text: string
  - confidence: number
  - method: "local" | "ocr"
  - error?: string

**Données transformées:**
- Buffer PDF → Texte brut

**Données stockées:** Aucune (mémoire temporaire)

**Données utilisées:**
- Buffer PDF (input)
- Texte extrait (output)

**Données perdues:**
- Formatage original du PDF
- Images du CV
- Mise en page originale

**Données ignorées:**
- Métadonnées PDF
- Structure hiérarchique du document

**Backend flow:**
1. Import dynamique pdf-parse
2. Extraction texte via pdf-parse
3. Détection qualité (isExtractionPoor)
4. Calcul confidence (0.4 si pauvre, 0.9 si bon)
5. Retour ExtractionResult

**Note:** Si extraction pauvre, pas de fallback OCR - données potentiellement perdues.

---

### ÉTAPE 3: EXTRACTION CONNAISSANCES

**Fichier:** `cv-parser.ts` (`apps/web/src/lib/pdf/cv-parser.ts`)  
**Méthode:** `parseCVToStructure(cvText: string)`  
**AI:** Mistral AI (mistralModel)

**Données créées:**
- `CVData` (`types.ts`)
  - personalInfo: { name, email, phone, location, linkedin, portfolio }
  - summary: string
  - experience: Array<{ title, company, period, location, achievements }>
  - education: Array<{ degree, school, year, mention }>
  - skills: { technical, soft, languages }
  - certifications: Array<{ name, issuer, year }>

**Données transformées:**
- Texte brut → JSON structuré

**Données stockées:** Aucune (mémoire temporaire)

**Données utilisées:**
- Texte extrait (input)
- CVData structuré (output)

**Données perdues:**
- Nuances du texte original
- Contexte sémantique
- Relations implicites

**Données ignorées:**
- Sections non standards
- Informations hors schema

**Backend flow:**
1. Appel Mistral AI avec prompt EXTRACTION_PROMPT
2. Génération JSON structuré
3. Nettoyage (remove ```json, ```)
4. Parse JSON
5. Retour CVData

**Note:** Utilise Mistral AI avec température 0.1 pour extraction structurée.

---

### ÉTAPE 4: NORMALISATION

**Fichier:** `EntityExtractionEngine.ts` (`apps/web/src/lib/ai/engines/EntityExtractionEngine.ts`)  
**Fichier:** `CanonicalEntityResolver.ts` (`apps/web/src/lib/ai/engines/CanonicalEntityResolver.ts`)

**Données créées:**
- EntityFacts
  - Technology entities (via TechnologyCatalog)
  - Company entities (via CompanyCatalog)
  - Date entities (pattern matching)
  - Metric entities (pattern matching)

**Données transformées:**
- Texte brut → Entités canoniques
- Aliases → Canonical names
- Raw values → Normalized values

**Données stockées:** Aucune (mémoire temporaire)

**Données utilisées:**
- CVData structuré (input)
- TechnologyCatalog (référence)
- CompanyCatalog (référence)
- EntityFacts (output)

**Données perdues:**
- Aliases originaux (remplacés par canonical)
- Contexte d'utilisation des entités

**Données ignorées:**
- Entités non cataloguées
- Technologies/entreprises inconnues

**Backend flow:**
1. Extraction technologies (TechnologyCatalog)
2. Extraction companies (CompanyCatalog)
3. Extraction dates (pattern matching)
4. Extraction metrics (pattern matching)
5. Résolution canonique (CanonicalEntityResolver)
6. Création EntityFacts

**Note:** Seules les entités cataloguées sont extraites - beaucoup de données ignorées.

---

### ÉTAPE 5: KNOWLEDGE GRAPH

**Fichier:** `KnowledgeGraph.ts` (`apps/web/src/domain/cognitive/KnowledgeGraph.ts`)  
**Méthode:** `feedKnowledgeGraph()` (placeholder dans PreviewAnalysisService)

**Données créées:**
- KnowledgeGraph
  - nodes: KnowledgeNode[]
  - edges: KnowledgeEdge[]
  - version: number
  - lastUpdated: Date

**Données transformées:**
- EntityFacts → KnowledgeNodes
- Relations → KnowledgeEdges

**Données stockées:** Aucune (placeholder console.log)

**Données utilisées:**
- EntityFacts (input)
- KnowledgeGraph (output)

**Données perdues:**
- Toutes les données (placeholder console.log)
- Relations entre entités
- Historique des changements

**Données ignorées:**
- Toutes les données (non implémenté)

**Backend flow:**
1. **PLACEHOLDER** - console.log seulement
2. Pas de création réelle de KnowledgeGraph
3. Pas de persistance

**Note:** ÉTAPE CRITIQUE - Toutes les données sont perdues ici. Le Knowledge Graph n'est pas implémenté.

---

### ÉTAPE 6: CANDIDATE PROFILE

**Fichier:** `PreviewAnalysisService.ts` (`apps/web/src/lib/preview-analysis/PreviewAnalysisService.ts`)  
**Méthode:** `createCandidateProfile(userId, preview)`

**Données créées:**
- `CareerProfile` (Prisma)
  - id: UUID
  - userId: String
  - employabilityScore: Float
  - careerDNA: JSON
  - clarityTrend: Float (null)
  - confidenceTrend: Float (null)
  - ownershipTrend: Float (null)
  - stressResistance: Float (null)
  - leadershipScore: Float (null)
  - communicationScore: Float (null)
  - unlockedPersonas: String[] (empty)

**Données transformées:**
- PreviewAnalysis → CareerProfile

**Données stockées:**
- CareerProfile dans PostgreSQL

**Données utilisées:**
- PreviewAnalysis.cvExtract (input)
- CareerProfile (output)

**Données perdues:**
- Toutes les données détaillées du CV
- Skills, Experience, Education, Languages (placeholders)

**Données ignorées:**
- Toutes les données détaillées (seul careerDNA stocké)

**Backend flow:**
1. Vérification existence CareerProfile
2. Création si inexistant
3. Stockage employabilityScore
4. Stockage careerDNA (JSON brut)
5. Autres champs laissés null

**Note:** Seul employabilityScore et careerDNA sont stockés - données détaillées perdues.

---

### ÉTAPE 7: MATCHING

**Composant:** `MatchingPanel` (`apps/web/src/components/recruiter/MatchingPanel.tsx`)  
**Service:** `matching.service.ts` (`apps/web/src/services/matching.service.ts`)

**Données créées:**
- `MatchingReport`
  - scores: { global, dimensions[] }
  - strengths: string[]
  - missingSkills: string[]
  - transferableSkills: Array<{ from, to, confidence }>
  - summary: string

**Données transformées:**
- CV + Job → Score de matching

**Données stockées:** Aucune (calcul à la volée)

**Données utilisées:**
- CVData (input)
- JobData (input)
- MatchingReport (output)

**Données perdues:**
- Détails du calcul de matching
- Historique des matchings

**Données ignorées:**
- Contexte temporel
- Poids des différentes dimensions

**Backend flow:**
1. Récupération CV et Job
2. Calcul score global
3. Calcul scores par dimension
4. Identification compétences communes
5. Identification compétences manquantes
6. Identification compétences transférables
7. Génération résumé

**Note:** Backend non audité - implémentation inconnue.

---

### ÉTAPE 8: SEMANTIC SEARCH

**Composant:** `SearchWorkspace` (`apps/web/src/components/search/SearchWorkspace.tsx`)  
**Composants:** `CandidateSearch`, `JobSearch`, `SimilarityView`, `CareerPathView`

**Données créées:**
- Résultats de recherche sémantique
- Vecteurs d'embeddings (non audités)

**Données transformées:**
- Texte → Vecteurs embeddings
- Vecteurs → Scores de similarité

**Données stockées:** Aucune (non audité)

**Données utilisées:**
- CVData (input)
- Embeddings (intermédiaire)
- Résultats recherche (output)

**Données perdues:**
- Vecteurs embeddings (non persistés)
- Historique des recherches

**Données ignorées:**
- Contexte de recherche
- Filtres avancés

**Backend flow:**
1. Génération embeddings (non audité)
2. Recherche vectorielle (non audité)
3. Calcul similarité (non audité)
4. Affichage résultats

**Note:** Backend non audité - implémentation inconnue.

---

### ÉTAPE 9: COPILOT

**Composant:** `ChatWorkspace` (`apps/web/src/components/copilot/ChatWorkspace.tsx`)  
**Service:** `copilot.service.ts` (non audité)

**Données créées:**
- Messages conversation
- Réponses IA
- Sources citées
- Reasoning

**Données transformées:**
- Question → Réponse IA
- CVData → Contexte conversation

**Données stockées:** Aucune (non audité)

**Données utilisées:**
- CVData (contexte)
- KnowledgeGraph (contexte - non implémenté)
- Messages (input/output)

**Données perdues:**
- Historique des conversations (non persisté)
- Sources utilisées (non audité)

**Données ignorées:**
- Métadonnées des sources
- Confiance des réponses

**Backend flow:**
1. Réception message utilisateur
2. Récupération contexte (CV, KnowledgeGraph)
3. Génération réponse IA (non audité)
4. Citation sources (non audité)
5. Affichage réponse

**Note:** Backend non audité - Knowledge Graph non implémenté.

---

## TRAÇAGE DES INFORMATIONS

### NOM

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → personalInfo.name

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.personalInfo.name (mémoire temporaire)
- PreviewAnalysis.cvExtract.name (PostgreSQL)
- CareerProfile (NON - pas de champ name)

**Où elle est utilisée:**
- Affichage dans PremiumATSResult
- Affichage dans Dashboard

**Où elle est perdue:**
- Après création CareerProfile (pas de champ name)

**Où elle est ignorée:**
- Dans CareerProfile (pas de champ name)

---

### EMAIL

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → personalInfo.email

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.personalInfo.email (mémoire temporaire)
- PreviewAnalysis.cvExtract.email (PostgreSQL)
- User.email (Supabase - separate)

**Où elle est utilisée:**
- Authentification Supabase
- Envoi emails

**Où elle est perdue:**
- Aucune (stockée dans User.email)

**Où elle est ignorée:**
- Dans PreviewAnalysis (doublon avec User.email)

---

### TÉLÉPHONE

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → personalInfo.phone

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.personalInfo.phone (mémoire temporaire)
- PreviewAnalysis.cvExtract.phone (PostgreSQL)
- Aucun champ dans User/CareerProfile

**Où elle est utilisée:**
- Aucune utilisation

**Où elle est perdue:**
- Après création PreviewAnalysis (jamais utilisée)

**Où elle est ignorée:**
- Partout (jamais utilisée)

---

### LOCALISATION

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → personalInfo.location

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.personalInfo.location (mémoire temporaire)
- PreviewAnalysis.cvExtract.location (PostgreSQL)
- Aucun champ dans User/CareerProfile

**Où elle est utilisée:**
- Aucune utilisation

**Où elle est perdue:**
- Après création PreviewAnalysis (jamais utilisée)

**Où elle est ignorée:**
- Partout (jamais utilisée)

---

### MÉTIER

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → experience[].title
- `cv-parser.ts` - parseCVToStructure() → summary

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.experience[].title (mémoire temporaire)
- CVData.summary (mémoire temporaire)
- PreviewAnalysis.cvExtract (PostgreSQL)
- Aucun champ dédié dans CareerProfile

**Où elle est utilisée:**
- Affichage dans Dashboard (experience)
- Matching (non audité)

**Où elle est perdue:**
- Après création CareerProfile (pas de champ dédié)

**Où elle est ignorée:**
- Dans CareerProfile (pas de champ dédié)

---

### COMPÉTENCES

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → skills.technical
- `cv.service.ts` - extractSkills() → technical, soft, tools, languages

**Où elle est transformée:**
- `EntityExtractionEngine.ts` - Technologies canoniques
- `CanonicalEntityResolver.ts` - Résolution aliases

**Où elle est stockée:**
- CVData.skills (mémoire temporaire)
- PreviewAnalysis.cvExtract.skills (PostgreSQL)
- CVAnalysis.keywords (PostgreSQL)
- Aucun champ dédié Skills dans Prisma

**Où elle est utilisée:**
- Affichage Dashboard (skills)
- Matching (non audité)
- Copilot (non audité)

**Où elle est perdue:**
- Après création CareerProfile (placeholder console.log)

**Où elle est ignorée:**
- Dans PreviewAnalysisService.createSkills() (placeholder)

---

### SOFT SKILLS

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → skills.soft
- `cv.service.ts` - extractSkills() → soft

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.skills.soft (mémoire temporaire)
- PreviewAnalysis.cvExtract.skills (PostgreSQL)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Affichage Dashboard (skills)
- Matching (non audité)

**Où elle est perdue:**
- Après création CareerProfile (placeholder console.log)

**Où elle est ignorée:**
- Dans PreviewAnalysisService.createSkills() (placeholder)

---

### LANGUES

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → skills.languages
- `cv.service.ts` - extractSkills() → languages

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.skills.languages (mémoire temporaire)
- PreviewAnalysis.cvExtract.skills (PostgreSQL)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Affichage Dashboard (skills)
- Matching (non audité)

**Où elle est perdue:**
- Après création CareerProfile (placeholder console.log)

**Où elle est ignorée:**
- Dans PreviewAnalysisService.createLanguages() (placeholder)

---

### DIPLÔMES

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → education[].degree

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.education (mémoire temporaire)
- PreviewAnalysis.cvExtract.education (PostgreSQL)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Affichage Dashboard (non implémenté)
- Matching (non audité)

**Où elle est perdue:**
- Après création CareerProfile (placeholder console.log)

**Où elle est ignorée:**
- Dans PreviewAnalysisService.createEducation() (placeholder)

---

### CERTIFICATIONS

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → certifications[]

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.certifications (mémoire temporaire)
- PreviewAnalysis.cvExtract.certifications (PostgreSQL)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Aucune utilisation

**Où elle est perdue:**
- Après création PreviewAnalysis (jamais utilisée)

**Où elle est ignorée:**
- Partout (jamais utilisée)

---

### EXPÉRIENCES

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → experience[]

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVData.experience (mémoire temporaire)
- PreviewAnalysis.cvExtract.experience (PostgreSQL)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Affichage Dashboard (non implémenté)
- Matching (non audité)

**Où elle est perdue:**
- Après création CareerProfile (placeholder console.log)

**Où elle est ignorée:**
- Dans PreviewAnalysisService.createExperience() (placeholder)

---

### DATES

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → experience[].period
- `cv-parser.ts` - parseCVToStructure() → education[].year
- `EntityExtractionEngine.ts` - extractDates()

**Où elle est transformée:**
- String → Date (pattern matching)

**Où elle est stockée:**
- CVData.experience[].period (mémoire temporaire)
- EntityFacts (mémoire temporaire)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Aucune utilisation

**Où elle est perdue:**
- Après création EntityFacts (jamais utilisées)

**Où elle est ignorée:**
- Partout (jamais utilisées)

---

### ENTREPRISES

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → experience[].company
- `EntityExtractionEngine.ts` - extractCompanies()

**Où elle est transformée:**
- String → Company canonique (CompanyCatalog)

**Où elle est stockée:**
- CVData.experience[].company (mémoire temporaire)
- EntityFacts (mémoire temporaire)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Matching (non audité)

**Où elle est perdue:**
- Après création EntityFacts (jamais utilisées)

**Où elle est ignorée:**
- Dans PreviewAnalysis (jamais utilisées)

---

### TECHNOLOGIES

**Où elle est créée:**
- `cv-parser.ts` - parseCVToStructure() → skills.technical
- `cv.service.ts` - extractSkills() → technical, tools
- `EntityExtractionEngine.ts` - extractTechnologies()

**Où elle est transformée:**
- String → Technology canonique (TechnologyCatalog)
- Aliases → Canonical name

**Où elle est stockée:**
- CVData.skills.technical (mémoire temporaire)
- EntityFacts (mémoire temporaire)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Matching (non audité)
- Copilot (non audité)

**Où elle est perdue:**
- Après création EntityFacts (jamais utilisées)

**Où elle est ignorée:**
- Dans PreviewAnalysis (jamais utilisées)

---

### OUTILS

**Où elle est créée:**
- `cv.service.ts` - extractSkills() → tools

**Où elle est transformée:**
- Aucune transformation

**Où elle est stockée:**
- CVSkills.tools (mémoire temporaire)
- Aucun champ dédié dans Prisma

**Où elle est utilisée:**
- Aucune utilisation

**Où elle est perdue:**
- Après extraction (jamais utilisée)

**Où elle est ignorée:**
- Partout (jamais utilisée)

---

## DEAD DATA

### DONNÉES CRÉÉES MAIS JAMAIS UTILISÉES

1. **Téléphone**
   - Créé dans cv-parser.ts
   - Stocké dans PreviewAnalysis
   - Jamais utilisé
   - Volume: 100% des CV

2. **Localisation**
   - Créé dans cv-parser.ts
   - Stocké dans PreviewAnalysis
   - Jamais utilisé
   - Volume: 100% des CV

3. **Certifications**
   - Créé dans cv-parser.ts
   - Stocké dans PreviewAnalysis
   - Jamais utilisé
   - Volume: 100% des CV avec certifications

4. **Outils**
   - Créé dans cv.service.ts
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des CV

5. **EntityFacts**
   - Créé dans EntityExtractionEngine
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des CV

6. **Dates extraites**
   - Créé dans EntityExtractionEngine
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des CV

7. **Metrics extraits**
   - Créé dans EntityExtractionEngine
   - Jamais stocké
   - Jamais utilisé
   - Volume: 100% des CV

---

## UNUSED FIELDS

### CHAMPS PRISMA JAMAIS UTILISÉS

1. **CareerProfile.clarityTrend**
   - Défini dans schema.prisma
   - Jamais initialisé
   - Toujours null
   - Volume: 100% des CareerProfile

2. **CareerProfile.confidenceTrend**
   - Défini dans schema.prisma
   - Jamais initialisé
   - Toujours null
   - Volume: 100% des CareerProfile

3. **CareerProfile.ownershipTrend**
   - Défini dans schema.prisma
   - Jamais initialisé
   - Toujours null
   - Volume: 100% des CareerProfile

4. **CareerProfile.stressResistance**
   - Défini dans schema.prisma
   - Jamais initialisé
   - Toujours null
   - Volume: 100% des CareerProfile

5. **CareerProfile.leadershipScore**
   - Défini dans schema.prisma
   - Jamais initialisé
   - Toujours null
   - Volume: 100% des CareerProfile

6. **CareerProfile.communicationScore**
   - Défini dans schema.prisma
   - Jamais initialisé
   - Toujours null
   - Volume: 100% des CareerProfile

7. **CareerProfile.unlockedPersonas**
   - Défini dans schema.prisma
   - Jamais initialisé
   - Toujours empty array
   - Volume: 100% des CareerProfile

8. **CVAnalysis.originalText**
   - Défini dans schema.prisma
   - Toujours empty string
   - Jamais utilisé
   - Volume: 100% des CVAnalysis

9. **CVAnalysis.optimizedText**
   - Défini dans schema.prisma
   - Toujours empty string
   - Jamais utilisé
   - Volume: 100% des CVAnalysis

10. **PreviewAnalysis.rawPayload**
    - Défini dans schema.prisma
    - Stocké mais jamais utilisé
    - Volume: 100% des PreviewAnalysis

11. **PreviewAnalysis.jobExtract**
    - Défini dans schema.prisma
    - Stocké mais jamais utilisé
    - Volume: 100% des PreviewAnalysis avec job

---

## DOUBLE TRANSFORMATIONS

### TRANSFORMATIONS REDONDANTES

1. **Extraction skills double**
   - cv-parser.ts: skills.technical, soft, languages
   - cv.service.ts: extractSkills() → technical, soft, tools, languages
   - Impact: 2 extractions différentes pour les mêmes données
   - Sévérité: Critique

2. **Extraction technologies double**
   - cv-parser.ts: skills.technical (Mistral AI)
   - EntityExtractionEngine: extractTechnologies (TechnologyCatalog)
   - Impact: 2 méthodes différentes, résultats incohérents
   - Sévérité: Critique

3. **Extraction companies double**
   - cv-parser.ts: experience[].company (Mistral AI)
   - EntityExtractionEngine: extractCompanies (CompanyCatalog)
   - Impact: 2 méthodes différentes, résultats incohérents
   - Sévérité: Critique

4. **Extraction dates double**
   - cv-parser.ts: experience[].period, education[].year (Mistral AI)
   - EntityExtractionEngine: extractDates (pattern matching)
   - Impact: 2 méthodes différentes, résultats incohérents
   - Sévérité: Critique

---

## DONNÉES JAMAIS CONSOMMÉES

### DONNÉES STOCKÉES MAIS JAMAIS LUES

1. **PreviewAnalysis.cvExtract complet**
   - Stocké dans PostgreSQL
   - Jamais lu après création
   - Volume: 100% des PreviewAnalysis
   - Impact: Stockage inutile

2. **PreviewAnalysis.jobExtract**
   - Stocké dans PostgreSQL
   - Jamais lu après création
   - Volume: 100% des PreviewAnalysis avec job
   - Impact: Stockage inutile

3. **PreviewAnalysis.rawPayload**
   - Stocké dans PostgreSQL
   - Jamais lu après création
   - Volume: 100% des PreviewAnalysis
   - Impact: Stockage inutile

4. **CareerProfile.careerDNA**
   - Stocké dans PostgreSQL
   - Jamais lu après création
   - Volume: 100% des CareerProfile
   - Impact: Stockage inutile

5. **CVAnalysis.cvData**
   - Stocké dans PostgreSQL
   - Partiellement lu dans Dashboard
   - Volume: 100% des CVAnalysis
   - Impact: Stockage partiellement inutile

---

## PRIORITÉS DE CORRECTION

### P0 - CRITIQUE (Cette semaine)

1. **Implémenter Knowledge Graph**
   - Remplacer placeholder console.log par vraie implémentation
   - Persister KnowledgeGraph dans PostgreSQL
   - Impact: +20 points

2. **Implémenter Skills/Experience/Education/Languages création**
   - Remplacer placeholders console.log dans PreviewAnalysisService
   - Créer models Prisma si nécessaires
   - Impact: +15 points

3. **Éliminer double transformations**
   - Choisir une méthode d'extraction (Mistral AI ou EntityExtractionEngine)
   - Supprimer l'autre
   - Impact: +10 points

4. **Nettoyer dead data**
   - Supprimer champs jamais utilisés (téléphone, localisation, certifications, outils)
   - Ou les utiliser réellement
   - Impact: +10 points

### P1 - IMPORTANT (Ce mois)

5. **Nettoyer unused fields**
   - Supprimer CareerProfile champs null (clarityTrend, confidenceTrend, etc.)
   - Supprimer CVAnalysis champs vides (originalText, optimizedText)
   - Impact: +5 points

6. **Implémenter Matching backend**
   - Audit complet matching.service.ts
   - Intégrer avec Knowledge Graph
   - Impact: +10 points

7. **Implémenter Semantic Search backend**
   - Audit complet embeddings
   - Intégrer avec Knowledge Graph
   - Impact: +10 points

### P2 - AMÉLIORATION (Ce trimestre)

8. **Implémenter Copilot backend**
   - Audit complet copilot.service.ts
   - Intégrer avec Knowledge Graph
   - Impact: +10 points

9. **Ajouter fallback OCR**
   - Implémenter OCR quand extraction pauvre
   - Améliorer qualité extraction
   - Impact: +5 points

10. **Utiliser EntityFacts**
    - Stocker EntityFacts dans PostgreSQL
    - Utiliser dans Matching et Copilot
    - Impact: +5 points

---

## SCORE /100

### CALCUL

**Score = 100 - (Pénalités)**

**Pénalités:**

1. **Knowledge Graph non implémenté (critique):** -20 points
   - Placeholder console.log
   - Toutes les données perdues

2. **Skills/Experience/Education/Languages placeholders (critique):** -15 points
   - 5 placeholders console.log
   - Données utilisateur non persistées

3. **Double transformations (critique):** -10 points
   - 4 extractions doubles
   - Résultats incohérents

4. **Dead data (critique):** -10 points
   - 7 types de données jamais utilisées
   - Stockage inutile

5. **Unused fields (moyen):** -10 points
   - 11 champs jamais utilisés
   - Stockage inutile

6. **Données jamais consommées (moyen):** -5 points
   - 5 types de données stockées mais jamais lues

7. **Matching non audité (moyen):** -5 points
   - Backend inconnu

8. **Semantic Search non audité (moyen):** -5 points
   - Backend inconnu

9. **Copilot non audité (moyen):** -5 points
   - Backend inconnu

10. **Fallback OCR manquant (faible):** -2 points
    - Extraction pauvre non gérée

**Total pénalités:** -87 points

**SCORE = 100 - 87 = 13/100**

---

## SYNTHÈSE

### SCORE GLOBAL: 13/100

**Interprétation:**
- **0-20:** Critique
- **21-40:** Mauvais
- **41-60:** Moyen
- **61-80:** Bon
- **81-100:** Excellent

**Statut:** CRITIQUE

### FORCES

1. Extraction texte PDF fonctionnelle
2. Extraction structurée via Mistral AI
3. EntityExtractionEngine bien conçu
4. CanonicalEntityResolver robuste
5. Schema Zod pour validation

### FAIBLESSES CRITIQUES

1. **Knowledge Graph non implémenté** - Toutes les données perdues
2. **Skills/Experience/Education/Languages placeholders** - Données utilisateur non persistées
3. **Double transformations** - 2 méthodes d'extraction différentes
4. **Dead data** - 7 types de données jamais utilisées
5. **Unused fields** - 11 champs Prisma jamais utilisés

### RECOMMANDATIONS IMMÉDIATES

1. **Implémenter Knowledge Graph** (P0)
   - Créer table KnowledgeGraph dans Prisma
   - Implémenter feedKnowledgeGraph réel
   - Impact: +20 points

2. **Implémenter Skills/Experience/Education/Languages** (P0)
   - Créer models Prisma
   - Remplacer placeholders
   - Impact: +15 points

3. **Éliminer double transformations** (P0)
   - Choisir Mistral AI ou EntityExtractionEngine
   - Supprimer l'autre
   - Impact: +10 points

4. **Nettoyer dead data** (P0)
   - Supprimer ou utiliser les données
   - Impact: +10 points

### POTENTIEL D'AMÉLIORATION

**Score cible:** 80/100  
**Actions requises:** 4  
**Estimation:** 3-4 semaines

---

**FIN DE L'AUDIT AUDIT-CV-001**
