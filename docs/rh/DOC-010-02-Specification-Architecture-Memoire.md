# DOC-010-02 : Spécification de l'Architecture Mémoire (4 Couches)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir l'architecture de la mémoire personnalisée de MVP-010. La mémoire est structurée en 4 couches qui permettent au moteur de passer de l'intelligence générique à l'intelligence contextuelle et personnalisée.

---

## 2. Principe Fondateur

**SANS MÉMOIRE :** Chaque session repart de zéro. Le moteur ne vous connaît pas. Il applique des règles génériques. Valeur : Standard.

**AVEC MÉMOIRE :** Le moteur se souvient de votre contexte. Il adapte ses recommandations à votre réalité. Il apprend ce qui fonctionne pour vous. Valeur : Différenciante et défendable.

---

## 3. Vue d'Ensemble de l'Architecture

```
┌─────────────────────────────────────────┐
│ COUCHE 4 — APPRENTISSAGES ACCUMULÉS    │
│ Règles contextuelles validées           │
│ Patterns prédicteurs locaux              │
│ Anti-patterns identifiés                │
├─────────────────────────────────────────┤
│ COUCHE 3 — CONTEXTE ORGANISATIONNEL    │
│ Managers                                │
│ Équipes cibles                          │
│ Organisation                            │
├─────────────────────────────────────────┤
│ COUCHE 2 — HISTORIQUE DE DÉCISIONS      │
│ Recrutements réussis (anonymisés)       │
│ Recrutements ratés (anonymisés)         │
│ Décisions regrettées                    │
├─────────────────────────────────────────┤
│ COUCHE 1 — PROFIL DE PRÉFÉRENCE        │
│ Préférences explicites                 │
│ Préférences implicites                 │
│ Vigilance biais                         │
└─────────────────────────────────────────┘
```

---

## 4. COUCHE 1 — Profil de Préférence Recruteur

### 4.1 Objectif

Ce que le moteur apprend sur les préférences du recruteur à partir de ses décisions passées.

### 4.2 Structure de Données

```typescript
interface RecruiterPreferenceProfile {
  id: string;
  recruiterId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Préférences explicites (déclarées)
  explicitPreferences: {
    preferredSectors: string[];
    preferredJobTypes: string[];
    eliminationCriteria: EliminationCriterion[];
    customWeights?: CustomWeights;
  };
  
  // Préférences implicites (apprises)
  implicitPreferences: {
    decisionPatterns: DecisionPattern[];
    overWeightedCriteria: CriterionWeight[];
    underWeightedCriteria: CriterionWeight[];
    sensitiveSignals: string[];
  };
  
  // Vigilance biais
  biasAlerts: BiasAlert[];
  
  // Statistiques d'apprentissage
  learningStats: {
    totalDecisions: number;
    learningStartDate: Date;
    lastLearningUpdate: Date;
    confidenceLevel: number; // 0-1
  };
}
```

### 4.3 Préférences Explicites

```typescript
interface EliminationCriterion {
  criterion: string;
  category: 'skill' | 'experience' | 'education' | 'location' | 'other';
  threshold: any;
  reason: string;
  active: boolean;
}

interface CustomWeights {
  technicalSkills: number; // 0-1
  experience: number; // 0-1
  education: number; // 0-1
  softSkills: number; // 0-1
  contextualFit: number; // 0-1
}
```

### 4.4 Préférences Implicites

```typescript
interface DecisionPattern {
  patternId: string;
  description: string;
  frequency: number;
  confidence: number; // 0-1
  lastObserved: Date;
}

interface CriterionWeight {
  criterion: string;
  observedWeight: number; // 0-1
  defaultWeight: number; // 0-1
  delta: number; // observed - default
  confidence: number; // 0-1
}
```

### 4.5 Alerte Biais

```typescript
interface BiasAlert {
  alertId: string;
  type: 'potential_discrimination' | 'pattern_concern' | 'statistical_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedPattern: string;
  prohibitedCriteria?: string[];
  timestamp: Date;
  acknowledged: boolean;
  actionTaken?: string;
}
```

### 4.6 Schéma SQL

```sql
CREATE TABLE recruiter_preference_profiles (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  explicit_preferences JSON NOT NULL,
  implicit_preferences JSON NOT NULL,
  bias_alerts JSON,
  learning_stats JSON NOT NULL,
  
  CONSTRAINT fk_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id)
);

CREATE INDEX idx_pref_recruiter ON recruiter_preference_profiles(recruiter_id);
CREATE INDEX idx_pref_updated ON recruiter_preference_profiles(updated_at);
```

---

## 5. COUCHE 2 — Historique de Décisions Anonymisé

### 5.1 Objectif

Historique des décisions du recruteur avec données candidats anonymisées.

### 5.2 Structure de Données

```typescript
interface DecisionHistory {
  id: string;
  recruiterId: string;
  anonymizedCandidateId: string; // hash
  jobId: string;
  decisionDate: Date;
  
  // Décision
  decision: {
    action: 'accepted' | 'rejected' | 'on_hold' | 'regretted';
    engineRecommendation: string;
    followedRecommendation: boolean;
    overrideReason?: string;
  };
  
  // Profil candidat anonymisé
  anonymizedProfile: {
    profileType: string; // ex: "DevOps senior 5 ans"
    technicalSkills: string[];
    experience: {
      years: number;
      sectors: string[];
      roles: string[];
    };
    education: string[];
    certifications: string[];
  };
  
  // Signaux prédicteurs
  predictorSignals: {
    successSignals?: string[];
    failureSignals?: string[];
    regretSignals?: string[];
  };
  
  // Outcome (si disponible)
  outcome?: {
    hired: boolean;
    tenure?: number; // en mois
    performance?: string;
    departureReason?: string;
    feedback?: string;
  };
}
```

### 5.3 Anonymisation du Candidat

```typescript
function anonymizeCandidateProfile(candidate: Candidate): AnonymizedProfile {
  return {
    profileType: generateProfileType(candidate),
    technicalSkills: candidate.skills.map(s => s.name),
    experience: {
      years: candidate.experience.totalYears,
      sectors: candidate.experience.sectors,
      roles: candidate.experience.roles
    },
    education: candidate.education.map(e => `${e.degree} in ${e.field}`),
    certifications: candidate.certifications.map(c => c.name)
  };
}

function generateProfileType(candidate: Candidate): string {
  const experience = candidate.experience.totalYears;
  const primarySkill = candidate.skills[0]?.name || 'General';
  const level = experience < 2 ? 'Junior' : experience < 5 ? 'Mid-level' : 'Senior';
  
  return `${level} ${primarySkill} ${experience} years`;
}
```

### 5.4 Schéma SQL

```sql
CREATE TABLE decision_history (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  anonymized_candidate_id VARCHAR(64) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  decision_date TIMESTAMP NOT NULL,
  
  decision JSON NOT NULL,
  anonymized_profile JSON NOT NULL,
  predictor_signals JSON,
  outcome JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id),
  CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_history_recruiter ON decision_history(recruiter_id);
CREATE INDEX idx_history_candidate ON decision_history(anonymized_candidate_id);
CREATE INDEX idx_history_date ON decision_history(decision_date);
CREATE INDEX idx_history_decision ON decision_history(decision->>'action');
```

---

## 6. COUCHE 3 — Contexte Organisationnel

### 6.1 Objectif

Informations sur l'environnement de travail du recruteur.

### 6.2 Structure de Données

```typescript
interface OrganizationalContext {
  id: string;
  recruiterId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Managers
  managers: ManagerProfile[];
  
  // Équipes cibles
  targetTeams: TeamProfile[];
  
  // Organisation
  organization: OrganizationProfile;
}

interface ManagerProfile {
  managerId: string;
  name: string; // pseudonyme ou rôle
  role: string;
  preferredManagementStyle: string[];
  cultureFitCriteria: string[];
  recurrentJobTypes: string[];
  collaborationHistory: {
    totalCollaborations: number;
    successRate: number;
    lastCollaboration: Date;
  };
}

interface TeamProfile {
  teamId: string;
  name: string; // pseudonyme
  currentComposition: {
    size: number;
    skillsCovered: string[];
    roles: string[];
    seniorityDistribution: {
      junior: number;
      mid: number;
      senior: number;
    };
  };
  gapsToFill: {
    priority: 'high' | 'medium' | 'low';
    skills: string[];
    roles: string[];
  };
  teamDynamics: {
    collaborationStyle: string;
    communicationStyle: string;
    workStyle: string;
  };
}

interface OrganizationProfile {
  organizationId: string;
  sector: string;
  culture: string;
  developmentStage: 'startup' | 'scaleup' | 'midsize' | 'enterprise';
  organizationalConstraints: string[];
  recruitmentHistory: {
    totalHires: number;
    averageTimeToHire: number;
    retentionRate: number;
    commonSuccessFactors: string[];
  };
}
```

### 6.3 Schéma SQL

```sql
CREATE TABLE organizational_context (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) UNIQUE NOT NULL,
  organization_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  managers JSON NOT NULL,
  target_teams JSON NOT NULL,
  organization JSON NOT NULL,
  
  CONSTRAINT fk_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id),
  CONSTRAINT fk_org FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_org_context_recruiter ON organizational_context(recruiter_id);
CREATE INDEX idx_org_context_org ON organizational_context(organization_id);
```

---

## 7. COUCHE 4 — Apprentissages Accumulés

### 7.1 Objectif

Ce que le moteur a découvert qui est spécifique à CE recruteur dans CE contexte.

### 7.2 Structure de Données

```typescript
interface AccumulatedLearnings {
  id: string;
  recruiterId: string;
  contextId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Règles contextuelles validées
  contextualRules: ContextualRule[];
  
  // Patterns prédicteurs locaux
  localPredictorPatterns: PredictorPattern[];
  
  // Anti-patterns identifiés
  antiPatterns: AntiPattern[];
  
  // Statistiques de validation
  validationStats: {
    totalRules: number;
    validatedRules: number;
    deprecatedRules: number;
    lastValidationDate: Date;
  };
}

interface ContextualRule {
  ruleId: string;
  description: string;
  context: string;
  condition: string;
  consequence: string;
  confidence: number; // 0-1
  validationCount: number;
  successRate: number; // 0-1
  lastValidated: Date;
  status: 'active' | 'deprecated' | 'under_review';
  
  example: string;
}

interface PredictorPattern {
  patternId: string;
  description: string;
  characteristics: string[];
  successRate: number; // 0-1
  sampleSize: number;
  lastObserved: Date;
  confidence: number; // 0-1
}

interface AntiPattern {
  patternId: string;
  description: string;
  characteristics: string[];
  failureRate: number; // 0-1
  sampleSize: number;
  lastObserved: Date;
  confidence: number; // 0-1
  mitigation?: string;
}
```

### 7.3 Exemples d'Apprentissages

**Règle contextuelle :**
```json
{
  "ruleId": "CR-001",
  "description": "Dans cette entreprise, la maîtrise de Docker est plus importante que les certifications malgré ce que la fiche de poste indique.",
  "context": "Organisation: TechCorp, Équipe: Platform",
  "condition": "Candidat avec Docker mais sans certification cloud",
  "consequence": "Priorité élevée malgré absence de certification",
  "confidence": 0.85,
  "validationCount": 15,
  "successRate": 0.80,
  "lastValidated": "2026-07-15",
  "status": "active",
  "example": "3 derniers recrutements réussis avaient Docker mais pas de certification cloud"
}
```

**Pattern prédicteur :**
```json
{
  "patternId": "PP-001",
  "description": "Les candidats qui réussissent ici partagent systématiquement ces caractéristiques",
  "characteristics": [
    "Expérience en environnement startup",
    "Capacité d'autonomie élevée",
    "Soft skills de communication forts"
  ],
  "successRate": 0.90,
  "sampleSize": 20,
  "lastObserved": "2026-07-20",
  "confidence": 0.88
}
```

**Anti-pattern :**
```json
{
  "patternId": "AP-001",
  "description": "Les profils qui partent avant 1 an présentent souvent ces caractéristiques",
  "characteristics": [
    "Expérience uniquement en grandes entreprises",
    "Manque d'autonomie",
    "Attente de processus structurés"
  ],
  "failureRate": 0.75,
  "sampleSize": 8,
  "lastObserved": "2026-06-30",
  "confidence": 0.70,
  "mitigation": "Vérifier l'adaptabilité au contexte startup en entretien"
}
```

### 7.4 Schéma SQL

```sql
CREATE TABLE accumulated_learnings (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) UNIQUE NOT NULL,
  context_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  
  contextual_rules JSON NOT NULL,
  local_predictor_patterns JSON NOT NULL,
  anti_patterns JSON NOT NULL,
  validation_stats JSON NOT NULL,
  
  CONSTRAINT fk_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id),
  CONSTRAINT fk_context FOREIGN KEY (context_id) REFERENCES organizational_context(id)
);

CREATE INDEX idx_learnings_recruiter ON accumulated_learnings(recruiter_id);
CREATE INDEX idx_learnings_context ON accumulated_learnings(context_id);
```

---

## 8. Intégration des Couches

### 8.1 Flux de Données

```
Décision du recruteur
    ↓
COUCHE 1 : Mise à jour des préférences implicites
    ↓
COUCHE 2 : Ajout à l'historique (anonymisé)
    ↓
COUCHE 3 : Mise à jour du contexte organisationnel
    ↓
COUCHE 4 : Génération d'apprentissages
    ↓
Personnalisation des recommandations futures
```

### 8.2 Interface d'Intégration

```typescript
interface MemoryLayer {
  // COUCHE 1
  preferenceProfile: RecruiterPreferenceProfile;
  
  // COUCHE 2
  decisionHistory: DecisionHistory[];
  
  // COUCHE 3
  organizationalContext: OrganizationalContext;
  
  // COUCHE 4
  accumulatedLearnings: AccumulatedLearnings;
  
  // Méthodes
  updateFromDecision(decision: Decision): Promise<void>;
  getPersonalizedRecommendation(candidate: Candidate, job: Job): Promise<PersonalizedRecommendation>;
  detectBias(): Promise<BiasAlert[]>;
  pruneObsoleteData(): Promise<void>;
}
```

---

## 9. Personnalisation des Recommandations

### 9.1 Recommandation Sans Mémoire

```typescript
interface GenericRecommendation {
  globalScore: number;
  recommendation: string;
  confidence: string;
  dimensions: DimensionScores;
  skills: SkillEvaluations;
}
```

**Exemple :**
```
"Ce candidat correspond à 82% des critères du poste."
```

### 9.2 Recommandation Avec Mémoire

```typescript
interface PersonalizedRecommendation extends GenericRecommendation {
  personalizedInsights: {
    profileMatch: {
      matchesSuccessfulProfiles: boolean;
      similarSuccessfulHires: number;
      matchDescription: string;
    };
    managerFit: {
      matchesManagerPreferences: boolean;
      managerId: string;
      fitDescription: string;
    };
    contextualVigilance: {
      hasRisk: boolean;
      riskDescription: string;
      mitigation?: string;
    };
  };
}
```

**Exemple :**
```
"Ce candidat correspond à 82% des critères du poste.
Dans votre contexte spécifique :
→ Il correspond au profil des 3 derniers recrutements réussis dans cette équipe.
→ Son rapport certifications / expérience correspond à la préférence observée de votre manager [Rôle X].
→ Point de vigilance personnalisé : les profils similaires ont eu tendance à partir après 18 mois dans votre contexte. Vérifier les motivations long terme."
```

### 9.3 Algorithme de Personnalisation

```typescript
async function getPersonalizedRecommendation(
 candidate: Candidate,
 job: Job,
 memory: MemoryLayer
): Promise<PersonalizedRecommendation> {
  // Recommandation générique
  const generic = await getGenericRecommendation(candidate, job);
  
  // Personnalisation COUCHE 1
  const preferenceInsights = applyPreferenceInsights(candidate, memory.preferenceProfile);
  
  // Personnalisation COUCHE 2
  const historyInsights = applyHistoryInsights(candidate, memory.decisionHistory);
  
  // Personnalisation COUCHE 3
  const contextInsights = applyContextInsights(candidate, memory.organizationalContext);
  
  // Personnalisation COUCHE 4
  const learningInsights = applyLearningInsights(candidate, memory.accumulatedLearnings);
  
  return {
    ...generic,
    personalizedInsights: {
      profileMatch: historyInsights.profileMatch,
      managerFit: contextInsights.managerFit,
      contextualVigilance: learningInsights.contextualVigilance
    }
  };
}
```

---

## 10. Stockage et Sécurité

### 10.1 Chiffrement

Toutes les données de la mémoire sont chiffrées :

- **Au repos** : AES-256
- **En transit** : TLS 1.3
- **Clés de chiffrement** : Gérées par KMS (Key Management Service)

### 10.2 Isolation

Chaque recruteur a sa mémoire isolée :

- **Séparation logique** : Chaque recruteur a son propre ID
- **Séparation physique** : Données stockées dans des partitions séparées
- **Pas de partage** : Aucun partage de données entre recruteurs

### 10.3 Sauvegarde

- **Fréquence** : Quotidienne
- **Rétention** : 30 jours
- **Localisation** : Redondance géographique
- **Restauration** : Tests mensuels

---

## 11. Performance

### 11.1 Objectifs de Performance

| Opération | Temps cible | Temps maximum |
|-----------|-------------|---------------|
| Lecture mémoire complète | < 100 ms | 500 ms |
| Mise à jour après décision | < 50 ms | 200 ms |
| Génération recommandation personnalisée | < 200 ms | 1 s |
| Détection de biais | < 500 ms | 2 s |
| Prune de données obsolètes | < 5 min | 15 min |

### 11.2 Optimisation

- **Indexation** : Index sur tous les champs de recherche fréquents
- **Cache** : Cache Redis pour les données fréquemment accédées
- **Lazy loading** : Chargement différé des couches moins utilisées
- **Batch processing** : Traitement par lot pour les mises à jour massives

---

## 12. Conclusion

L'architecture de la mémoire en 4 couches permet :

- **Personnalisation** des recommandations au contexte du recruteur
- **Apprentissage** continu des préférences et patterns
- **Adaptation** à l'environnement organisationnel
- **Amélioration** de la pertinence des recommandations
- **Conformité RGPD** avec anonymisation et contrôle du recruteur
- **Détection de biais** pour prévenir la discrimination
