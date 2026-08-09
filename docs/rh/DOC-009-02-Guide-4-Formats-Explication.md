# DOC-009-02 : Guide des 4 Formats d'Explication

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir les 4 formats d'explication disponibles dans MVP-009 Explainability. Chaque format est adapté à un usage spécifique : résumé exécutif pour les DRH pressés, analyse complète pour les DRH analytiques, rapport candidat pour les demandes RGPD, et rapport d'audit pour les besoins juridiques.

---

## 2. Principe Fondateur

L'explainability doit s'adapter au contexte d'utilisation. Un DRH pressé n'a pas besoin des mêmes détails qu'un juriste en cas de contentieux. 4 formats distincts permettent de répondre à tous les cas d'usage.

---

## 3. Vue d'Ensemble des Formats

| Format | Public Cible | Usage | Longueur | Détail |
|--------|--------------|-------|----------|--------|
| FORMAT 1 - Résumé exécutif | DRH pressé | Décision rapide | 1 page | Faible |
| FORMAT 2 - Analyse complète | DRH analytique | Compréhension approfondie | 3-5 pages | Élevé |
| FORMAT 3 - Rapport candidat | Candidat (RGPD Art. 22) | Droit à l'explication | 2-3 pages | Moyen |
| FORMAT 4 - Rapport d'audit | Juridique | Preuve de non-discrimination | 5-10 pages | Très élevé |

---

## 4. FORMAT 1 — Résumé Exécutif

### 4.1 Public Cible

**DRH pressé** qui a besoin d'une décision rapide sans entrer dans les détails techniques.

### 4.2 Objectif

Fournir une vue synthétique de la recommandation avec les arguments clés en une page maximum.

### 4.3 Structure

```typescript
interface ExecutiveSummary {
  header: {
    candidateName: string;
    jobTitle: string;
    date: Date;
  };
  
  recommendation: {
    decision: 'recommend' | 'not_recommend' | 'recommend_with_conditions' | 'insufficient_data';
    confidence: 'high' | 'medium' | 'low';
    globalScore: number; // 0-100
  };
  
  keyArguments: {
    argument1: string;
    argument2: string;
    argument3: string;
  };
  
  mainVigilance: {
    point: string;
    severity: 'low' | 'medium' | 'high';
  };
  
  summary: string; // 1 phrase résumant la décision
}
```

### 4.4 Template

```
┌─────────────────────────────────────────┐
│ RÉSUMÉ EXÉCUTIF                        │
├─────────────────────────────────────────┤
│                                         │
│ Candidat : Jean Dupont                 │
│ Poste    : Développeur DevOps          │
│ Date     : 03/08/2026                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RECOMMANDATION                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ ✅ Candidat recommandé                │
│ Score global : 82/100                   │
│ Confiance    : Élevée                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 3 ARGUMENTS CLÉS                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ 1. Excellente maîtrise de Python, Docker│
│    et Kubernetes (score technique 78/100)│
│                                         │
│ 2. 5 ans d'expérience pertinente en    │
│    environnement cloud (score exp 85/100)│
│                                         │
│ 3. Certifications AWS et Google Cloud │
│    validées (score certifications 90/100)│
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ POINT DE VIGILANCE                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ ⚠️ Soft skills non confirmés           │
│    (inférés à partir de l'expérience)   │
│    Sévérité : Moyenne                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ SYNTHÈSE                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Candidat recommandé avec forte confiance│
│ grâce à une excellente adéquation      │
│ technique et une expérience pertinente. │
│ Soft skills à confirmer en entretien.  │
│                                         │
│ [Voir l'analyse complète]               │
└─────────────────────────────────────────┘
```

### 4.5 Règles de Génération

- **Longueur maximale** : 1 page
- **Nombre d'arguments** : Exactement 3
- **Point de vigilance** : 1 maximum (le plus critique)
- **Langage** : Simple, non technique
- **Format** : Bullet points pour la lisibilité

---

## 5. FORMAT 2 — Analyse Complète

### 5.1 Public Cible

**DRH analytique** qui souhaite comprendre en détail le raisonnement du moteur.

### 5.2 Objectif

Fournir l'arbre de décision complet (5 niveaux) avec toutes les sources citées et toutes les hypothèses exposées.

### 5.3 Structure

```typescript
interface CompleteAnalysis {
  header: {
    candidateName: string;
    candidateId: string;
    jobTitle: string;
    jobId: string;
    date: Date;
    engineVersion: string;
  };
  
  level1: Level1Summary;
  level2: Level2Dimensions;
  level3: Level3Detail;
  level4: Level4Transfer;
  level5: Level5Traceability;
  
  appendix: {
    methodology: string;
    assumptions: string[];
    limitations: string[];
  };
}
```

### 5.4 Template

```
┌─────────────────────────────────────────┐
│ ANALYSE COMPLÈTE                        │
├─────────────────────────────────────────┤
│                                         │
│ Candidat : Jean Dupont                 │
│ Poste    : Développeur DevOps          │
│ Date     : 03/08/2026                  │
│ Version moteur : MVP-007 v1.2           │
│                                         │
│ [TABLE DES MATIÈRES]                   │
│ 1. Synthèse                            │
│ 2. Dimensions analysées                │
│ 3. Détail par compétence                │
│ 4. Raisonnement de transfert          │
│ 5. Sources & traçabilité              │
│ 6. Annexe                              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 1. SYNTHÈSE                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 1 complet]              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 2. DIMENSIONS ANALYSÉES                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 2 complet]              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 3. DÉTAIL PAR COMPÉTENCE                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 3 complet]              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 4. RAISONNEMENT DE TRANSFERT            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 4 complet]              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 5. SOURCES & TRAÇABILITÉ               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ [Contenu NIVEAU 5 complet]              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 6. ANNEXE                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Méthodologie :                          │
│ L'analyse est basée sur le moteur de    │
│ raisonnement MVP-007 qui évalue les     │
│ candidats selon 5 dimensions :          │
│ compétences techniques, expérience,     │
│ formation, soft skills et contexte.    │
│                                         │
│ Hypothèses posées :                     │
│ - Soft skills inférés à partir de      │
│   l'expérience de management           │
│ - Capacité d'apprentissage rapide       │
│   déduite de la progression de carrière│
│                                         │
│ Limitations :                           │
│ - Soft skills non confirmés (absence    │
│   d'entretien)                         │
│ - Motivation non évaluée (absence de    │
│   lettre de motivation)                │
│                                         │
│ [Exporter en PDF] [Imprimer]            │
└─────────────────────────────────────────┘
```

### 5.5 Règles de Génération

- **Longueur** : 3-5 pages
- **Contenu** : Arbre de décision complet (5 niveaux)
- **Sources** : Toutes les règles et KP cités
- **Hypothèses** : Toutes les hypothèses exposées
- **Format** : Structuré avec table des matières

---

## 6. FORMAT 3 — Rapport Candidat

### 6.1 Public Cible

**Candidat** qui demande une explication de la décision (RGPD Article 22).

### 6.2 Objectif

Fournir une explication de la décision compatible avec le droit à l'explication, avec les données sensibles expurgées.

### 6.3 Structure

```typescript
interface CandidateReport {
  header: {
    reportId: string;
    date: Date;
    candidateId: string; // anonymisé
    jobId: string; // anonymisé
  };
  
  decision: {
    recommendation: string;
    confidence: string;
    globalScore: number;
  };
  
  explanation: {
    positivePoints: string[];
    areasForImprovement: string[];
    missingElements: string[];
  };
  
  rights: {
    rightToExplanation: string;
    rightToCorrection: string;
    rightToAppeal: string;
  };
  
  contact: {
    dpoContact: string;
    hrContact: string;
  };
}
```

### 6.4 Template

```
┌─────────────────────────────────────────┐
│ RAPPORT D'EXPLICATION                  │
│ (Conformité RGPD Article 22)           │
├─────────────────────────────────────────┤
│                                         │
│ Référence : REP-2026-08-03-001         │
│ Date      : 03/08/2026                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ DÉCISION                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Suite à l'analyse de votre candidature   │
│ pour le poste de Développeur DevOps,     │
│ notre système de raisonnement a         │
│ émis la recommandation suivante :        │
│                                         │
│ ✅ Candidat recommandé                │
│ Score global : 82/100                   │
│ Confiance    : Élevée                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ EXPLICATION DE LA DÉCISION              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Points forts identifiés :                │
│                                         │
│ 1. Excellente maîtrise de Python, Docker│
│    et Kubernetes                        │
│                                         │
│ 2. 5 ans d'expérience pertinente en     │
│    environnement cloud                  │
│                                         │
│ 3. Certifications AWS et Google Cloud   │
│    validées                             │
│                                         │
│ Points d'amélioration possibles :       │
│                                         │
│ 1. Expérience avec Terraform pourrait   │
│    être un atout supplémentaire         │
│                                         │
│ 2. Expérience en environnement         │
│    Kubernetes de production             │
│                                         │
│ Éléments non évalués :                  │
│                                         │
│ 1. Soft skills (non évalués par le      │
│    système, évalués en entretien)       │
│                                         │
│ 2. Motivation (non évaluée par le       │
│    système, évaluée en entretien)       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ VOS DROITS                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Droit à l'explication :                 │
│ Vous avez le droit de demander une      │
│ explication détaillée de cette décision │
│ en contactant notre DPO.                │
│                                         │
│ Droit à la correction :                 │
│ Vous pouvez demander la correction de   │
│ vos données personnelles en contactant  │
│ notre DPO.                              │
│                                         │
│ Droit de recours :                      │
│ Vous pouvez contester cette décision    │
│ en contactant notre service RH.         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONTACT                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ DPO (Data Protection Officer) :         │
│ dpo@trajectoire.com                     │
│ +33 1 23 45 67 89                      │
│                                         │
│ Service RH :                            │
│ rh@trajectoire.com                      │
│ +33 1 23 45 67 90                      │
│                                         │
│ [Télécharger le rapport en PDF]         │
└─────────────────────────────────────────┘
```

### 6.5 Règles de Génération

- **Anonymisation** : Données sensibles expurgées
- **Langage** : Accessible, non technique
- **Conformité RGPD** : Compatible Article 22
- **Droits** : Information sur les droits du candidat
- **Contact** : Coordonnées DPO et RH

### 6.6 Anonymisation

```typescript
function anonymizeForCandidateReport(tree: DecisionTree): DecisionTree {
  return {
    ...tree,
    candidateId: hash(tree.candidateId),
    jobId: hash(tree.jobId),
    level3: {
      ...tree.level3,
      requiredSkills: tree.level3.requiredSkills.map(skill => ({
        ...skill,
        source: anonymizeSource(skill.source)
      }))
    }
  };
}

function anonymizeSource(source: string): string {
  // Supprimer les informations personnelles
  return source.replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[Nom masqué]');
}
```

---

## 7. FORMAT 4 — Rapport d'Audit Juridique

### 7.1 Public Cible

**Juridique** pour preuve de non-discrimination en cas de contentieux.

### 7.2 Objectif

Fournir un rapport horodaté et signé électroniquement prouvant la non-discrimination, avec traçabilité complète des règles appliquées.

### 7.3 Structure

```typescript
interface AuditReport {
  header: {
    reportId: string;
    timestamp: Date;
    digitalSignature: string;
    legalReference: string;
  };
  
  case: {
    candidateId: string; // hashé
    jobId: string; // hashé
    decisionDate: Date;
  };
  
  decision: {
    recommendation: string;
    confidence: string;
    globalScore: number;
    justification: string;
  };
  
  nonDiscriminationProof: {
    biasCheck: BiasCheckResult;
    ruleCompliance: RuleComplianceCheck;
    dataTraceability: DataTraceability;
  };
  
  completeReasoning: {
    level1: Level1Summary;
    level2: Level2Dimensions;
    level3: Level3Detail;
    level4: Level4Transfer;
    level5: Level5Traceability;
  };
  
  legalCompliance: {
    gdprArticle22: boolean;
    frenchDataProtectionLaw: boolean;
    antiDiscriminationLaw: boolean;
  };
  
  archiving: {
    retentionPeriod: string;
    storageLocation: string;
    accessControl: string;
  };
}
```

### 7.4 Template

```
┌─────────────────────────────────────────┐
│ RAPPORT D'AUDIT JURIDIQUE              │
├─────────────────────────────────────────┤
│                                         │
│ Référence : AUD-2026-08-03-001         │
│ Horodatage : 2026-08-03T14:30:45.123Z  │
│ Signature numérique : [hash]             │
│ Référence légale : RGPD Art. 22         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CAS                                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Candidat (hashé) : a1b2c3d4e5f6g7h8i9j0│
│ Poste (hashé)    : k1l2m3n4o5p6q7r8s9t0│
│ Date de décision : 03/08/2026           │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ DÉCISION                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Recommandation   : ✅ Candidat recommandé│
│ Score global     : 82/100               │
│ Confiance        : Élevée               │
│ Justification    : Candidat recommandé  │
│   avec forte confiance grâce à une      │
│   excellente adéquation technique      │
│   et une expérience pertinente.         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ PREUVE DE NON-DISCRIMINATION           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Vérification des biais :                │
│ ✅ Aucune corrélation avec critères    │
│    prohibés (âge, genre, origine, etc.)│
│ ✅ Distribution équilibrée des décisions│
│ ✅ Absence de pattern discriminatoire   │
│                                         │
│ Conformité aux règles :                 │
│ ✅ KP-05 Compétences v2.1 appliqué     │
│ ✅ KP-01 Recrutement v1.8 appliqué     │
│ ✅ Règle R-140-07 respectée            │
│                                         │
│ Traçabilité des données :               │
│ ✅ Toutes les sources documentées        │
│ ✅ Toutes les règles appliquées citées  │
│ ✅ Horodatage de chaque étape           │
│ ✅ Signature numérique valide            │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RAISONNEMENT COMPLET                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ [Contenu NIVEAU 1 à 5 complet]          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONFORMITÉ LÉGALE                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ RGPD Article 22 (Droit à l'explication) │
│ ✅ Conforme                             │
│                                         │
│ Loi Informatique & Libertés révisée     │
│ ✅ Conforme                             │
│                                         │
│ Loi anti-discrimination                 │
│ ✅ Conforme                             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ARCHIVAGE                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Durée de conservation : 5 ans            │
│ Lieu de stockage : [sécurisé]           │
│ Contrôle d'accès : Restreint            │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ SIGNATURE                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Ce rapport est signé numériquement      │
│ et horodaté pour garantir son           │
│ authenticité et son intégrité.           │
│                                         │
│ Hash du document : [hash]               │
│                                         │
│ [Télécharger le rapport en PDF]         │
│ [Vérifier la signature]                 │
└─────────────────────────────────────────┘
```

### 7.5 Règles de Génération

- **Horodatage** : Timestamp précis à la milliseconde
- **Signature numérique** : Signature cryptographique valide
- **Preuve de non-discrimination** : Vérifications explicites
- **Traçabilité** : Toutes les sources et règles documentées
- **Archivage** : Conformité aux exigences légales

### 7.6 Signature Numérique

```typescript
interface DigitalSignature {
  algorithm: 'RSA-2048' | 'RSA-4096' | 'ECDSA-P256';
  hash: string;
  signature: string;
  certificate: string;
  timestamp: Date;
}

function generateDigitalSignature(report: AuditReport): DigitalSignature {
  const hash = crypto.createHash('sha256').update(JSON.stringify(report)).digest('hex');
  const signature = crypto.sign('RSA-SHA256', Buffer.from(hash), privateKey);
  
  return {
    algorithm: 'RSA-2048',
    hash,
    signature: signature.toString('base64'),
    certificate: publicKey,
    timestamp: new Date()
  };
}
```

---

## 8. Sélection du Format

### 8.1 Algorithme de Sélection

```typescript
function selectFormat(
 user: User,
 context: Context,
 request?: FormatRequest
): ExplanationFormat {
  // Demande explicite du candidat (RGPD Art. 22)
  if (request?.format === 'candidate_report') {
    return 'FORMAT_3_CANDIDATE';
  }
  
  // Demande explicite juridique
  if (request?.format === 'audit_report') {
    return 'FORMAT_4_AUDIT';
  }
  
  // Demande explicite DRH pressé
  if (request?.format === 'executive_summary') {
    return 'FORMAT_1_EXECUTIVE';
  }
  
  // Contexte juridique (contentieux)
  if (context.isLegalProceeding) {
    return 'FORMAT_4_AUDIT';
  }
  
  // Contexte DRH pressé
  if (user.role === 'hr' && context.isUrgent) {
    return 'FORMAT_1_EXECUTIVE';
  }
  
  // Contexte DRH analytique (défaut)
  if (user.role === 'hr') {
    return 'FORMAT_2_COMPLETE';
  }
  
  // Défaut
  return 'FORMAT_2_COMPLETE';
}
```

### 8.2 Interface de Sélection

```
┌─────────────────────────────────────────┐
│ SÉLECTION DU FORMAT D'EXPLICATION       │
├─────────────────────────────────────────┤
│                                         │
│ Contexte :                             │
│ ○ Décision rapide (DRH pressé)         │
│ ○ Analyse approfondie (DRH analytique) │
│ ○ Demande candidat (RGPD Art. 22)      │
│ ○ Audit juridique (contentieux)         │
│                                         │
│ Format sélectionné :                   │
│ FORMAT 2 - Analyse complète            │
│                                         │
│ [Générer le rapport]                    │
└─────────────────────────────────────────┘
```

---

## 9. Export et Impression

### 9.1 Export PDF

Tous les formats peuvent être exportés en PDF :

```typescript
async function exportToPDF(
 format: ExplanationFormat,
 content: ExplanationContent
): Promise<Buffer> {
  const pdf = await generatePDF(content);
  return pdf;
}
```

### 9.2 Impression

Tous les formats peuvent être imprimés directement depuis l'interface :

```
┌─────────────────────────────────────────┐
│ OPTIONS D'EXPORT                        │
├─────────────────────────────────────────┤
│                                         │
│ [Exporter en PDF]                       │
│ [Imprimer]                              │
│ [Partager par email]                    │
│ [Archiver]                              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 10. Conclusion

Le guide des 4 formats d'explication garantit :

- **Adaptation au contexte** d'utilisation
- **Conformité RGPD** Article 22
- **Preuve juridique** en cas de contentieux
- **Efficacité** pour les DRH pressés
- **Compréhension approfondie** pour les DRH analytiques
- **Transparence** pour les candidats
