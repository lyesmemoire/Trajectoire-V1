# DOC-007b-02 : Protocole de Détection d'Incertitude

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de détection d'incertitude pour le moteur de raisonnement. Ce protocole spécifie comment le moteur identifie, évalue et traite les situations d'incertitude selon la taxonomie définie dans DOC-007b-01.

---

## 2. Architecture de la Détection

### 2.1 Flux de Détection

```
INPUT (CV + Poste + Contexte)
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 1 : COLLECTE DES FAITS   │ → Faits bruts
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 2 : DÉTECTION NIVEAU 1   │ → Données insuffisantes
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 3 : DÉTECTION NIVEAU 2   │ → Signaux contradictoires
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 4 : DÉTECTION NIVEAU 3   │ → Zone grise métier
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 5 : DÉTECTION NIVEAU 4   │ → Risque éthique/juridique
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 6 : CLASSIFICATION        │ → Type de doute
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 7 : FORMULATION          │ → Réponse structurée
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 8 : TRAÇABILITÉ          │ → Enregistrement
└─────────────────────────────────┘
    ↓
OUTPUT (Doute structuré)
```

---

## 3. ÉTAPE 1 : Collecte des Faits

### 3.1 Objectif

Collecter les faits bruts sans interprétation pour identifier les zones d'incertitude.

### 3.2 Métriques de Complétude

Le moteur calcule des métriques de complétude pour le CV et la fiche de poste :

#### 3.2.1 Métriques CV

```typescript
interface CVCompletenessMetrics {
  hasExplicitSkills: boolean;
  hasExperiences: boolean;
  hasEducation: boolean;
  hasCertifications: boolean;
  skillCount: number;
  experienceCount: number;
  educationCount: number;
  totalDuration: number;
  ambiguousFields: string[];
  missingFields: string[];
}
```

#### 3.2.2 Métriques Fiche de Poste

```typescript
interface JobCompletenessMetrics {
  hasCriticalSkills: boolean;
  hasPreferredSkills: boolean;
  hasMinExperience: boolean;
  hasTeamContext: boolean;
  hasConstraints: boolean;
  criticalSkillCount: number;
  preferredSkillCount: number;
  minExperience: number;
  missingFields: string[];
}
```

### 3.3 Seuils de Complétude

| Métrique | Seuil Minimal | Action |
|----------|--------------|--------|
| skillCount | ≥ 3 | Sinon → NIVEAU 1 |
| experienceCount | ≥ 1 | Sinon → NIVEAU 1 |
| educationCount | ≥ 0 | Optionnel |
| criticalSkillCount | ≥ 1 | Sinon → NIVEAU 1 |
| minExperience | > 0 | Sinon → NIVEAU 1 |

---

## 4. ÉTAPE 2 : Détection NIVEAU 1 (Données Insuffisantes)

### 4.1 Algorithme de Détection

```typescript
function detectLevel1Doubt(cvMetrics: CVCompletenessMetrics, jobMetrics: JobCompletenessMetrics): Level1Doubt | null {
  const missingData: string[] = [];

  // CV incomplet
  if (!cvMetrics.hasExplicitSkills) {
    missingData.push("Compétences explicitement déclarées par le candidat");
  }
  if (!cvMetrics.hasExperiences) {
    missingData.push("Expériences professionnelles du candidat");
  }
  if (cvMetrics.experienceCount === 0) {
    missingData.push("Durée d'expérience professionnelle");
  }

  // Fiche de poste incomplète
  if (!jobMetrics.hasCriticalSkills) {
    missingData.push("Compétences critiques requises pour le poste");
  }
  if (jobMetrics.minExperience === 0) {
    missingData.push("Expérience minimale requise pour le poste");
  }

  // Données ambiguës
  if (cvMetrics.ambiguousFields.length > 0) {
    missingData.push(...cvMetrics.ambiguousFields.map(f => `Champ ambigu : ${f}`));
  }

  if (missingData.length > 0) {
    return {
      level: 1,
      type: 'insufficient_data',
      missingData,
      severity: missingData.length >= 3 ? 'high' : 'medium'
    };
  }

  return null;
}
```

### 4.2 Critères de Déclenchement

Le NIVEAU 1 est déclenché si :
- CV sans compétences explicites
- CV sans expériences
- Fiche de poste sans compétences critiques
- Fiche de poste sans expérience minimale
- Champs ambigus détectés

### 4.3 Action Moteur

- Refus de recommandation
- Liste des données manquantes
- Analyse partielle bornée (si possible)
- Actions recommandées pour compléter les données

---

## 5. ÉTAPE 3 : Détection NIVEAU 2 (Signaux Contradictoires)

### 5.1 Algorithme de Détection

```typescript
function detectLevel2Doubt(facts: CollectedFacts): Level2Doubt | null {
  const contradictions: string[] = [];

  // Contradiction compétences/expérience
  const skillExperienceMismatch = detectSkillExperienceMismatch(facts);
  if (skillExperienceMismatch) {
    contradictions.push(skillExperienceMismatch);
  }

  // Incohérence chronologique
  const chronologicalInconsistency = detectChronologicalInconsistency(facts);
  if (chronologicalInconsistency) {
    contradictions.push(chronologicalInconsistency);
  }

  // Contradiction formation/titre
  const educationTitleMismatch = detectEducationTitleMismatch(facts);
  if (educationTitleMismatch) {
    contradictions.push(educationTitleMismatch);
  }

  // Incohérence secteur
  const sectorInconsistency = detectSectorInconsistency(facts);
  if (sectorInconsistency) {
    contradictions.push(sectorInconsistency);
  }

  if (contradictions.length > 0) {
    return {
      level: 2,
      type: 'contradictory_signals',
      contradictions,
      severity: contradictions.length >= 2 ? 'high' : 'medium'
    };
  }

  return null;
}
```

### 5.2 Fonctions de Détection Spécifiques

#### 5.2.1 Détection Compétences/Expérience

```typescript
function detectSkillExperienceMismatch(facts: CollectedFacts): string | null {
  for (const skill of facts.candidate.explicitSkills) {
    const hasRelevantExperience = facts.candidate.experiences.some(exp =>
      exp.title.toLowerCase().includes(skill.name.toLowerCase()) ||
      exp.description?.toLowerCase().includes(skill.name.toLowerCase())
    );
    
    if (!hasRelevantExperience && skill.level === 'expert') {
      return `Compétence ${skill.name} déclarée au niveau expert sans expérience correspondante`;
    }
  }
  return null;
}
```

#### 5.2.2 Détection Incohérence Chronologique

```typescript
function detectChronologicalInconsistency(facts: CollectedFacts): string | null {
  const experiences = facts.candidate.experiences;
  
  for (let i = 0; i < experiences.length - 1; i++) {
    const current = experiences[i];
    const next = experiences[i + 1];
    
    // Chevauchement non expliqué
    if (current.endDate && next.startDate && current.endDate > next.startDate) {
      return `Chevauchement d'expériences non expliqué entre ${current.title} et ${next.title}`;
    }
    
    // Période sans activité > 6 mois
    if (current.endDate && next.startDate) {
      const gap = (next.startDate.getTime() - current.endDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (gap > 6) {
        return `Période sans activité de ${Math.round(gap)} mois entre ${current.title} et ${next.title}`;
      }
    }
  }
  
  return null;
}
```

#### 5.2.3 Détection Formation/Titre

```typescript
function detectEducationTitleMismatch(facts: CollectedFacts): string | null {
  const latestExperience = facts.candidate.experiences[0];
  const latestEducation = facts.candidate.education[0];
  
  if (latestExperience && latestEducation) {
    const experienceYears = latestExperience.duration || 0;
    const educationLevel = latestEducation.degree.toLowerCase();
    
    if (experienceYears < 1 && educationLevel.includes('master') && latestExperience.title.includes('senior')) {
      return `Titre senior incompatible avec niveau de formation master et expérience < 1 an`;
    }
  }
  
  return null;
}
```

#### 5.2.4 Détection Incohérence Secteur

```typescript
function detectSectorInconsistency(facts: CollectedFacts): string | null {
  const sectors = facts.candidate.sectors;
  const experienceDomains = facts.candidate.experiences.map(exp => exp.domain);
  
  const unrelatedSectors = sectors.filter(sector => 
    !experienceDomains.some(domain => domain.toLowerCase().includes(sector.toLowerCase()))
  );
  
  if (unrelatedSectors.length > 2) {
    return `Expérience dans des secteurs sans lien logique : ${unrelatedSectors.join(', ')}`;
  }
  
  return null;
}
```

### 5.3 Critères de Déclenchement

Le NIVEAU 2 est déclenché si :
- Au moins une contradiction détectée
- Incohérence chronologique significative
- Mismatch compétences/expérience
- Mismatch formation/titre

### 5.4 Action Moteur

- Refus de recommandation
- Liste des contradictions identifiées
- Recommandation de clarification en entretien
- Questions spécifiques pour résoudre les contradictions

---

## 6. ÉTAPE 4 : Détection NIVEAU 3 (Zone Grise Métier)

### 6.1 Algorithme de Détection

```typescript
function detectLevel3Doubt(facts: CollectedFacts, gapAnalysis: GapAnalysisResult): Level3Doubt | null {
  const greyZoneIndicators: string[] = [];

  // Profil atypique
  const isAtypical = detectAtypicalProfile(facts);
  if (isAtypical) {
    greyZoneIndicators.push("Profil atypique détecté");
  }

  // Contexte inhabituel
  const hasUnusualContext = detectUnusualContext(facts);
  if (hasUnusualContext) {
    greyZoneIndicators.push("Contexte inhabituel");
  }

  // Compétences émergentes
  const hasEmergingSkills = detectEmergingSkills(facts);
  if (hasEmergingSkills) {
    greyZoneIndicators.push("Compétences émergentes non couvertes par les patterns");
  }

  // Cas limite
  const isBorderline = detectBorderlineCase(facts, gapAnalysis);
  if (isBorderline) {
    greyZoneIndicators.push("Cas limite (critères juste atteints)");
  }

  if (greyZoneIndicators.length > 0) {
    return {
      level: 3,
      type: 'grey_zone',
      indicators: greyZoneIndicators,
      severity: 'medium'
    };
  }

  return null;
}
```

### 6.2 Fonctions de Détection Spécifiques

#### 6.2.1 Détection Profil Atypique

```typescript
function detectAtypicalProfile(facts: CollectedFacts): boolean {
  // Changements de carrière radicaux
  const careerChanges = facts.candidate.experiences.filter((exp, i, arr) => {
    if (i === 0) return false;
    const prevExp = arr[i - 1];
    const domainChange = !isRelatedDomain(exp.domain, prevExp.domain);
    return domainChange;
  });

  if (careerChanges.length >= 2) return true;

  // Expérience dans des domaines très éloignés
  const domains = facts.candidate.experiences.map(exp => exp.domain);
  const unrelatedDomains = domains.filter((d, i) => 
    !domains.some((other, j) => i !== j && isRelatedDomain(d, other))
  );

  return unrelatedDomains.length >= 2;
}

function isRelatedDomain(domain1: string, domain2: string): boolean {
  const relatedDomains = {
    'devops': ['cloud', 'devops', 'infrastructure', 'sre'],
    'data': ['data', 'analytics', 'ml', 'ai'],
    'frontend': ['frontend', 'web', 'ui', 'ux'],
    'backend': ['backend', 'api', 'server'],
  };

  for (const [key, values] of Object.entries(relatedDomains)) {
    if (values.includes(domain1.toLowerCase()) && values.includes(domain2.toLowerCase())) {
      return true;
    }
  }

  return false;
}
```

#### 6.2.2 Détection Contexte Inhabituel

```typescript
function detectUnusualContext(facts: CollectedFacts): boolean {
  if (!facts.job.teamContext) return false;

  // Équipe très petite
  if (facts.job.teamContext.teamSize < 3) return true;

  // Distribution de séniorité inhabituelle
  if (facts.job.teamContext.seniorityDistribution.includes('0 senior')) return true;

  // Contraintes très spécifiques
  if (facts.job.organizationalConstraints && facts.job.organizationalConstraints.length >= 5) {
    return true;
  }

  return false;
}
```

#### 6.2.3 Détection Compétences Émergentes

```typescript
function detectEmergingSkills(facts: CollectedFacts): boolean {
  const emergingSkills = ['web3', 'blockchain', 'ai', 'ml', 'quantum'];
  
  const hasEmerging = facts.candidate.explicitSkills.some(skill =>
    emergingSkills.some(es => skill.name.toLowerCase().includes(es))
  );

  const hasPattern = facts.candidate.explicitSkills.some(skill =>
    TransferPatternsService.hasPattern(skill.name)
  );

  return hasEmerging && !hasPattern;
}
```

#### 6.2.4 Détection Cas Limite

```typescript
function detectBorderlineCase(facts: CollectedFacts, gapAnalysis: GapAnalysisResult): boolean {
  // Expérience minimale juste atteinte
  const totalExperience = facts.candidate.experiences.reduce((sum, exp) => sum + (exp.duration || 0), 0);
  if (Math.abs(totalExperience - facts.job.minExperience) < 0.5) return true;

  // Correspondances directes juste au seuil
  if (gapAnalysis.summary.directMatches === 3) return true;

  // Écarts transférables à la limite
  if (gapAnalysis.summary.transferableGaps === 2) return true;

  return false;
}
```

### 6.3 Critères de Déclenchement

Le NIVEAU 3 est déclenché si :
- Profil atypique détecté
- Contexte inhabituel
- Compétences émergentes non couvertes
- Cas limite

### 6.4 Action Moteur

- Analyse limitée avec périmètre borné
- Identification des dimensions hors périmètre
- Recommandation d'intervention expert RH
- Questions exploratoires

---

## 7. ÉTAPE 5 : Détection NIVEAU 4 (Risque Éthique ou Juridique)

### 7.1 Algorithme de Détection

```typescript
function detectLevel4Doubt(facts: CollectedFacts, jobData: any): Level4Doubt | null {
  const risks: string[] = [];

  // Discrimination potentielle
  const discriminationRisk = detectDiscriminationRisk(jobData);
  if (discriminationRisk) {
    risks.push(discriminationRisk);
  }

  // Risque RGPD
  const gdprRisk = detectGdprRisk(facts);
  if (gdprRisk) {
    risks.push(gdprRisk);
  }

  // Violation de conformité
  const complianceRisk = detectComplianceRisk(jobData);
  if (complianceRisk) {
    risks.push(complianceRisk);
  }

  if (risks.length > 0) {
    return {
      level: 4,
      type: 'ethical_legal_risk',
      risks,
      severity: 'critical'
    };
  }

  return null;
}
```

### 7.2 Fonctions de Détection Spécifiques

#### 7.2.1 Détection Discrimination Potentielle

```typescript
function detectDiscriminationRisk(jobData: any): string | null {
  const prohibitedCriteria = [
    'age', 'gender', 'ethnicity', 'religion', 'sexual_orientation',
    'disability', 'pregnancy', 'marital_status', 'nationality'
  ];

  const jobString = JSON.stringify(jobData).toLowerCase();

  for (const criterion of prohibitedCriteria) {
    if (jobString.includes(criterion)) {
      return `Critère prohibé détecté : ${criterion} (risque de discrimination)`;
    }
  }

  // Détection implicite
  if (jobString.includes('jeune') || jobString.includes('dynamique')) {
    return `Langage suggérant une discrimination par l'âge`;
  }

  return null;
}
```

#### 7.2.2 Détection Risque RGPD

```typescript
function detectGdprRisk(facts: CollectedFacts): string | null {
  // Données sensibles non justifiées
  const sensitiveData = ['health', 'political', 'religious', 'biometric'];
  const factsString = JSON.stringify(facts).toLowerCase();

  for (const data of sensitiveData) {
    if (factsString.includes(data)) {
      return `Donnée sensible détectée sans justification : ${data} (risque RGPD)`;
    }
  }

  return null;
}
```

#### 7.2.3 Détection Violation de Conformité

```typescript
function detectComplianceRisk(jobData: any): string | null {
  // Exigences discriminatoires implicites
  if (jobData.requirements) {
    const requirements = jobData.requirements.join(' ').toLowerCase();
    
    if (requirements.includes('français de naissance')) {
      return 'Exigence discriminatoire basée sur l\'origine nationale';
    }

    if (requirements.includes('français langue maternelle')) {
      return 'Exigence discriminatoire basée sur la langue maternelle';
    }
  }

  return null;
}
```

### 7.3 Critères de Déclenchement

Le NIVEAU 4 est déclenché si :
- Critère prohibé détecté
- Donnée sensible non justifiée
- Exigence discriminatoire implicite

### 7.4 Action Moteur

- Arrêt immédiat du raisonnement
- Description précise du risque
- Refus de poursuivre sans intervention humaine
- Orientation vers l'expert compétent (conformité/DPO)

---

## 8. ÉTAPE 6 : Classification

### 8.1 Algorithme de Classification

```typescript
function classifyDoubt(
  level1: Level1Doubt | null,
  level2: Level2Doubt | null,
  level3: Level3Doubt | null,
  level4: Level4Doubt | null
): DoubtClassification {
  // NIVEAU 4 a priorité absolue
  if (level4) {
    return {
      level: 4,
      type: level4.type,
      severity: level4.severity,
      details: level4
    };
  }

  // NIVEAU 3
  if (level3) {
    return {
      level: 3,
      type: level3.type,
      severity: level3.severity,
      details: level3
    };
  }

  // NIVEAU 2
  if (level2) {
    return {
      level: 2,
      type: level2.type,
      severity: level2.severity,
      details: level2
    };
  }

  // NIVEAU 1
  if (level1) {
    return {
      level: 1,
      type: level1.type,
      severity: level1.severity,
      details: level1
    };
  }

  // Pas de doute
  return {
    level: 0,
    type: 'no_doubt',
    severity: 'none',
    details: null
  };
}
```

### 8.2 Priorité des Niveaux

| Priorité | Niveau | Raison |
|----------|--------|--------|
| 1 | NIVEAU 4 | Risque éthique/juridique critique |
| 2 | NIVEAU 3 | Zone grise nécessitant expertise |
| 3 | NIVEAU 2 | Contradictions nécessitant clarification |
| 4 | NIVEAU 1 | Données insuffisantes |

---

## 9. ÉTAPE 7 : Formulation

### 9.1 Structure de la Formulation

La formulation suit la structure définie dans DOC-007b-01 :

```
CE QUE JE SAIS AVEC CERTITUDE
[...]

CE QUE J'ESTIME AVEC RÉSERVE
[...]

CE QUE JE NE SAIS PAS
[...]

CE QUE JE RECOMMANDE MALGRÉ L'INCERTITUDE
[...]
```

### 9.2 Génération Automatique

```typescript
function formulateDoubt(classification: DoubtClassification, facts: CollectedFacts): StructuredDoubt {
  const certainFacts = extractCertainFacts(facts);
  const reservedEstimates = extractReservedEstimates(facts, classification);
  const unknowns = extractUnknowns(facts, classification);
  const recommendations = generateRecommendations(classification);

  return {
    certainFacts,
    reservedEstimates,
    unknowns,
    recommendations
  };
}
```

---

## 10. ÉTAPE 8 : Traçabilité

### 10.1 Enregistrement du Doute

Chaque expression de doute est tracée avec :

```typescript
interface DoubtTrace {
  id: string;
  timestamp: Date;
  level: number;
  type: string;
  severity: string;
  missingData: string[];
  contradictions: string[];
  indicators: string[];
  risks: string[];
  recommendedActions: string[];
  recruiterAction?: string;
  resolution?: string;
}
```

### 10.2 Stockage

Les traces sont stockées pour :
- Auditabilité du système
- Amélioration continue (MVP-008)
- Analyse des tendances d'incertitude

---

## 11. Intégration avec le Flux de Raisonnement

### 11.1 Positionnement

```
COUCHE 1 : Collecte des Faits
    ↓
ÉTAPE 1-8 : Détection du Doute
    ↓
COUCHE 2 : Analyse des Écarts
    ↓
COUCHE 3 : Contextualisation
    ↓
COUCHE 4 : Décision Argumentée
```

### 11.2 Impact sur la Décision

Si doute détecté :
- Recommandation : `insufficient_data` (NIVEAU 1, 2) ou `expert_intervention_required` (NIVEAU 3) ou `ethical_legal_stop` (NIVEAU 4)
- Confiance : `low`
- Justification : Formulation structurée du doute
- Actions : Recommandations spécifiques au niveau

---

## 12. Performance

### 12.1 Temps de Détection

**Cible :** < 100ms pour la détection complète

### 12.2 Précision de Détection

**Cible :**
- Taux de détection correcte : ≥ 95%
- Taux de faux positifs : ≤ 5%

---

## 13. Maintenance

Le protocole de détection doit être révisé :

- Trimestriellement basé sur les résultats des tests
- Basé sur les retours d'expérience des utilisateurs
- Basé sur les nouvelles situations de doute rencontrées
- Basé sur l'évolution de la réglementation

---

## 14. Conclusion

Le protocole de détection d'incertitude garantit :

- **Détection systématique** des situations de doute
- **Classification précise** selon la taxonomie
- **Formulation structurée** du doute
- **Traçabilité complète** pour l'amélioration
- **Actionabilité** pour résoudre les situations
