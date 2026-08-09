# DOC-009-03 : Protocole de Conformité RGPD Article 22

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de conformité au RGPD Article 22 (Droit à l'explication des décisions automatisées). Ce protocole garantit que tout candidat peut obtenir une explication claire et compréhensible de la décision automatisée le concernant.

---

## 2. Principe Fondateur

RGPD Article 22 : Toute décision automatisée significative doit pouvoir être expliquée à la personne concernée sur simple demande. Sans explainability : risque de contentieux prud'omal, risque de contrôle CNIL, risque de requalification en discrimination.

---

## 3. Références Légales

### 3.1 RGPD Article 22

**Texte officiel :**
> "La personne concernée a le droit d'obtenir une intervention humaine de la part du responsable du traitement, de formuler son point de vue et de contester la décision."

**Interprétation CNIL :**
- Le droit à l'explication est un corollaire du droit de ne pas faire l'objet d'une décision automatisée
- L'explication doit être "intelligible, significative et adaptée au contexte"
- L'explication doit porter sur la logique, la pertinence et les conséquences de la décision

### 3.2 Loi Informatique & Libertés Révisée

**Article 10 :**
> "Toute personne a le droit d'obtenir communication des informations la concernant détenues par un traitement automatisé de données à caractère personnel."

### 3.3 Jurisprudence

**Arrêt CJUE (2019) :**
- L'explication doit être suffisamment détaillée
- L'explication doit permettre à la personne de comprendre la décision
- L'explication doit permettre à la personne de contester la décision

---

## 4. Processus de Demande d'Explication

### 4.1 Canaux de Demande

Le candidat peut demander une explication via :

1. **Interface candidat** : Bouton "Pourquoi cette décision ?"
2. **Email** : explication@trajectoire.com
3. **Formulaire web** : Formulaire de contact dédié
4. **Courrier postal** : Adresse postale de l'entreprise

### 4.2 Délai de Réponse

**Délai légal :** 1 mois à compter de la réception de la demande

**Délai cible MVP-009 :** 5 jours ouvrés

**Délai d'urgence :** 48 heures (si contentieux imminent)

### 4.3 Processus de Traitement

```typescript
interface ExplanationRequest {
  id: string;
  candidateId: string;
  jobId: string;
  requestDate: Date;
  requestChannel: 'interface' | 'email' | 'web_form' | 'postal';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  
  requestDetails: {
    reason?: string;
    additionalQuestions?: string[];
  };
  
  response: {
    dueDate: Date;
    completedDate?: Date;
    format: 'candidate_report';
    content?: CandidateReport;
  };
}
```

---

## 5. Contenu de l'Explication

### 5.1 Exigences RGPD

L'explication doit contenir :

1. **La logique de la décision** : Comment le système est arrivé à cette conclusion
2. **La pertinence des données** : Quelles données ont été utilisées
3. **Les conséquences de la décision** : Ce que la décision implique
4. **Les droits de contestation** : Comment contester la décision

### 5.2 Structure du Rapport Candidat

```typescript
interface GDPRCompliantExplanation {
  header: {
    reportId: string;
    requestDate: Date;
    responseDate: Date;
    processingTime: number; // en jours
  };
  
  decision: {
    recommendation: string;
    confidence: string;
    globalScore: number;
    dateOfDecision: Date;
  };
  
  logicExplanation: {
    methodology: string;
    dimensionsEvaluated: string[];
    weighting: string;
    rulesApplied: string[];
  };
  
  dataRelevance: {
    dataUsed: string[];
    dataNotUsed: string[];
    dataAccuracy: string;
    dataSources: string[];
  };
  
  consequences: {
    immediateConsequences: string[];
    potentialImpact: string[];
    nextSteps: string[];
  };
  
  rights: {
    rightToHumanIntervention: string;
    rightToExplanation: string;
    rightToCorrection: string;
    rightToAppeal: string;
    rightToComplaint: string;
  };
  
  contact: {
    dpoContact: string;
    hrContact: string;
    appealProcess: string;
  };
}
```

---

## 6. Anonymisation des Données

### 6.1 Règles d'Anonymisation

Pour le rapport candidat, les données sensibles doivent être anonymisées :

- **Nom complet** : Remplacé par "Candidat [ID]"
- **Adresse email** : Remplacée par "email@anonymisé.com"
- **Numéro de téléphone** : Remplacé par "+33 X XX XX XX XX"
- **Adresse postale** : Remplacée par "[Adresse masquée]"
- **Nom de l'entreprise** : Remplacé par "[Entreprise masquée]" (sauf si candidat consent)

### 6.2 Algorithme d'Anonymisation

```typescript
function anonymizeForGDPR(tree: DecisionTree, consent: Consent): GDPRCompliantExplanation {
  const anonymizedTree = { ...tree };
  
  if (!consent.allowPersonalData) {
    anonymizedTree.candidateId = hash(tree.candidateId);
    anonymizedTree.jobId = hash(tree.jobId);
    
    anonymizedTree.level3.requiredSkills = anonymizedTree.level3.requiredSkills.map(skill => ({
      ...skill,
      source: anonymizePersonalData(skill.source)
    }));
  }
  
  return convertToGDPRFormat(anonymizedTree);
}

function anonymizePersonalData(text: string): string {
  // Anonymiser les noms propres
  text = text.replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[Nom masqué]');
  
  // Anonymiser les emails
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[Email masqué]');
  
  // Anonymiser les numéros de téléphone
  text = text.replace(/\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, '[Téléphone masqué]');
  
  return text;
}
```

---

## 7. Processus de Validation

### 7.1 Validation du Contenu

Avant envoi au candidat, le rapport est validé :

```typescript
function validateGDPRCompliance(explanation: GDPRCompliantExplanation): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Vérification 1 : Contenu obligatoire
  if (!explanation.logicExplanation.methodology) {
    errors.push("Méthodologie manquante");
  }
  
  if (!explanation.rights.rightToAppeal) {
    errors.push("Droit de recours non mentionné");
  }
  
  // Vérification 2 : Anonymisation
  if (containsPersonalData(explanation)) {
    errors.push("Données personnelles non anonymisées");
  }
  
  // Vérification 3 : Langage compréhensible
  if (!isLanguageComprehensible(explanation)) {
    warnings.push("Langage technique excessif");
  }
  
  // Vérification 4 : Délai de réponse
  const processingTime = (explanation.header.responseDate.getTime() - explanation.header.requestDate.getTime()) / (1000 * 60 * 60 * 24);
  if (processingTime > 30) {
    errors.push("Délai de réponse dépassé (30 jours max)");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
```

### 7.2 Validation par le DPO

Le DPO valide la conformité avant envoi :

- **Vérification de l'anonymisation**
- **Vérification de la complétude**
- **Vérification de la clarté**
- **Validation finale**

---

## 8. Droits du Candidat

### 8.1 Droit à l'Intervention Humaine

Le candidat peut demander une révision de la décision par un humain :

```typescript
interface HumanInterventionRequest {
  id: string;
  candidateId: string;
  jobId: string;
  requestDate: Date;
  reason: string;
  
  process: {
    assignedRecruiter: string;
    reviewDate: Date;
    humanDecision: string;
    justification: string;
  };
}
```

### 8.2 Droit à la Correction

Le candidat peut demander la correction de ses données :

```typescript
interface DataCorrectionRequest {
  id: string;
  candidateId: string;
  dataToCorrect: string[];
  proposedCorrection: string;
  justification: string;
  
  process: {
    reviewDate: Date;
    correctionApplied: boolean;
    reason: string;
  };
}
```

### 8.3 Droit de Recours

Le candidat peut contester la décision :

```typescript
interface AppealRequest {
  id: string;
  candidateId: string;
  jobId: string;
  appealDate: Date;
  grounds: string[];
  
  process: {
    assignedReviewer: string;
    reviewDate: Date;
    outcome: string;
    justification: string;
  };
}
```

### 8.4 Droit de Plainte

Le candidat peut déposer une plainte auprès de la CNIL :

- **Coordonnées CNIL** : Fournies dans le rapport
- **Procédure** : Expliquée dans le rapport
- **Délai** : Aucun délai spécifié

---

## 9. Documentation et Traçabilité

### 9.1 Enregistrement des Demandes

Toutes les demandes d'explication sont enregistrées :

```sql
CREATE TABLE gdpr_explanation_requests (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  request_date TIMESTAMP NOT NULL,
  request_channel VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  
  request_details JSON,
  response JSON,
  
  dpo_validation BOOLEAN,
  dpo_validation_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gdpr_candidate ON gdpr_explanation_requests(candidate_id);
CREATE INDEX idx_gdpr_status ON gdpr_explanation_requests(status);
CREATE INDEX idx_gdpr_date ON gdpr_explanation_requests(request_date);
```

### 9.2 Archivage

Les rapports d'explication sont archivés :

- **Durée de conservation** : 5 ans
- **Format** : PDF + JSON
- **Emplacement** : Système de stockage sécurisé
- **Accès** : Restreint au DPO et RH

---

## 10. Interface Candidat

### 10.1 Bouton "Pourquoi ?"

Dans l'interface candidat, un bouton permet de demander l'explication :

```
┌─────────────────────────────────────────┐
│ RÉSULTAT DE VOTRE CANDIDATURE           │
├─────────────────────────────────────────┤
│                                         │
│ Statut : ✅ Candidat recommandé        │
│ Score : 82/100                          │
│                                         │
│ [Pourquoi cette décision ?]              │
│                                         │
│ Vous avez le droit de demander une      │
│ explication de cette décision           │
│ (RGPD Article 22).                      │
│                                         │
│ [Demander l'explication]                │
└─────────────────────────────────────────┘
```

### 10.2 Formulaire de Demande

```
┌─────────────────────────────────────────┐
│ DEMANDE D'EXPLICATION                   │
├─────────────────────────────────────────┤
│                                         │
│ Pourquoi souhaitez-vous une explication│
│ de cette décision ?                      │
│                                         │
│ ○ Je ne comprends pas la décision       │
│ ○ Je pense qu'il y a une erreur        │
│ ○ Je souhaite contester la décision     │
│ ○ Autre (préciser) :                    │
│   [_____________________________]         │
│                                         │
│ Questions supplémentaires (optionnel) : │
│ [_____________________________]           │
│ [_____________________________]           │
│                                         │
│ [Annuler]              [Envoyer]         │
└─────────────────────────────────────────┘
```

### 10.3 Suivi de la Demande

```
┌─────────────────────────────────────────┐
│ SUIVI DE VOTRE DEMANDE                  │
├─────────────────────────────────────────┤
│                                         │
│ Demande #12345                          │
│ Date de demande : 03/08/2026            │
│ Statut : ⏳ En cours de traitement      │
│ Délai de réponse : 08/08/2026           │
│                                         │
│ Vous recevrez l'explication par email   │
│ à l'adresse : [email@anonymisé.com]     │
│                                         │
│ [Contacter le support]                   │
└─────────────────────────────────────────┘
```

---

## 11. Processus d'Urgence

### 11.1 Déclenchement de l'Urgence

Le processus d'urgence est déclenché si :

- Contentieux prud'omal imminent
- Menace de dépôt de plainte CNIL
- Demande explicite d'un avocat
- Situation médiatique

### 11.2 Procédure d'Urgence

```typescript
async function handleUrgentExplanation(request: ExplanationRequest): Promise<void> {
  // Notification immédiate du DPO
  await notifyDPOUrgent(request);
  
  // Notification du service juridique
  await notifyLegalTeamUrgent(request);
  
  // Génération prioritaire du rapport
  const explanation = await generateExplanationUrgent(request);
  
  // Validation accélérée (DPO disponible 24/7)
  const validation = await validateUrgent(explanation);
  
  // Envoi immédiat
  await sendExplanationUrgent(request, explanation);
  
  // Documentation de l'urgence
  await documentUrgentProcess(request);
}
```

### 11.3 Délai d'Urgence

**Délai cible :** 48 heures

---

## 12. Formation et Sensibilisation

### 12.1 Formation du Personnel

Le personnel RH est formé sur :

- **RGPD Article 22** : Droit à l'explication
- **Processus de demande** : Comment traiter les demandes
- **Anonymisation** : Comment anonymiser les données
- **Délais** : Respect des délais légaux
- **Droits du candidat** : Intervention humaine, correction, recours

### 12.2 Documentation Interne

Un guide interne est disponible :

- **Procédure de demande d'explication**
- **Template de réponse**
- **Checklist de validation**
- **Coordonnées DPO**

---

## 13. Indicateurs de Suivi

### 13.1 Métriques de Conformité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de réponse dans les délais | Demandes répondues dans les délais / total | 100% |
| Délai moyen de réponse | Temps moyen de traitement | < 5 jours ouvrés |
| Taux de validation DPO | Rapports validés par DPO / total | 100% |
| Taux d'anonymisation correcte | Rapports correctement anonymisés / total | 100% |

### 13.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de satisfaction | Candidats satisfaits / total | ≥ 90% |
| Taux de contestation | Demandes de contestation / total | ≤ 5% |
| Taux d'intervention humaine | Demandes d'intervention humaine / total | ≤ 10% |

---

## 14. Audit et Contrôle

### 14.1 Audit Interne

Un audit interne est réalisé annuellement :

- **Vérification de la conformité** RGPD Article 22
- **Vérification des délais** de réponse
- **Vérification de l'anonymisation**
- **Vérification de la documentation**

### 14.2 Contrôle CNIL

En cas de contrôle CNIL :

- **Documentation complète** disponible
- **Preuves de conformité** prêtes
- **Historique des demandes** accessible
- **Coordonnées DPO** à jour

---

## 15. Incidents et Gestion

### 15.1 Types d'Incidents

- **Dépassement de délai** : Réponse envoyée après le délai légal
- **Fuite de données** : Données personnelles exposées
- **Erreur d'anonymisation** : Données non anonymisées
- **Explication incomplète** : Informations manquantes

### 15.2 Processus de Gestion

```typescript
async function handleGDPRIncident(incident: GDPRIncident): Promise<void> {
  // Notification immédiate du DPO
  await notifyDPOIncident(incident);
  
  // Notification de la direction
  await notifyManagementIncident(incident);
  
  // Évaluation de l'impact
  const impact = assessImpact(incident);
  
  // Mesures correctives immédiates
  await implementImmediateMeasures(incident);
  
  // Documentation de l'incident
  await documentIncident(incident);
  
  // Notification CNIL si requis (72h)
  if (impact.severity === 'high') {
    await notifyCNILIncident(incident);
  }
}
```

---

## 16. Conclusion

Le protocole de conformité RGPD Article 22 garantit :

- **Conformité légale** au RGPD Article 22
- **Droit à l'explication** pour tous les candidats
- **Anonymisation** des données sensibles
- **Délais de réponse** respectés
- **Droits de contestation** clairs et accessibles
- **Traçabilité** complète des demandes
- **Formation** du personnel
- **Audit** régulier de la conformité
