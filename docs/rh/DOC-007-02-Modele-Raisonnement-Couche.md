# DOC-007-02 : Modèle de Raisonnement par Couche

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Vue d'Ensemble

Le moteur de raisonnement opère selon un modèle en 4 couches séquentielles. Chaque couche produit une sortie qui alimente la couche suivante. Ce modèle garantit la traçabilité, l'auditabilité et la transparence du raisonnement.

```
INPUT (CV + Poste + Contexte)
    ↓
┌─────────────────────────────────┐
│ COUCHE 1 : COLLECTE DES FAITS   │ → Faits bruts, sourcés
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ COUCHE 2 : ANALYSE DES ÉCARTS   │ → Écarts qualifiés
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ COUCHE 3 : CONTEXTUALISATION    │ → Analyse contextuelle
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ COUCHE 4 : DÉCISION ARGUMENTÉE  │ → Recommandation motivée
└─────────────────────────────────┘
    ↓
OUTPUT (Raisonnement + Décision)
```

---

## 2. Couche 1 : Collecte des Faits

### 2.1 Objectif

Établir les faits bruts sans interprétation, ni pondération. Uniquement des faits traçables et sourcés.

### 2.2 Entrées

- `candidateData` : Données du CV (extraites par CV Intelligence)
- `jobData` : Données de la fiche de poste (extraites par Job Intelligence)
- `context` : Contexte optionnel (équipe, contraintes, compétences couvertes)

### 2.3 Sorties

```typescript
interface CollectedFacts {
  candidate: CandidateFacts;
  job: JobFacts;
  sources: string[];
}
```

### 2.4 Faits Candidat

```typescript
interface CandidateFacts {
  explicitSkills: Array<{ name: string; level: string; duration?: number }>;
  implicitSkills: Array<{ name: string; source: string; confidence: number }>;
  experiences: Array<{ title: string; duration: number; company: string }>;
  certifications: Array<{ name: string; issuer: string; date: Date }>;
  education: Array<{ degree: string; institution: string; year: number }>;
  sectors: string[];
  careerProgression: {
    hasProgression: boolean;
    trajectory: string;
    signals: string[];
  };
  learningSignals: {
    fastLearner: boolean;
    indicators: string[];
  };
}
```

### 2.5 Faits Poste

```typescript
interface JobFacts {
  criticalSkills: Array<{ name: string; level: string }>;
  preferredSkills: Array<{ name: string; level: string }>;
  optionalSkills: Array<{ name: string; level: string }>;
  minExperience: number;
  teamContext?: {
    existingSkills: string[];
    teamSize: number;
    seniorityDistribution: string;
  };
  organizationalConstraints?: string[];
  coveredSkills: string[];
}
```

### 2.6 Règles de Collecte

1. **Compétences explicites** : Extraites directement du CV
2. **Compétences implicites** : Déduites des titres de poste et expériences
3. **Progression de carrière** : Analysée à travers les titres et durées
4. **Signaux d'apprentissage** : Détectés via certifications, diversité technologique
5. **Sources** : Chaque fait est sourcé (CV, KP-001, KP-002, etc.)

### 2.7 Service Implémenté

`FactCollectorService` dans `apps/api/src/reasoning/fact-collector.service.ts`

---

## 3. Couche 2 : Analyse des Écarts

### 3.1 Objectif

Identifier et qualifier chaque écart entre les compétences requises et les compétences du candidat.

### 3.2 Entrées

- `CollectedFacts` (sortie de la couche 1)

### 3.3 Sorties

```typescript
interface GapAnalysisResult {
  gaps: SkillGap[];
  summary: {
    directMatches: number;
    partialMatches: number;
    transferableGaps: number;
    nonCompensableGaps: number;
  };
}
```

### 3.4 Types d'Écarts

#### CAS 1 : Correspondance Directe

```typescript
{
  requiredSkill: "Kubernetes",
  gapType: "direct",
  criticality: "minor",
  source: "CV"
}
```

- Candidat possède exactement la compétence
- Niveau de maîtrise évalué
- Durée de pratique évaluée

#### CAS 2 : Correspondance Partielle

```typescript
{
  requiredSkill: "Kubernetes",
  gapType: "partial",
  candidateSkill: "Docker",
  proximity: 0.7,
  acquisitionDelay: "1-2 mois",
  criticality: "minor",
  source: "CV + KP-002"
}
```

- Candidat possède une compétence proche
- Degré de proximité mesuré (base commune / logique partagée / transfert estimé)
- Délai d'acquisition estimé

#### CAS 3 : Compétence Transférable

```typescript
{
  requiredSkill: "Kubernetes",
  gapType: "transferable",
  transferChain: ["Docker", "Terraform", "AWS"],
  transferSolidity: 0.85,
  acquisitionDelay: "2-3 mois",
  teamSupport: true,
  criticality: "minor",
  operationalImpact: "Faible",
  compensation: "Onboarding structuré avec mentorat équipe",
  source: "Transfer Patterns + Team Context"
}
```

- Candidat ne possède pas la compétence mais possède des compétences qui permettent de l'acquérir rapidement
- Chaîne de transfert identifiée
- Solidité du transfert évaluée
- Délai d'acquisition estimé
- Capacité de l'équipe à accompagner identifiée

#### CAS 4 : Écart Réel Non Compensable

```typescript
{
  requiredSkill: "Kubernetes",
  gapType: "non_compensable",
  criticality: "blocking",
  operationalImpact: "Élevé",
  compensation: "Formation externe requise",
  source: "KP-002"
}
```

- Candidat ne possède pas la compétence
- Aucun transfert crédible identifié
- Niveau de criticité qualifié (bloquant / significatif / mineur)
- Impact opérationnel réel évalué
- Compensation possible proposée

### 3.5 Service Implémenté

`GapAnalyzerService` dans `apps/api/src/reasoning/gap-analyzer.service.ts`

---

## 4. Couche 3 : Contextualisation

### 4.1 Objectif

Replacer l'analyse des écarts dans le contexte réel du poste et de l'équipe.

### 4.2 Entrées

- `CollectedFacts` (sortie de la couche 1)
- `GapAnalysisResult` (sortie de la couche 2)

### 4.3 Sorties

```typescript
interface ContextAnalysis {
  criticalityAssessment: Map<string, 'blocking' | 'significant' | 'minor'>;
  teamAbsorptionCapacity: boolean;
  acquisitionDelayCompatibility: boolean;
  adaptationCapacity: boolean;
  positiveSignals: string[];
  vigilanceSignals: string[];
  reasoning: string[];
}
```

### 4.4 Questions de Contextualisation

Le moteur répond explicitement à ces questions :

1. **Quelle est la criticité réelle de chaque compétence manquante dans CE contexte ?**
   - Pas en général : dans CE poste, CETTE équipe
   - Une compétence critique peut devenir mineure si l'équipe la maîtrise déjà

2. **L'équipe peut-elle absorber les manques pendant la montée en compétence ?**
   - Évaluation des compétences existantes dans l'équipe
   - Évaluation de la taille et de la séniorité de l'équipe

3. **Le délai d'acquisition est-il compatible avec les besoins opérationnels ?**
   - Comparaison des délais estimés avec les contraintes organisationnelles

4. **Le profil de progression du candidat suggère-t-il une capacité d'adaptation ?**
   - Analyse de la trajectoire de carrière
   - Détection des signaux d'apprentissage rapide

5. **Y a-t-il des signaux positifs non quantifiés qui compensent des manques quantifiés ?**
   - Leadership, initiative, résolution de problèmes
   - Engagement dans la certification continue

6. **Y a-t-il des signaux de vigilance non bloquants mais à vérifier en entretien ?**
   - Absence d'expérience
   - Mobilité excessive
   - Équipe petite pour absorber les manques

### 4.5 Service Implémenté

`ContextAnalyzerService` dans `apps/api/src/reasoning/context-analyzer.service.ts`

---

## 5. Couche 4 : Décision Argumentée

### 5.1 Objectif

Produire une recommandation claire, motivée, nuancée et actionnelle.

### 5.2 Entrées

- `CollectedFacts` (sortie de la couche 1)
- `GapAnalysisResult` (sortie de la couche 2)
- `ContextAnalysis` (sortie de la couche 3)
- `DoubtDetection` (sortie du détecteur de doute)

### 5.3 Sorties

```typescript
interface ReasoningDecision {
  recommendation: 'recommend' | 'not_recommend' | 'recommend_with_conditions' | 'insufficient_data';
  justification: string[];
  strengths: string[];
  vigilancePoints: string[];
  residualGaps: Array<{
    skill: string;
    criticality: 'blocking' | 'significant' | 'minor';
    compensation: string;
  }>;
  confidence: 'high' | 'medium' | 'low';
  hypotheses: string[];
  interviewQuestions: Array<{
    question: string;
    importance: string;
  }>;
  doubtDetection?: DoubtDetection;
}
```

### 5.4 Types de Recommandation

#### RECOMMANDER

```
Je recommande ce candidat
```

- Conditions : Aucun écart bloquant, écart(s) significatif(s) ≤ 2, correspondances directes ≥ 5
- Justification : Profil fortement aligné avec les exigences du poste

#### NE PAS RECOMMANDER

```
Je ne recommande pas ce candidat
```

- Conditions : Écart(s) bloquant(s) > 0 OU écart(s) significatif(s) ≥ 3
- Justification : Écarts trop importants pour garantir le succès

#### RECOMMANDER SOUS CONDITIONS

```
Je recommande ce candidat sous conditions
```

- Conditions : Écart(s) significatif(s) > 0 mais < 3, équipe peut absorber, délais compatibles
- Justification : Profil pertinent sous conditions de formation/accompagnement

#### DONNÉES INSUFFISANTES

```
Je ne peux pas recommander sur ce profil avec les données disponibles
```

- Conditions : Données manquantes critiques OU confiance = low
- Justification : Ce qui me manque pour décider : [liste précise]
- Actions recommandées : Ce que je recommande avant de décider : [actions concrètes]

### 5.5 Structure de la Décision

**RECOMMANDATION PRINCIPALE**
- Formulation claire et sans ambiguïté

**JUSTIFICATION**
- Liste ordonnée des arguments principaux
- Chaque argument est sourcé

**POINTS FORTS DU CANDIDAT**
- Ce qui le rend pertinent pour ce poste spécifiquement

**POINTS DE VIGILANCE**
- Ce qui n'est pas bloquant mais mérite attention ou vérification

**ÉCARTS RÉSIDUELS**
- Ce qui manque vraiment
- Niveau de criticité de chaque écart
- Plan de compensation proposé

**NIVEAU DE CONFIANCE**
- Élevé : données suffisantes, raisonnement solide
- Moyen : données partielles, hypothèses posées
- Faible : données insuffisantes, clarifications requises

**HYPOTHÈSES POSÉES**
- Liste explicite de ce que le moteur a supposé faute d'information
- Transparence totale sur les zones d'incertitude

**QUESTIONS POUR L'ENTRETIEN**
- Liste des points que l'entretien doit clarifier
- Pour chaque question : pourquoi elle est importante

### 5.6 Capacité à Douter — Règle Absolue

Si les données sont insuffisantes, le moteur NE PRODUIT PAS de recommandation forcée.

Le doute structuré est une marque d'expertise. Un DRH Senior sait quand il ne sait pas. Le moteur apprend la même discipline.

### 5.7 Service Implémenté

`DecisionBuilderService` dans `apps/api/src/reasoning/decision-builder.service.ts`

---

## 6. Services Auxiliaires

### 6.1 TransferPatternsService

Bibliothèque de 100+ patterns de transfert de compétences.

```typescript
interface TransferPattern {
  prerequisites: string[];
  weights: Record<string, number>;
  minPrerequisites: number;
}
```

Exemple : Kubernetes
- Prérequis : Docker (0.3), Terraform (0.25), AWS (0.2), Linux (0.15)
- Min prérequis : 2

### 6.2 DoubtDetectorService

Détecte les situations où les données sont insuffisantes pour formuler une recommandation.

```typescript
interface DoubtDetection {
  hasDoubt: boolean;
  confidence: 'high' | 'medium' | 'low';
  missingData: string[];
  recommendedActions: string[];
  reasoning: string[];
}
```

---

## 7. Flux de Données

```
INPUT
  ↓
FactCollectorService → CollectedFacts
  ↓
GapAnalyzerService → GapAnalysisResult
  ↓
ContextAnalyzerService → ContextAnalysis
  ↓
DoubtDetectorService → DoubtDetection
  ↓
DecisionBuilderService → ReasoningDecision
  ↓
OUTPUT
```

---

## 8. Performance

- **Temps de raisonnement cible :** < 15 secondes
- **Mesure :** Processing time inclus dans les métadonnées de sortie

---

## 9. Traçabilité et Auditabilité

Chaque couche produit :
- Ses données de sortie
- Ses sources
- Son raisonnement interne

L'arbre de décision complet peut être reconstitué à partir des 4 couches.

---

## 10. Intégration

Le module `ReasoningModule` orchestre les 4 couches via `ReasoningService`.

```typescript
async reason(input: ReasoningInput): Promise<ReasoningOutput>
```

Le service mesure le temps de traitement et retourne les 4 couches de raisonnement.
