# DOC-008-05 : Processus de Validation Humaine des Mises à Jour (Garde-Fou 2)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le processus de validation humaine des mises à jour du moteur d'apprentissage. Aucune modification de règle fondamentale ne peut être injectée automatiquement sans validation humaine obligatoire.

---

## 2. Principe Fondateur

Aucune modification de règle fondamentale ne peut être injectée automatiquement. Processus obligatoire :
- Proposition de modification générée
- Revue par DRH référent
- Validation avant activation
- Traçabilité de la décision

---

## 3. Types de Modifications

### 3.1 Classification des Modifications

```typescript
enum ModificationType {
  MINOR = 'minor',           // Ajustement de pondération mineur
  MAJOR = 'major',           // Ajustement de pondération majeur
  RULE = 'rule',             // Modification de règle fondamentale
  PATTERN = 'pattern',       // Ajout/modification de pattern de transfert
  ONTOLOGY = 'ontology'      // Modification de l'ontologie RH
}

enum ModificationSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}
```

### 3.2 Critères de Classification

| Type | Description | Exemple | Sévérité |
|------|-------------|---------|----------|
| MINOR | Ajustement de pondération < 10% | Poids Python : 0.8 → 0.85 | LOW |
| MAJOR | Ajustement de pondération ≥ 10% | Poids Python : 0.8 → 0.95 | MEDIUM |
| RULE | Modification de règle fondamentale | Nouvelle règle contextuelle | HIGH |
| PATTERN | Ajout/modification de pattern | Nouveau pattern de transfert | MEDIUM |
| ONTOLOGY | Modification de l'ontologie | Ajout de synonyme | HIGH |

---

## 4. Processus de Validation

### 4.1 Flux de Validation

```
PROPOSITION D'APPRENTISSAGE
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 1 : Classification        │ → Type et sévérité
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 2 : Génération du Rapport │ → Rapport détaillé
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 3 : Revue Technique      │ → Validation technique
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 4 : Revue Métier         │ → Validation métier
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 5 : Revue Éthique        │ → Validation éthique
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 6 : Décision Collégiale  │ → Approbation/Rejet
└─────────────────────────────────┘
    ↓
Si approuvé :
┌─────────────────────────────────┐
│ ÉTAPE 7 : Déploiement          │ → Application
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ ÉTAPE 8 : Monitoring           │ → Surveillance
└─────────────────────────────────┘
```

---

## 5. Étape 1 : Classification

### 5.1 Algorithme de Classification

```typescript
function classifyModification(proposal: LearningProposal): Classification {
  const type = determineType(proposal);
  const severity = determineSeverity(type, proposal);
  
  return {
    type,
    severity,
    requiresHumanValidation: type !== ModificationType.MINOR,
    requiresCommitteeApproval: severity === ModificationSeverity.CRITICAL
  };
}

function determineType(proposal: LearningProposal): ModificationType {
  if (proposal.type === 'weight_adjustment') {
    const magnitude = Math.abs(proposal.proposedValue - proposal.currentValue) / proposal.currentValue;
    return magnitude < 0.1 ? ModificationType.MINOR : ModificationType.MAJOR;
  }
  
  if (proposal.type === 'rule_modification') {
    return ModificationType.RULE;
  }
  
  if (proposal.type === 'pattern_learning') {
    return ModificationType.PATTERN;
  }
  
  if (proposal.type === 'ontology_learning') {
    return ModificationType.ONTOLOGY;
  }
  
  return ModificationType.MAJOR;
}

function determineSeverity(type: ModificationType, proposal: LearningProposal): ModificationSeverity {
  if (type === ModificationType.MINOR) return ModificationSeverity.LOW;
  if (type === ModificationType.MAJOR) return ModificationSeverity.MEDIUM;
  if (type === ModificationType.PATTERN) return ModificationSeverity.MEDIUM;
  if (type === ModificationType.ONTOLOGY) return ModificationSeverity.HIGH;
  if (type === ModificationType.RULE) return ModificationSeverity.HIGH;
  
  return ModificationSeverity.MEDIUM;
}
```

### 5.2 Règles de Validation

| Type | Validation Requise | Approbateur |
|------|---------------------|-------------|
| MINOR | Validation automatique si confiance > 0.8 | Système |
| MAJOR | Validation humaine obligatoire | DRH Référent |
| RULE | Validation humaine + comité | Comité de Gouvernance |
| PATTERN | Validation humaine obligatoire | DRH Référent + Expert Technique |
| ONTOLOGY | Validation humaine + comité | Comité de Gouvernance |

---

## 6. Étape 2 : Génération du Rapport

### 6.1 Structure du Rapport

```typescript
interface ValidationReport {
  id: string;
  timestamp: Date;
  proposalId: string;
  
  // Classification
  classification: Classification;
  
  // Proposition
  proposal: LearningProposal;
  
  // Justification
  justification: {
    dataDriven: string;
    statisticalSignificance: number;
    confidence: number;
    feedbackCount: number;
    expectedImpact: string;
  };
  
  // Risques
  risks: {
    biasRisk: 'low' | 'medium' | 'high';
    overfittingRisk: 'low' | 'medium' | 'high';
    ethicalRisk: 'low' | 'medium' | 'high';
    legalRisk: 'low' | 'medium' | 'high';
  };
  
  // Recommandation
  recommendation: 'approve' | 'reject' | 'review';
  recommendationReason: string;
  
  // Métadonnées
  metadata: {
    engineVersion: string;
    learningCycle: string;
    proposer: 'system';
  };
}
```

### 6.2 Exemple de Rapport

```json
{
  "id": "report-001",
  "timestamp": "2026-08-03T14:30:45.123Z",
  "proposalId": "proposal-001",
  
  "classification": {
    "type": "major",
    "severity": "medium",
    "requiresHumanValidation": true,
    "requiresCommitteeApproval": false
  },
  
  "proposal": {
    "type": "weight_adjustment",
    "criterion": "Python",
    "context": {
      "sector": "Fintech"
    },
    "currentValue": 0.8,
    "proposedValue": 0.95,
    "confidence": 0.85,
    "feedbackCount": 45
  },
  
  "justification": {
    "dataDriven": "Basé sur 45 feedbacks concordants dans le secteur Fintech",
    "statisticalSignificance": 0.03,
    "confidence": 0.85,
    "feedbackCount": 45,
    "expectedImpact": "Amélioration de 12% de l'accord moteur/humain dans le secteur Fintech"
  },
  
  "risks": {
    "biasRisk": "low",
    "overfittingRisk": "medium",
    "ethicalRisk": "low",
    "legalRisk": "low"
  },
  
  "recommendation": "approve",
  "recommendationReason": "Modification justifiée par les données, risques acceptables",
  
  "metadata": {
    "engineVersion": "1.0.0",
    "learningCycle": "2026-W31",
    "proposer": "system"
  }
}
```

---

## 7. Étape 3 : Revue Technique

### 7.1 Responsable

**Lead Technique MVP-008**

### 7.2 Critères de Validation Technique

- **Validité statistique** : Significativité statistique (p < 0.05)
- **Volume suffisant** : Nombre de feedbacks suffisant (selon seuils DOC-008-06)
- **Confiance acceptable** : Confiance ≥ 0.7
- **Cohérence technique** : Modification cohérente avec l'architecture existante
- **Absence de conflits** : Pas de conflit avec d'autres règles

### 7.3 Checklist de Validation Technique

```
□ Significativité statistique validée
□ Volume de feedbacks suffisant
□ Confiance ≥ 0.7
□ Cohérence technique vérifiée
□ Pas de conflit avec d'autres règles
□ Impact sur la performance évalué
□ Tests unitaires passés
□ Tests d'intégration passés
```

### 7.4 Décision Technique

```typescript
interface TechnicalValidation {
  approved: boolean;
  reviewer: string;
  timestamp: Date;
  comments: string;
  concerns: string[];
}
```

---

## 8. Étape 4 : Revue Métier

### 8.1 Responsable

**DRH Référent**

### 8.2 Critères de Validation Métier

- **Pertinence métier** : Modification pertinente pour le contexte métier
- **Alignement stratégie** : Alignement avec la stratégie RH
- **Acceptabilité** : Acceptabilité pour les recruteurs
- **Impact opérationnel** : Impact positif sur les opérations

### 8.3 Checklist de Validation Métier

```
□ Pertinence métier confirmée
□ Alignement stratégie RH vérifié
□ Acceptabilité pour les recruteurs évaluée
□ Impact opérationnel positif
□ Communication aux recruteurs planifiée
□ Formation nécessaire identifiée
```

### 8.4 Décision Métier

```typescript
interface BusinessValidation {
  approved: boolean;
  reviewer: string;
  timestamp: Date;
  comments: string;
  concerns: string[];
  communicationPlan?: string;
}
```

---

## 9. Étape 5 : Revue Éthique

### 9.1 Responsable

**Expert Conformité + DPO**

### 9.2 Critères de Validation Éthique

- **Conformité RH-000** : Respect des principes éthiques RH
- **Conformité RH-860** : Respect des exigences de conformité
- **Absence de biais** : Pas de risque d'amplification de biais
- **Conformité RGPD** : Respect des exigences RGPD

### 9.3 Checklist de Validation Éthique

```
□ Conformité RH-000 vérifiée
□ Conformité RH-860 vérifiée
□ Risque de biais évalué
□ Conformité RGPD vérifiée
□ Impact sur l'équité évalué
□ Documentation de conformité complète
```

### 9.4 Décision Éthique

```typescript
interface EthicalValidation {
  approved: boolean;
  reviewer: string;
  timestamp: Date;
  comments: string;
  concerns: string[];
  complianceReferences: string[];
}
```

---

## 10. Étape 6 : Décision Collégiale

### 10.1 Comité de Validation

Pour les modifications de sévérité HIGH ou CRITICAL, une décision collégiale est requise.

**Membres du Comité :**
- Lead Technique MVP-008
- DRH Référent
- Expert Conformité
- DPO
- Expert Éthique

### 10.2 Processus de Décision

```typescript
interface CommitteeDecision {
  proposalId: string;
  timestamp: Date;
  participants: string[];
  
  validations: {
    technical: TechnicalValidation;
    business: BusinessValidation;
    ethical: EthicalValidation;
  };
  
  finalDecision: 'approved' | 'rejected' | 'deferred';
  decisionReason: string;
  
  conditions?: string[];
  
  nextReviewDate?: Date;
}
```

### 10.3 Règles de Décision

| Validation | Approbation Requise | Décision si Rejet |
|------------|---------------------|-------------------|
| Technique | Oui | Rejet global |
| Métier | Oui | Rejet global |
| Éthique | Oui | Rejet global |

**Décision finale :**
- Approuvé si toutes les validations sont positives
- Rejeté si une validation est négative
- Différé si des informations supplémentaires sont requises

---

## 11. Étape 7 : Déploiement

### 11.1 Processus de Déploiement

```typescript
async function deployValidatedModification(decision: CommitteeDecision): DeploymentResult {
  // Archivage de la version actuelle
  await archiveCurrentVersion();
  
  // Application de la modification
  const result = await applyModification(decision.proposalId);
  
  // Tests de validation
  const validationResults = await runValidationTests();
  
  if (!validationResults.allPassed) {
    // Rollback automatique
    await rollbackToArchivedVersion();
    return {
      success: false,
      reason: 'Tests de validation échoués',
      rollbackPerformed: true
    };
  }
  
  // Activation
  await activateNewVersion();
  
  // Notification
  await notifyDeployment(decision);
  
  return {
    success: true,
    version: getNewVersion(),
    timestamp: new Date()
  };
}
```

### 11.2 Tests de Validation

**Tests obligatoires :**
- Test sur golden dataset (DOC-008-09)
- Test de mesure de l'accord moteur/humain (DOC-008-10)
- Test de filtre anti-biais (DOC-008-04)
- Test de performance

**Critères de succès :**
- Accord moteur/humain ≥ seuil actuel
- Pas de régression significative
- Performance ≥ seuil actuel

---

## 12. Étape 8 : Monitoring

### 12.1 Période de Monitoring

**Durée :** 30 jours après déploiement

### 12.2 Métriques Surveillées

| Métrique | Fréquence | Seuil d'Alerte |
|----------|-----------|---------------|
| Accord moteur/humain | Quotidien | Baisse > 5% |
| Taux de feedback positif | Hebdomadaire | Baisse > 10% |
| Performance du système | Quotidien | Baisse > 10% |
| Erreurs du système | Quotidien | Augmentation > 20% |

### 12.3 Actions en Cas d'Alerte

Si une alerte est déclenchée :

1. **Notification automatique** : Lead Technique + DRH Référent
2. **Analyse immédiate** : Investigation de la cause
3. **Décision** : Continuer / Ajuster / Rollback
4. **Traçabilité** : Enregistrement de la décision

---

## 13. Interface de Validation

### 13.1 Interface pour Modifications Mineures

Pour les modifications mineures (MINOR) avec confiance > 0.8 :

```
┌─────────────────────────────────────────┐
│ VALIDATION AUTOMATIQUE                 │
├─────────────────────────────────────────┤
│                                         │
│ Proposition :                           │
│ Ajustement pondération Python          │
│ 0.8 → 0.85 (+6.25%)                   │
│                                         │
│ Confiance : 85%                        │
│ Feedbacks : 45                          │
│ Significativité : p = 0.03             │
│                                         │
│ Risques :                               │
│ ○ Biais : Faible                        │
│ ○ Surapprentissage : Moyen             │
│ ○ Éthique : Faible                      │
│                                         │
│ Recommandation système : APPROUVÉ       │
│                                         │
│ [Voir détails]  [Surclasser et requérir validation manuelle] │
└─────────────────────────────────────────┘
```

### 13.2 Interface pour Modifications Majeures

Pour les modifications majeures (MAJOR, RULE, PATTERN, ONTOLOGY) :

```
┌─────────────────────────────────────────┐
│ VALIDATION HUMAINE REQUISE              │
├─────────────────────────────────────────┤
│                                         │
│ Proposition :                           │
│ Ajustement pondération Python          │
│ 0.8 → 0.95 (+18.75%)                  │
│                                         │
│ Classification : MAJOR                  │
│ Sévérité : MEDIUM                      │
│                                         │
│ Justification :                         │
│ Basé sur 45 feedbacks concordants      │
│ Significativité : p = 0.03             │
│ Impact attendu : +12% accord           │
│                                         │
│ Risques :                               │
│ ○ Biais : Faible                        │
│ ○ Surapprentissage : Moyen             │
│ ○ Éthique : Faible                      │
│                                         │
│ VALIDATION TECHNIQUE                    │
│ Status : ⏳ En attente                  │
│ [Approuver] [Rejeter] [Commenter]      │
│                                         │
│ VALIDATION MÉTIER                      │
│ Status : ⏳ En attente                  │
│ [Approuver] [Rejeter] [Commenter]      │
│                                         │
│ VALIDATION ÉTHIQUE                      │
│ Status : ⏳ En attente                  │
│ [Approuver] [Rejeter] [Commenter]      │
│                                         │
│ [Annuler]              [Soumettre]      │
└─────────────────────────────────────────┘
```

---

## 14. Traçabilité

### 14.1 Enregistrement de la Décision

Chaque décision de validation est enregistrée :

```typescript
interface ValidationDecisionRecord {
  id: string;
  proposalId: string;
  reportId: string;
  
  classification: Classification;
  
  validations: {
    technical?: TechnicalValidation;
    business?: BusinessValidation;
    ethical?: EthicalValidation;
  };
  
  committeeDecision?: CommitteeDecision;
  
  deployment?: {
    success: boolean;
    version: string;
    timestamp: Date;
  };
  
  monitoring?: {
    periodStart: Date;
    periodEnd: Date;
    metrics: MonitoringMetrics;
    alerts: Alert[];
    finalOutcome: 'continued' | 'adjusted' | 'rolled_back';
  };
  
  metadata: {
    createdAt: Date;
    createdBy: string;
    modifiedAt: Date;
    modifiedBy: string;
  };
}
```

### 14.2 Historique des Modifications

Le système maintient un historique complet de toutes les modifications :

```typescript
interface ModificationHistory {
  proposalId: string;
  proposal: LearningProposal;
  validationRecord: ValidationDecisionRecord;
  outcome: 'deployed' | 'rejected' | 'deferred' | 'rolled_back';
  impact: {
    beforeMetrics: Metrics;
    afterMetrics: Metrics;
    delta: MetricsDelta;
  };
}
```

---

## 15. Règles de Surclassement

### 15.1 Surclassement par DRH Référent

Le DRH Référent peut surclasser une validation automatique :

- **Motif :** Contexte métier non capturé par le système
- **Action :** Exiger validation humaine pour une modification mineure
- **Traçabilité :** Motif documenté

### 15.2 Surclassement par Comité

Le Comité peut surclasser une validation individuelle :

- **Motif :** Risque éthique ou juridique non détecté
- **Action :** Rejeter une modification approuvée individuellement
- **Traçabilité :** Motif documenté

---

## 16. Métriques de Suivi

### 16.1 Métriques de Validation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux d'approbation automatique | Modifications mineures approuvées automatiquement / total mineures | ≥ 70% |
| Taux d'approbation humaine | Modifications approuvées par validation humaine / total soumises | ≥ 80% |
| Temps moyen de validation | Temps entre proposition et décision | < 5 jours ouvrés |
| Taux de rollback | Rollbacks / déploiements | ≤ 5% |

### 16.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de faux positifs | Modifications approuvées mais rollbackées / total approuvées | ≤ 10% |
| Taux de faux négatifs | Modifications rejetées mais auraient été bénéfiques / total rejetées | ≤ 15% |
| Satisfaction DRH | Note moyenne de satisfaction des DRH | ≥ 4/5 |

---

## 17. Intégration avec les Autres Garde-Fous

### 17.1 Intégration avec Garde-Fou 1 (Filtre Anti-Biais)

Le filtre anti-biais (DOC-008-04) est exécuté avant la validation humaine :

- Si le lot est suspendu pour biais → Aucune proposition générée
- Si le lot est approuvé → Propositions générées pour validation

### 17.2 Intégration avec Garde-Fou 3 (Seuils de Déclenchement)

Les seuils de déclenchement (DOC-008-06) sont vérifiés avant génération de la proposition :

- Si seuils non atteints → Aucune proposition générée
- Si seuils atteints → Proposition générée pour validation

### 17.3 Intégration avec Garde-Fou 4 (Rollback)

Le protocole de rollback (DOC-008-07) est disponible si le déploiement échoue :

- Rollback automatique si tests échouent
- Rollback manuel si monitoring détecte des problèmes

---

## 18. Maintenance

### 18.1 Maintenance du Processus

Le processus de validation doit être maintenu :

- **Mise à jour des checklists** : Lors de l'évolution des exigences
- **Optimisation de l'interface** : Amélioration continue de l'UX
- **Surveillance des métriques** : Monitoring des temps de validation

### 18.2 Maintenance de la Base de Données

La base de données de validation doit être maintenue :

- **Archivage** : Archivage des décisions anciennes (> 2 ans)
- **Optimisation** : Optimisation des requêtes
- **Sauvegarde** : Sauvegarde régulière

---

## 19. Conclusion

Le processus de validation humaine garantit :

- **Validation systématique** de toutes les modifications
- **Revue multi-disciplinaire** (technique, métier, éthique)
- **Décision collégiale** pour les modifications critiques
- **Traçabilité complète** de toutes les décisions
- **Surveillance post-déploiement** pour détecter les problèmes
- **Rollback possible** en cas de problème
