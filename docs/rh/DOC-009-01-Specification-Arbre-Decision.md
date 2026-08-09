# DOC-009-01 : Spécification de l'Arbre de Décision

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la spécification de l'arbre de décision pour MVP-009 Explainability. L'arbre de décision expose l'intégralité du raisonnement du moteur en 5 niveaux de profondeur, permettant aux recruteurs de comprendre pourquoi une recommandation a été faite.

---

## 2. Principe Fondateur

Quand le recruteur clique "Pourquoi ?", le moteur expose l'intégralité de son raisonnement en 5 niveaux de profondeur. L'explainability n'est pas une option, c'est une obligation légale et une condition d'adoption par les DRH.

---

## 3. Structure de l'Arbre de Décision

### 3.1 Vue d'Ensemble

L'arbre de décision est structuré en 5 niveaux de profondeur :

```
NIVEAU 1 — SYNTHÈSE
    ↓
NIVEAU 2 — DIMENSIONS ANALYSÉES
    ↓
NIVEAU 3 — DÉTAIL PAR COMPÉTENCE
    ↓
NIVEAU 4 — RAISONNEMENT DE TRANSFERT
    ↓
NIVEAU 5 — SOURCES & TRAÇABILITÉ
```

### 3.2 Interface de Donnée

```typescript
interface DecisionTree {
  id: string;
  candidateId: string;
  jobId: string;
  timestamp: Date;
  
  // NIVEAU 1 — Synthèse
  level1: {
    globalScore: number; // 0-100
    recommendation: 'recommend' | 'not_recommend' | 'recommend_with_conditions' | 'insufficient_data';
    confidence: 'high' | 'medium' | 'low';
    argumentsProcessed: number;
    summary: string;
  };
  
  // NIVEAU 2 — Dimensions analysées
  level2: {
    technicalSkills: DimensionScore;
    experience: DimensionScore;
    education: DimensionScore;
    softSkills: DimensionScore;
    contextualFit: DimensionScore;
  };
  
  // NIVEAU 3 — Détail par compétence
  level3: {
    requiredSkills: SkillAnalysis[];
    preferredSkills: SkillAnalysis[];
  };
  
  // NIVEAU 4 — Raisonnement de transfert
  level4: {
    transferPatterns: TransferReasoning[];
  };
  
  // NIVEAU 5 — Sources & traçabilité
  level5: {
    appliedRules: AppliedRule[];
    activeWeights: ActiveWeight[];
    engineVersion: string;
    reasoningTimestamp: Date;
    hypotheses: string[];
    unevaluatedItems: string[];
  };
}
```

---

## 4. NIVEAU 1 — Synthèse

### 4.1 Structure

```typescript
interface Level1Summary {
  globalScore: number; // 0-100
  recommendation: 'recommend' | 'not_recommend' | 'recommend_with_conditions' | 'insufficient_data';
  confidence: 'high' | 'medium' | 'low';
  argumentsProcessed: number;
  summary: string;
}
```

### 4.2 Description des Champs

| Champ | Description | Exemple |
|-------|-------------|---------|
| globalScore | Score global sur 100 | 82 |
| recommendation | Recommandation principale | recommend |
| confidence | Niveau de confiance | high |
| argumentsProcessed | Nombre d'arguments analysés | 12 |
| summary | Résumé en une phrase | "Candidat recommandé avec forte confiance grâce à une excellente adéquation technique et une expérience pertinente" |

### 4.3 Calcul du Score Global

```typescript
function calculateGlobalScore(level2: Level2Dimensions): number {
  const weights = {
    technicalSkills: 0.40,
    experience: 0.30,
    education: 0.10,
    softSkills: 0.10,
    contextualFit: 0.10
  };
  
  return (
    level2.technicalSkills.score * weights.technicalSkills +
    level2.experience.score * weights.experience +
    level2.education.score * weights.education +
    level2.softSkills.score * weights.softSkills +
    level2.contextualFit.score * weights.contextualFit
  );
}
```

### 4.4 Détermination de la Confiance

```typescript
function determineConfidence(globalScore: number, argumentsProcessed: number): 'high' | 'medium' | 'low' {
  if (globalScore >= 80 && argumentsProcessed >= 10) return 'high';
  if (globalScore >= 60 && argumentsProcessed >= 5) return 'medium';
  return 'low';
}
```

---

## 5. NIVEAU 2 — Dimensions Analysées

### 5.1 Structure

```typescript
interface Level2Dimensions {
  technicalSkills: DimensionScore;
  experience: DimensionScore;
  education: DimensionScore;
  softSkills: DimensionScore;
  contextualFit: DimensionScore;
}

interface DimensionScore {
  score: number; // 0-100
  weight: number; // 0-1
  contribution: number; // contribution au score global
  status: 'excellent' | 'good' | 'acceptable' | 'weak' | 'insufficient';
  keyPoints: string[];
}
```

### 5.2 Description des Dimensions

| Dimension | Description | Poids par défaut |
|-----------|-------------|------------------|
| technicalSkills | Compétences techniques requises | 40% |
| experience | Expérience professionnelle pertinente | 30% |
| education | Formation et certifications | 10% |
| softSkills | Soft skills détectés | 10% |
| contextualFit | Adéquation contextuelle (équipe, culture) | 10% |

### 5.3 Calcul du Score par Dimension

```typescript
function calculateDimensionScore(
 evaluatedSkills: SkillEvaluation[],
 requiredSkills: string[],
 dimensionWeight: number
): DimensionScore {
  const matchedSkills = evaluatedSkills.filter(s => requiredSkills.includes(s.skill));
  const score = matchedSkills.length / requiredSkills.length * 100;
  
  let status: 'excellent' | 'good' | 'acceptable' | 'weak' | 'insufficient';
  if (score >= 90) status = 'excellent';
  else if (score >= 75) status = 'good';
  else if (score >= 60) status = 'acceptable';
  else if (score >= 40) status = 'weak';
  else status = 'insufficient';
  
  const keyPoints = matchedSkills.map(s => s.skill);
  
  return {
    score,
    weight: dimensionWeight,
    contribution: score * dimensionWeight,
    status,
    keyPoints
  };
}
```

---

## 6. NIVEAU 3 — Détail par Compétence

### 6.1 Structure

```typescript
interface Level3Detail {
  requiredSkills: SkillAnalysis[];
  preferredSkills: SkillAnalysis[];
}

interface SkillAnalysis {
  skill: string;
  status: 'present' | 'partial' | 'transferable' | 'absent';
  score: number; // 0-100
  source: string; // citation exacte du CV
  analysis: string; // raisonnement appliqué
  weight: number; // poids dans la décision globale
  category: 'required' | 'preferred';
}
```

### 6.2 Description des Statuts

| Statut | Description | Icône |
|--------|-------------|-------|
| present | Compétence explicitement présente | ✅ |
| partial | Compétence partiellement présente | ⚠️ |
| transferable | Compétence transférable via pattern | 🔄 |
| absent | Compétence absente du CV | ❌ |

### 6.3 Détermination du Statut

```typescript
function determineSkillStatus(
 skill: string,
 cvSkills: string[],
 transferPatterns: TransferPattern[]
): 'present' | 'partial' | 'transferable' | 'absent' {
  // Présence exacte
  if (cvSkills.includes(skill)) return 'present';
  
  // Présence partielle (variations)
  const partialMatch = cvSkills.some(s => isPartialMatch(s, skill));
  if (partialMatch) return 'partial';
  
  // Transfert possible
  const transferable = transferPatterns.some(p => 
    p.targetSkill === skill && p.sourceSkills.some(s => cvSkills.includes(s))
  );
  if (transferable) return 'transferable';
  
  return 'absent';
}
```

### 6.4 Extraction de la Source

```typescript
function extractSkillSource(skill: string, cvText: string): string {
  // Recherche de la compétence dans le CV
  const regex = new RegExp(skill, 'gi');
  const match = cvText.match(regex);
  
  if (match) {
    // Extraction du contexte (50 caractères avant et après)
    const index = cvText.indexOf(match[0]);
    const start = Math.max(0, index - 50);
    const end = Math.min(cvText.length, index + match[0].length + 50);
    return cvText.substring(start, end);
  }
  
  return 'Non détecté dans le CV';
}
```

---

## 7. NIVEAU 4 — Raisonnement de Transfert

### 7.1 Structure

```typescript
interface Level4Transfer {
  transferPatterns: TransferReasoning[];
}

interface TransferReasoning {
  missingSkill: string;
  compensators: Compensator[];
  transferChain: TransferChain;
  estimatedAcquisitionTime: string;
  operationalRisk: 'low' | 'medium' | 'high';
  patternSource: {
    knowledgePack: string;
    version: string;
    patternName: string;
  };
  contextualFactors: string[];
}
```

### 7.2 Structure des Compensateurs

```typescript
interface Compensator {
  skill: string;
  source: string; // citation du CV
  relevance: number; // 0-1
  justification: string;
}
```

### 7.3 Structure de la Chaîne de Transfert

```typescript
interface TransferChain {
  steps: TransferStep[];
  confidence: number; // 0-1
}

interface TransferStep {
  from: string;
  to: string;
  reasoning: string;
  strength: number; // 0-1
}
```

### 7.4 Estimation du Délai d'Acquisition

```typescript
function estimateAcquisitionTime(
 missingSkill: string,
 compensators: Compensator[],
 context: Context
): string {
  // Basé sur la complexité de la compétence
  const complexity = getSkillComplexity(missingSkill);
  
  // Basé sur la force des compensateurs
  const compensatorStrength = compensators.reduce((sum, c) => sum + c.relevance, 0) / compensators.length;
  
  // Basé sur le contexte (équipe disponible, etc.)
  const contextFactor = getContextFactor(context);
  
  const baseMonths = complexity.baseMonths;
  const reduction = compensatorStrength * complexity.maxReduction;
  const adjustment = contextFactor * complexity.maxAdjustment;
  
  const estimatedMonths = Math.max(1, baseMonths - reduction + adjustment);
  
  if (estimatedMonths <= 2) return '1 à 2 mois';
  if (estimatedMonths <= 4) return '2 à 4 mois';
  if (estimatedMonths <= 6) return '3 à 6 mois';
  return 'Plus de 6 mois';
}
```

### 7.5 Évaluation du Risque Opérationnel

```typescript
function evaluateOperationalRisk(
 estimatedTime: string,
 context: Context
): 'low' | 'medium' | 'high' {
  // Risque faible si délai court et contexte favorable
  if (estimatedTime === '1 à 2 mois' && context.hasMentor) return 'low';
  
  // Risque moyen si délai moyen ou contexte mitigé
  if (estimatedTime === '2 à 4 mois' || context.hasPartialSupport) return 'medium';
  
  // Risque élevé si délai long ou contexte défavorable
  if (estimatedTime === 'Plus de 6 mois' || !context.hasSupport) return 'high';
  
  return 'medium';
}
```

---

## 8. NIVEAU 5 — Sources & Traçabilité

### 8.1 Structure

```typescript
interface Level5Traceability {
  appliedRules: AppliedRule[];
  activeWeights: ActiveWeight[];
  engineVersion: string;
  reasoningTimestamp: Date;
  hypotheses: string[];
  unevaluatedItems: string[];
}
```

### 8.2 Règles Appliquées

```typescript
interface AppliedRule {
  ruleId: string;
  ruleName: string;
  source: {
    knowledgePack: string;
    version: string;
  };
  application: string;
  impact: string;
}
```

### 8.3 Pondérations Actives

```typescript
interface ActiveWeight {
  criterion: string;
  value: number;
  justification: string;
  context?: string;
}
```

### 8.4 Hypothèses Posées

Les hypothèses sont des éléments que le moteur a dû inférer car non explicitement présents dans le CV :

```typescript
interface Hypothesis {
  item: string;
  inference: string;
  confidence: number;
  source: 'cv_inference' | 'contextual' | 'default';
}
```

**Exemples d'hypothèses :**
- "Soft skills inférés à partir de l'expérience de management"
- "Capacité d'apprentissage rapide déduite de la progression de carrière"
- "Adéquation culturelle supposée basée sur le secteur d'activité"

### 8.5 Éléments Non Évalués

Les éléments qui n'ont pas pu être évalués par manque d'information :

```typescript
interface UnevaluatedItem {
  item: string;
  reason: string;
  impact: 'low' | 'medium' | 'high';
}
```

**Exemples d'éléments non évalués :**
- "Soft skills non confirmés (absence d'entretien)"
- "Motivation non évaluée (absence de lettre de motivation)"
- "Disponibilité géographique non précisée"

---

## 9. Interface Utilisateur

### 9.1 Affichage de l'Arbre de Décision

```
┌─────────────────────────────────────────┐
│ POURQUOI CE CANDIDAT EST RECOMMANDÉ ?    │
├─────────────────────────────────────────┤
│                                         │
│ [NIVEAU 1] [NIVEAU 2] [NIVEAU 3]       │
│ [NIVEAU 4] [NIVEAU 5]                   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ NIVEAU 1 — SYNTHÈSE                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ Score global     : 82/100               │
│ Recommandation   : ✅ Candidat recommandé│
│ Confiance        : Élevée               │
│ Arguments traités: 12                   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ NIVEAU 2 — DIMENSIONS                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ Compétences tech : 78/100 ████████████  │
│ Expérience       : 85/100 █████████████ │
│ Certifications   : 90/100 ██████████████│
│ Soft skills      : 80/100 ████████████  │
│ Contexte équipe  : 85/100 █████████████ │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ NIVEAU 3 — COMPÉTENCES                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ Python     ✅  Score: 95  Source: "5 ans..."│
│ Docker     ✅  Score: 88  Source: "Docker..."│
│ Kubernetes ⚠️  Score: 0   Transfert     │
│ AWS        ✅  Score: 90  Source: "AWS..."│
│                                         │
│ [Voir détails transfert Kubernetes]     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ NIVEAU 4 — TRANSFERT KUBERNETES         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ Compétence manquante  : Kubernetes       │
│ Compensateurs :                          │
│ → Docker (base commune 70%)             │
│ → Terraform (logique infrastructure)    │
│ → AWS Certified (écosystème compatible) │
│ → Progression carrière rapide           │
│                                         │
│ Délai estimé          : 2 à 3 mois      │
│ Risque opérationnel   : Faible          │
│ Pattern appliqué      : KP-05 v2.1      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ NIVEAU 5 — SOURCES                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ KP-05 Compétences v2.1                   │
│ KP-01 Recrutement v1.8                   │
│ Règle R-140-07 : Transfert container    │
│ Pondération    : Tech 40% / Exp 30% /    │
│                  Context 20% / Soft 10% │
│ Version moteur : MVP-007 v1.2             │
│ Hypothèses     : Soft skills inférés    │
│                                         │
│ [Exporter le rapport] [Imprimer]         │
└─────────────────────────────────────────┘
```

### 9.2 Navigation

- **Navigation par onglets** : Chaque niveau est accessible via un onglet
- **Expansion/Collapse** : Chaque section peut être développée ou réduite
- **Liens entre niveaux** : Les compétences transférables renvoient au niveau 4
- **Export** : Possibilité d'exporter l'arbre complet en PDF

---

## 10. Génération de l'Arbre de Décision

### 10.1 Processus de Génération

```typescript
async function generateDecisionTree(
 candidateId: string,
 jobId: string
): Promise<DecisionTree> {
  // Récupération des données
  const cv = await getCandidateCV(candidateId);
  const job = await getJob(jobId);
  const engineResult = await getEngineResult(candidateId, jobId);
  
  // Génération NIVEAU 1
  const level1 = generateLevel1(engineResult);
  
  // Génération NIVEAU 2
  const level2 = generateLevel2(cv, job, engineResult);
  
  // Génération NIVEAU 3
  const level3 = generateLevel3(cv, job, engineResult);
  
  // Génération NIVEAU 4
  const level4 = generateLevel4(cv, job, engineResult);
  
  // Génération NIVEAU 5
  const level5 = generateLevel5(engineResult);
  
  return {
    id: generateUUID(),
    candidateId,
    jobId,
    timestamp: new Date(),
    level1,
    level2,
    level3,
    level4,
    level5
  };
}
```

### 10.2 Performance

**Objectifs de performance :**
- Génération de l'arbre : < 2 secondes
- Affichage initial : < 1 seconde
- Navigation entre niveaux : < 500 ms

---

## 11. Stockage et Archivage

### 11.1 Stockage

Chaque arbre de décision est stocké pour référence future :

```sql
CREATE TABLE decision_trees (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  level1 JSON NOT NULL,
  level2 JSON NOT NULL,
  level3 JSON NOT NULL,
  level4 JSON NOT NULL,
  level5 JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trees_candidate ON decision_trees(candidate_id);
CREATE INDEX idx_trees_job ON decision_trees(job_id);
CREATE INDEX idx_trees_timestamp ON decision_trees(timestamp);
```

### 11.2 Archivage

Les arbres de décision sont archivés selon les exigences légales :

- **Durée de conservation** : 5 ans
- **Format** : JSON + PDF
- **Emplacement** : Système de stockage sécurisé
- **Accès** : Restreint aux autorisés

---

## 12. Intégration avec MVP-007

### 12.1 Couplage avec le Moteur de Raisonnement

L'arbre de décision est généré à partir de la sortie structurée de MVP-007 :

```typescript
interface EngineOutput {
  recommendation: string;
  confidence: string;
  dimensions: DimensionScores;
  skills: SkillEvaluations;
  transfers: TransferPatterns;
  rules: AppliedRules;
}

function convertEngineToDecisionTree(engineOutput: EngineOutput): DecisionTree {
  return {
    level1: extractLevel1(engineOutput),
    level2: extractLevel2(engineOutput),
    level3: extractLevel3(engineOutput),
    level4: extractLevel4(engineOutput),
    level5: extractLevel5(engineOutput)
  };
}
```

### 12.2 Synchronisation

L'arbre de décision est synchronisé avec le moteur de raisonnement :

- **Génération automatique** : À chaque nouvelle recommandation
- **Mise à jour** : Si le moteur est mis à jour
- **Versioning** : Chaque version du moteur génère des arbres cohérents

---

## 13. Conclusion

La spécification de l'arbre de décision garantit :

- **Transparence totale** du raisonnement du moteur
- **5 niveaux de profondeur** pour une explication complète
- **Traçabilité** de toutes les sources et règles
- **Conformité RGPD** Article 22
- **Adoption** par les DRH (compréhension du système)
- **Bouclier juridique** en cas de contentieux
