# DOC-009-04 : Template Rapport d'Audit Juridique

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le template du rapport d'audit juridique pour MVP-009 Explainability. Ce rapport fournit une preuve de non-discrimination en cas de contentieux, avec horodatage, signature numérique et traçabilité complète des règles appliquées.

---

## 2. Principe Fondateur

En cas de contentieux de recrutement, le moteur doit prouver que sa recommandation était non discriminatoire. L'arbre de décision = bouclier juridique. Le rapport d'audit juridique est horodaté, signé électroniquement et archivé selon la durée légale.

---

## 3. Structure du Rapport d'Audit

### 3.1 En-tête

```typescript
interface AuditReportHeader {
  reportId: string;
  reportType: 'legal_audit';
  timestamp: Date;
  digitalSignature: DigitalSignature;
  legalReference: string;
  
  generatingEntity: {
    company: string;
    legalEntity: string;
    address: string;
    siren: string;
  };
  
  caseIdentification: {
    candidateIdHash: string;
    jobIdHash: string;
    decisionDate: Date;
    decisionMaker: string;
  };
}
```

### 3.2 Corps du Rapport

```typescript
interface AuditReportBody {
  // Section 1 : Décision
  decision: DecisionSection;
  
  // Section 2 : Preuve de non-discrimination
  nonDiscriminationProof: NonDiscriminationProofSection;
  
  // Section 3 : Raisonnement complet
  completeReasoning: CompleteReasoningSection;
  
  // Section 4 : Conformité légale
  legalCompliance: LegalComplianceSection;
  
  // Section 5 : Archivage
  archiving: ArchivingSection;
}
```

---

## 4. Section 1 : Décision

### 4.1 Structure

```typescript
interface DecisionSection {
  recommendation: {
    decision: 'recommend' | 'not_recommend' | 'recommend_with_conditions' | 'insufficient_data';
    confidence: 'high' | 'medium' | 'low';
    globalScore: number;
    timestamp: Date;
  };
  
  justification: {
    summary: string;
    keyArguments: string[];
    determiningFactors: string[];
  };
  
  humanInvolvement: {
    humanReviewed: boolean;
    humanReviewer?: string;
    humanDecision?: string;
    humanOverride?: boolean;
  };
}
```

### 4.2 Template

```
┌─────────────────────────────────────────┐
│ SECTION 1 — DÉCISION                   │
├─────────────────────────────────────────┤
│                                         │
│ RECOMMANDATION DU SYSTÈME              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Décision        : ✅ Candidat recommandé│
│ Score global    : 82/100               │
│ Confiance       : Élevée               │
│ Horodatage      : 2026-08-03T14:30:45.123Z│
│                                         │
│ JUSTIFICATION                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Résumé :                                │
│ Candidat recommandé avec forte confiance│
│ grâce à une excellente adéquation      │
│ technique et une expérience pertinente. │
│                                         │
│ Arguments clés :                        │
│ 1. Excellente maîtrise de Python, Docker│
│    et Kubernetes (score technique 78/100)│
│ 2. 5 ans d'expérience pertinente en    │
│    environnement cloud (score exp 85/100)│
│ 3. Certifications AWS et Google Cloud │
│    validées (score certifications 90/100)│
│                                         │
│ Facteurs déterminants :                │
│ - Compétence technique (40%)            │
│ - Expérience sectorielle (30%)          │
│ - Contexte équipe (20%)                 │
│ - Soft skills (10%)                     │
│                                         │
│ INTERVENTION HUMAINE                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Revue humaine    : ✅ Oui                │
│ Relecteur         : Marie Dupont         │
│ Décision humaine  : ✅ Confirme          │
│ Override          : Non                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Section 2 : Preuve de Non-Discrimination

### 5.1 Structure

```typescript
interface NonDiscriminationProofSection {
  biasCheck: {
    checked: boolean;
    timestamp: Date;
    results: {
      noCorrelationWithProhibitedCriteria: boolean;
      balancedDistribution: boolean;
      noDiscriminatoryPattern: boolean;
    };
    details: {
      prohibitedCriteria: string[];
      correlationResults: CorrelationResult[];
      distributionAnalysis: DistributionAnalysis;
      patternAnalysis: PatternAnalysis;
    };
  };
  
  ruleCompliance: {
    checked: boolean;
    timestamp: Date;
    results: {
      rh000Compliance: boolean;
      rh860Compliance: boolean;
      gdprCompliance: boolean;
    };
    details: {
      appliedRules: AppliedRule[];
      ruleReferences: string[];
      complianceChecks: ComplianceCheck[];
    };
  };
  
  dataTraceability: {
    checked: boolean;
    timestamp: Date;
    results: {
      allSourcesDocumented: boolean;
      allRulesCited: boolean;
      allStepsTimestamped: boolean;
      digitalSignatureValid: boolean;
    };
    details: {
      dataSources: DataSource[];
      ruleApplications: RuleApplication[];
      stepTimestamps: StepTimestamp[];
      signatureVerification: SignatureVerification;
    };
  };
}
```

### 5.2 Template

```
┌─────────────────────────────────────────┐
│ SECTION 2 — PREUVE DE NON-DISCRIMINATION│
├─────────────────────────────────────────┤
│                                         │
│ VÉRIFICATION DES BIAIS                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Vérification effectuée : ✅ Oui         │
│ Horodatage : 2026-08-03T14:30:45.124Z   │
│                                         │
│ Résultats :                             │
│ ✅ Aucune corrélation avec critères     │
│    prohibés (âge, genre, origine, etc.) │
│ ✅ Distribution équilibrée des décisions │
│ ✅ Absence de pattern discriminatoire    │
│                                         │
│ Détails :                              │
│ Critères prohibés vérifiés :            │
│ - Âge                                  │
│ - Genre                                │
│ - Origine ethnique                     │
│ - Religion                             │
│ - Orientation sexuelle                 │
│ - Handicap                             │
│                                         │
│ Résultats de corrélation :              │
│ - Âge : p = 0.45 (non significatif)    │
│ - Genre : p = 0.52 (non significatif)   │
│ - Origine : p = 0.38 (non significatif) │
│                                         │
│ Distribution des décisions :            │
│ - Hommes : 52% retenus / 48% refusés    │
│ - Femmes : 48% retenues / 52% refusées  │
│ (Écart < 5%, distribution équilibrée)    │
│                                         │
│ CONFORMITÉ AUX RÈGLES                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Vérification effectuée : ✅ Oui         │
│ Horodatage : 2026-08-03T14:30:45.125Z   │
│                                         │
│ Résultats :                             │
│ ✅ RH-000 (Principes éthiques)          │
│ ✅ RH-860 (Conformité)                  │
│ ✅ RGPD (Protection des données)         │
│                                         │
│ Règles appliquées :                     │
│ - KP-05 Compétences v2.1                │
│ - KP-01 Recrutement v1.8                │
│ - Règle R-140-07 : Transfert container  │
│                                         │
│ Références légales :                   │
│ - Code du travail - Article L1132-1      │
│ - Loi Informatique & Libertés            │
│ - RGPD - Articles 22, 9, 21             │
│                                         │
│ TRAÇABILITÉ DES DONNÉES                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Vérification effectuée : ✅ Oui         │
│ Horodatage : 2026-08-03T14:30:45.126Z   │
│                                         │
│ Résultats :                             │
│ ✅ Toutes les sources documentées       │
│ ✅ Toutes les règles appliquées citées  │
│ ✅ Horodatage de chaque étape           │
│ ✅ Signature numérique valide            │
│                                         │
│ Sources de données :                    │
│ - CV du candidat (hash : a1b2c3...)     │
│ - Fiche de poste (hash : d4e5f6...)     │
│ - Knowledge Pack RH v1                  │
│                                         │
│ Horodatage des étapes :                 │
│ - Extraction CV : 14:30:45.100Z        │
│ - Analyse compétences : 14:30:45.110Z  │
│ - Calcul score : 14:30:45.120Z          │
│ - Génération rapport : 14:30:45.130Z   │
│                                         │
│ Signature numérique :                   │
│ Algorithme : RSA-2048                   │
│ Hash : SHA-256                          │
│ Signature valide : ✅ Oui                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. Section 3 : Raisonnement Complet

### 6.1 Structure

```typescript
interface CompleteReasoningSection {
  level1: Level1Summary;
  level2: Level2Dimensions;
  level3: Level3Detail;
  level4: Level4Transfer;
  level5: Level5Traceability;
  
  methodology: {
    engineVersion: string;
    algorithmDescription: string;
    weightingMethodology: string;
    transferPatternMethodology: string;
  };
  
  assumptions: {
    hypotheses: Hypothesis[];
    limitations: string[];
    uncertainties: string[];
  };
}
```

### 6.2 Template

```
┌─────────────────────────────────────────┐
│ SECTION 3 — RAISONNEMENT COMPLET        │
├─────────────────────────────────────────┤
│                                         │
│ NIVEAU 1 — SYNTHÈSE                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 1 complet]              │
│                                         │
│ NIVEAU 2 — DIMENSIONS                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 2 complet]              │
│                                         │
│ NIVEAU 3 — COMPÉTENCES                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 3 complet]              │
│                                         │
│ NIVEAU 4 — TRANSFERT                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 4 complet]              │
│                                         │
│ NIVEAU 5 — SOURCES                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 5 complet]              │
│                                         │
│ MÉTHODOLOGIE                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Version du moteur : MVP-007 v1.2         │
│ Algorithme : Évaluation multi-critères   │
│ Pondération : Technique 40% / Exp 30% /  │
│               Context 20% / Soft 10%    │
│ Patterns de transfert : KP-05 v2.1      │
│                                         │
│ HYPOTHÈSES POSÉES                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ 1. Soft skills inférés à partir de      │
│    l'expérience de management           │
│ 2. Capacité d'apprentissage rapide       │
│    déduite de la progression de carrière│
│ 3. Adéquation culturelle supposée       │
│    basée sur le secteur d'activité       │
│                                         │
│ LIMITATIONS                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ 1. Soft skills non confirmés (absence    │
│    d'entretien)                         │
│ 2. Motivation non évaluée (absence de    │
│    lettre de motivation)                │
│ 3. Disponibilité géographique non        │
│    précisée                             │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. Section 4 : Conformité Légale

### 7.1 Structure

```typescript
interface LegalComplianceSection {
  gdprArticle22: {
    compliant: boolean;
    explanationProvided: boolean;
    rightToHumanIntervention: boolean;
    rightToExplanation: boolean;
    rightToCorrection: boolean;
    rightToAppeal: boolean;
  };
  
  frenchDataProtectionLaw: {
    compliant: boolean;
    dataProcessingRegistered: boolean;
    dataSecurityMeasures: boolean;
    dataRetentionCompliant: boolean;
  };
  
  antiDiscriminationLaw: {
    compliant: boolean;
    noDiscriminatoryCriteria: boolean;
    equalTreatment: boolean;
    objectiveJustification: boolean;
  };
  
  laborLaw: {
    compliant: boolean;
    recruitmentProcessCompliant: boolean;
    documentationCompliant: boolean;
    retentionPeriodCompliant: boolean;
  };
}
```

### 7.2 Template

```
┌─────────────────────────────────────────┐
│ SECTION 4 — CONFORMITÉ LÉGALE           │
├─────────────────────────────────────────┤
│                                         │
│ RGPD ARTICLE 22                        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Conformité : ✅ Oui                     │
│                                         │
| Vérifications :                        │
│ ✅ Explication fournie                  │
│ ✅ Droit à l'intervention humaine       │
│ ✅ Droit à l'explication                │
│ ✅ Droit à la correction                │
│ ✅ Droit de recours                       │
│                                         │
│ LOI INFORMATIQUE & LIBERTÉS             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Conformité : ✅ Oui                     │
│                                         │
| Vérifications :                        │
│ ✅ Traitement des données enregistré     │
│ ✅ Mesures de sécurité en place         │
│ ✅ Conservation des données conforme    │
│                                         │
│ LOI ANTI-DISCRIMINATION                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Conformité : ✅ Oui                     │
│                                         │
| Vérifications :                        │
│ ✅ Aucun critère discriminatoire utilisé│
│ ✅ Traitement égal des candidats        │
│ ✅ Justification objective               │
│                                         │
│ CODE DU TRAVAIL                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Conformité : ✅ Oui                     │
│                                         │
| Vérifications :                        │
│ ✅ Processus de recrutement conforme    │
│ ✅ Documentation conforme               │
│ ✅ Période de conservation conforme    │
│                                         │
│ RÉFÉRENCES LÉGALES                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| - RGPD - Articles 22, 9, 21             │
| - Loi Informatique & Libertés révisée   │
| - Code du travail - Article L1132-1      │
| - Code pénal - Articles 225-1, 225-2     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Section 5 : Archivage

### 8.1 Structure

```typescript
interface ArchivingSection {
  retention: {
    retentionPeriod: string;
    retentionStartDate: Date;
    retentionEndDate: Date;
    legalBasis: string;
  };
  
  storage: {
    storageLocation: string;
    storageType: string;
    securityMeasures: string[];
    accessControl: string;
    backupPolicy: string;
  };
  
  integrity: {
    hash: string;
    digitalSignature: string;
    timestamp: Date;
    verificationMethod: string;
  };
  
  access: {
    authorizedParties: string[];
    accessLog: AccessLog[];
    retentionPolicy: string;
  };
}
```

### 8.2 Template

```
┌─────────────────────────────────────────┐
│ SECTION 5 — ARCHIVAGE                  │
├─────────────────────────────────────────┤
│                                         │
│ CONSERVATION                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Durée de conservation : 5 ans            │
| Date de début : 03/08/2026               │
| Date de fin : 03/08/2031                 │
| Base légale : Code du travail           │
│                                         │
| STOCKAGE                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Lieu de stockage : [sécurisé]           │
| Type de stockage : Cloud chiffré        │
|                                         │
| Mesures de sécurité :                  │
| - Chiffrement AES-256                   │
| - Contrôle d'accès multi-factor         │
| - Sauvegarde quotidienne                │
| - Redondance géographique               │
│                                         │
| Contrôle d'accès : Restreint            │
| - DPO                                  │
| - Service juridique                     │
| - Direction RH                          │
│                                         │
| Politique de sauvegarde : Quotidienne   │
│                                         │
| INTÉGRITÉ                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Hash du document : [hash SHA-256]       │
| Signature numérique : [signature]        │
| Horodatage : 2026-08-03T14:30:45.130Z    │
| Méthode de vérification : RSA-2048      │
│                                         │
| ACCÈS                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Parties autorisées :                   │
│ - DPO (Data Protection Officer)         │
│ - Service juridique                     │
│ - Direction RH                          │
│ - Magistrat (sur ordonnance judiciaire) │
│                                         │
| Journal d'accès :                      │
| - 03/08/2026 14:30:45 - DPO - Consultation│
│ - 04/08/2026 09:15:22 - Juridique - Consultation│
│                                         │
| Politique d'accès :                    │
| - Accès en lecture uniquement           │
| - Journal d'accès obligatoire          │
| - Audit trimestriel                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 9. Signature Numérique

### 9.1 Structure

```typescript
interface DigitalSignature {
  algorithm: 'RSA-2048' | 'RSA-4096' | 'ECDSA-P256';
  hashAlgorithm: 'SHA-256' | 'SHA-384' | 'SHA-512';
  documentHash: string;
  signature: string;
  certificate: string;
  timestamp: Date;
  timestampAuthority?: string;
  
  signer: {
    name: string;
    role: string;
    organization: string;
    contactEmail: string;
  };
  
  verification: {
    valid: boolean;
    verificationDate: Date;
    verificationMethod: string;
  };
}
```

### 9.2 Processus de Signature

```typescript
async function signAuditReport(report: AuditReport): DigitalSignature {
  // Génération du hash du document
  const documentHash = crypto.createHash('sha256').update(JSON.stringify(report)).digest('hex');
  
  // Signature avec la clé privée
  const signature = crypto.sign('RSA-SHA256', Buffer.from(documentHash), privateKey);
  
  // Horodatage via autorité de certification
  const timestamp = await getTimestampFromAuthority();
  
  return {
    algorithm: 'RSA-2048',
    hashAlgorithm: 'SHA-256',
    documentHash,
    signature: signature.toString('base64'),
    certificate: publicKey,
    timestamp,
    timestampAuthority: 'timestamp-authority.example.com',
    signer: {
      name: 'Jean Martin',
      role: 'DPO',
      organization: 'Trajectoire',
      contactEmail: 'dpo@trajectoire.com'
    },
    verification: {
      valid: true,
      verificationDate: new Date(),
      verificationMethod: 'RSA-2048-SHA256'
    }
  };
}
```

---

## 10. Génération du Rapport

### 10.1 Processus de Génération

```typescript
async function generateAuditReport(
 candidateId: string,
 jobId: string
): Promise<AuditReport> {
  // Récupération de l'arbre de décision
  const decisionTree = await getDecisionTree(candidateId, jobId);
  
  // Section 1 : Décision
  const decision = generateDecisionSection(decisionTree);
  
  // Section 2 : Preuve de non-discrimination
  const nonDiscriminationProof = await generateNonDiscriminationProof(decisionTree);
  
  // Section 3 : Raisonnement complet
  const completeReasoning = generateCompleteReasoning(decisionTree);
  
  // Section 4 : Conformité légale
  const legalCompliance = await generateLegalCompliance(decisionTree);
  
  // Section 5 : Archivage
  const archiving = generateArchivingSection();
  
  // Signature numérique
  const digitalSignature = await signAuditReport({
    decision,
    nonDiscriminationProof,
    completeReasoning,
    legalCompliance,
    archiving
  });
  
  const report: AuditReport = {
    header: {
      reportId: generateUUID(),
      reportType: 'legal_audit',
      timestamp: new Date(),
      digitalSignature,
      legalReference: 'RGPD Art. 22 / Code du travail L1132-1',
      generatingEntity: {
        company: 'Trajectoire',
        legalEntity: 'Trajectoire SAS',
        address: '123 Rue de la Tech, 75001 Paris',
        siren: '123 456 789'
      },
      caseIdentification: {
        candidateIdHash: hash(candidateId),
        jobIdHash: hash(jobId),
        decisionDate: new Date(),
        decisionMaker: 'MVP-007 v1.2'
      }
    },
    body: {
      decision,
      nonDiscriminationProof,
      completeReasoning,
      legalCompliance,
      archiving
    }
  };
  
  return report;
}
```

### 10.2 Validation du Rapport

```typescript
function validateAuditReport(report: AuditReport): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Vérification 1 : Signature valide
  if (!report.header.digitalSignature.verification.valid) {
    errors.push('Signature numérique invalide');
  }
  
  // Vérification 2 : Conformité légale
  if (!report.body.legalCompliance.gdprArticle22.compliant) {
    errors.push('Non-conformité RGPD Article 22');
  }
  
  if (!report.body.legalCompliance.antiDiscriminationLaw.compliant) {
    errors.push('Non-conformité loi anti-discrimination');
  }
  
  // Vérification 3 : Preuve de non-discrimination
  if (!report.body.nonDiscriminationProof.biasCheck.results.noCorrelationWithProhibitedCriteria) {
    errors.push('Corrélation avec critères prohibés détectée');
  }
  
  // Vérification 4 : Traçabilité
  if (!report.body.nonDiscriminationProof.dataTraceability.results.allSourcesDocumented) {
    warnings.push('Sources non toutes documentées');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

## 11. Stockage et Archivage

### 11.1 Stockage

```sql
CREATE TABLE audit_reports (
  id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36) UNIQUE NOT NULL,
  report_type VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  candidate_id_hash VARCHAR(64) NOT NULL,
  job_id_hash VARCHAR(64) NOT NULL,
  decision_date TIMESTAMP NOT NULL,
  
  header JSON NOT NULL,
  body JSON NOT NULL,
  
  digital_signature JSON NOT NULL,
  
  retention_start_date TIMESTAMP NOT NULL,
  retention_end_date TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_report_id ON audit_reports(report_id);
CREATE INDEX idx_audit_candidate ON audit_reports(candidate_id_hash);
CREATE INDEX idx_audit_retention ON audit_reports(retention_end_date);
```

### 11.2 Politique de Conservation

- **Durée de conservation** : 5 ans (conformité Code du travail)
- **Date de début** : Date de génération du rapport
- **Date de fin** : 5 ans après la date de début
- **Base légale** : Code du travail - Article L1132-1
- **Destruction** : Destruction automatique après expiration

---

## 12. Accès et Consultation

### 12.1 Autorisations

Seules les parties autorisées peuvent accéder aux rapports d'audit :

| Rôle | Accès | Motif |
|------|-------|-------|
| DPO | Lecture complète | Conformité RGPD |
| Service juridique | Lecture complète | Défense juridique |
| Direction RH | Lecture complète | Gestion RH |
| Magistrat | Lecture complète (sur ordonnance) | Contentieux |
| Candidat | Aucun | Données anonymisées uniquement |

### 12.2 Journal d'Accès

Chaque accès est journalisé :

```sql
CREATE TABLE audit_report_access_log (
  id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36) NOT NULL,
  access_date TIMESTAMP NOT NULL,
  accessor_id VARCHAR(36) NOT NULL,
  accessor_role VARCHAR(50) NOT NULL,
  access_type VARCHAR(20) NOT NULL,
  justification TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_access_report ON audit_report_access_log(report_id);
CREATE INDEX idx_access_date ON audit_report_access_log(access_date);
```

---

## 13. Export et Impression

### 13.1 Export PDF

Le rapport peut être exporté en PDF avec signature intégrée :

```typescript
async function exportAuditReportToPDF(report: AuditReport): Promise<Buffer> {
  const pdf = await generatePDF({
    content: report,
    signature: report.header.digitalSignature,
    watermark: 'DOCUMENT CONFIDENTIEL - USAGE JURIDIQUE UNIQUEMENT'
  });
  
  return pdf;
}
```

### 13.2 Impression Sécurisée

L'impression est sécurisée :

- Filigrane "CONFIDENTIEL"
- Numéro de rapport
- Hash du document
- Signature visible

---

## 14. Conclusion

Le template du rapport d'audit juridique garantit :

- **Preuve de non-discrimination** en cas de contentieux
- **Horodatage précis** de chaque étape
- **Signature numérique** cryptographique
- **Traçabilité complète** des règles appliquées
- **Conformité légale** (RGPD, Code du travail)
- **Archivage sécurisé** selon durée légale
- **Accès contrôlé** et journalisé
- **Bouclier juridique** pour l'entreprise
