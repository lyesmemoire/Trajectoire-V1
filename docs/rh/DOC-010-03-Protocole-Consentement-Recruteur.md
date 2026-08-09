# DOC-010-03 : Protocole de Consentement Recruteur

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de consentement pour l'activation de la mémoire personnalisée de MVP-010. Le consentement doit être explicite, informé, libre et spécifique, conformément au RGPD Article 7.

---

## 2. Principe Fondateur

La mémoire personnalisée est une fonctionnalité optionnelle. Le recruteur peut utiliser le système sans activer la mémoire. Le consentement est obligatoire avant toute collecte de données personnelles pour la mémoire.

---

## 3. Base Légale

### 3.1 RGPD Article 7 — Conditions du Consentement

**Texte officiel :**
> "Lorsque le traitement est fondé sur le consentement, le responsable du traitement doit être en mesure de démontrer que la personne concernée a consenti au traitement de ses données à caractère personnel."

**Exigences :**
- **Libre** : Sans contrainte ni pression
- **Spécifique** : Pour un traitement déterminé
- **Éclairé** : Avec information claire
- **Sans ambiguïté** : Déclaration ou action claire affirmative

### 3.2 RGPD Article 4(11) — Définition du Consentement

> "Le consentement de la personne concernée désigne toute manifestation de volonté, libre, spécifique, éclairée et sans ambiguïté, par laquelle la personne concernée accepte, par une déclaration ou par une action positive claire, que des données à caractère personnelles la concernant fassent l'objet d'un traitement."

---

## 4. Processus de Consentement

### 4.1 Moment du Consentement

Le consentement est demandé :

1. **À la première activation** de la mémoire personnalisée
2. **À chaque modification significative** du traitement
3. **En cas de changement d'entreprise** (nouveau contexte)

### 4.2 Interface de Consentement

```typescript
interface ConsentInterface {
  consentId: string;
  recruiterId: string;
  timestamp: Date;
  
  // Information fournie
  informationProvided: {
    dataCollected: string[];
    purposes: string[];
    retentionPeriod: string;
    rights: string[];
    thirdPartyAccess: string;
  };
  
  // Consentement
  consent: {
    explicit: boolean;
    specific: boolean;
    informed: boolean;
    unambiguous: boolean;
    givenAt: Date;
    version: string;
  };
  
  // Préférences
  preferences: {
    enableMemory: boolean;
    enableImplicitLearning: boolean;
    enableContextualLearning: boolean;
    dataRetentionChoice: 'standard' | 'extended' | 'minimal';
  };
}
```

### 4.3 Écran de Consentement

```
┌─────────────────────────────────────────┐
│ ACTIVATION DE LA MÉMOIRE PERSONNALISÉE │
├─────────────────────────────────────────┤
│                                         │
│ Avant d'activer la mémoire personnalisée│
│ veuillez prendre connaissance des       │
│ informations suivantes.                 │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ DONNÉES COLLECTÉES                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Nous collectons les données suivantes : │
│                                         │
│ • Vos préférences explicites            │
│   (secteurs, types de postes, critères) │
│                                         │
│ • Vos préférences implicites            │
│   (apprises à partir de vos décisions)  │
│                                         │
│ • Historique de vos décisions           │
│   (avec données candidats anonymisées)  │
│                                         │
│ • Contexte organisationnel              │
│   (managers, équipes, organisation)    │
│                                         │
│ • Apprentissages accumulés              │
│   (règles contextuelles, patterns)     │
│                                         │
│ ⚠️ IMPORTANT : Les données des candidats│
│ sont anonymisées. Aucun nom, email ou   │
│ information identifiante n'est stocké.  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ FINALITÉS                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Ces données sont utilisées pour :       │
│                                         │
│ • Personnaliser les recommandations     │
│ • Améliorer la pertinence du moteur     │
│ • Adapter le moteur à votre contexte    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ DURÉE DE CONSERVATION                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ • Préférences : Tant que vous consentez │
│ • Historique : 3 ans                   │
│ • Apprentissages : 2 ans                │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ VOS DROITS                             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Vous avez le droit :                    │
│                                         │
│ • De consulter votre mémoire à tout     │
│   moment                                │
│ • De corriger les apprentissages erronés│
│ • D'effacer tout ou partie de votre     │
│   mémoire                               │
│ • D'exporter votre mémoire              │
│ • De retirer votre consentement à       │
│   tout moment                           │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ PRÉFÉRENCES                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ ☑ Activer la mémoire personnalisée      │
│ ☑ Activer l'apprentissage implicite     │
│ ☑ Activer l'apprentissage contextuel   │
│                                         │
│ Durée de conservation :                 │
│ ○ Standard (2-3 ans)                    │
│ ○ Étendue (5 ans)                       │
│ ○ Minimale (1 an)                      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONSENTEMENT                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ J'ai lu et compris les informations     │
│ ci-dessus. Je consens à la collecte     │
│ et à l'utilisation de mes données       │
│ pour la mémoire personnalisée.          │
│                                         │
│ ☑ J'accepte                            │
│ ☐ Je refuse                             │
│                                         │
│ [Politique de confidentialité complète] │
│ [Contact DPO : dpo@trajectoire.com]    │
│                                         │
│ [Annuler]              [Activer la mémoire]│
└─────────────────────────────────────────┘
```

---

## 5. Validation du Consentement

### 5.1 Critères de Validation

```typescript
function validateConsent(consent: ConsentInterface): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Critère 1 : Consentement explicite
  if (!consent.consent.explicit) {
    errors.push("Consentement non explicite");
  }
  
  // Critère 2 : Consentement spécifique
  if (!consent.consent.specific) {
    errors.push("Consentement non spécifique");
  }
  
  // Critère 3 : Consentement éclairé
  if (!consent.consent.informed) {
    errors.push("Consentement non éclairé");
  }
  
  // Critère 4 : Consentement sans ambiguïté
  if (!consent.consent.unambiguous) {
    errors.push("Consentement ambigu");
  }
  
  // Critère 5 : Information fournie complète
  if (consent.informationProvided.dataCollected.length === 0) {
    errors.push("Données collectées non spécifiées");
  }
  
  if (consent.informationProvided.purposes.length === 0) {
    errors.push("Finalités non spécifiées");
  }
  
  if (consent.informationProvided.rights.length === 0) {
    warnings.push("Droits non spécifiés");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
```

### 5.2 Enregistrement du Consentement

```sql
CREATE TABLE consent_records (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  consent_id VARCHAR(36) UNIQUE NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  information_provided JSON NOT NULL,
  consent JSON NOT NULL,
  preferences JSON NOT NULL,
  
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consent_recruiter ON consent_records(recruiter_id);
CREATE INDEX idx_consent_timestamp ON consent_records(timestamp);
CREATE INDEX idx_consent_id ON consent_records(consent_id);
```

---

## 6. Retrait du Consentement

### 6.1 Processus de Retrait

Le recruteur peut retirer son consentement à tout moment :

1. **Accès** à l'interface de gestion de la mémoire
2. **Clic** sur "Désactiver la mémoire"
3. **Confirmation** du retrait
4. **Effacement** des données (optionnel)
5. **Confirmation** de l'effacement

### 6.2 Interface de Retrait

```
┌─────────────────────────────────────────┐
│ DÉSACTIVATION DE LA MÉMOIRE             │
├─────────────────────────────────────────┤
│                                         │
│ Vous êtes sur le point de désactiver    │
│ la mémoire personnalisée.               │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONSÉQUENCES                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ • Les recommandations redeviendront     │
│   génériques                            │
│ • Les apprentissages seront conservés   │
│   pendant 2 ans avant suppression       │
│ • Vous pourrez réactiver la mémoire     │
│   à tout moment                         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ OPTIONS D'EFFACEMENT                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Que souhaitez-vous faire de vos données │
│ de mémoire ?                            │
│                                         │
│ ○ Conserver les données                 │
│   (réactivation possible)              │
│                                         │
│ ○ Effacer les données d'apprentissage    │
│   (conserver préférences explicites)    │
│                                         │
│ ○ Effacer toutes les données            │
│   (réinitialisation complète)          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONFIRMATION                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Je confirme que je souhaite désactiver  │
│ la mémoire personnalisée.              │
│                                         │
│ ☑ Je confirme                           │
│                                         │
│ [Annuler]              [Désactiver]      │
└─────────────────────────────────────────┘
```

### 6.3 Algorithme de Retrait

```typescript
async function withdrawConsent(
 recruiterId: string,
 deletionOption: 'keep' | 'delete_learning' | 'delete_all'
): Promise<void> {
  // Enregistrement du retrait
  await recordConsentWithdrawal(recruiterId);
  
  // Désactivation de la mémoire
  await disableMemory(recruiterId);
  
  // Traitement selon l'option
  switch (deletionOption) {
    case 'keep':
      // Conserver toutes les données
      break;
      
    case 'delete_learning':
      // Effacer les apprentissages
      await deleteImplicitPreferences(recruiterId);
      await deleteAccumulatedLearnings(recruiterId);
      // Conserver les préférences explicites
      break;
      
    case 'delete_all':
      // Effacer toutes les données
      await deleteAllMemoryData(recruiterId);
      break;
  }
  
  // Notification au recruteur
  await notifyWithdrawalConfirmation(recruiterId);
  
  // Notification au DPO
  await notifyDPOWithdrawal(recruiterId);
}
```

---

## 7. Consentement Mineur

### 7.1 Règle

En cas de recruteur mineur (moins de 18 ans), le consentement parental est requis.

### 7.2 Interface Spécifique

```
┌─────────────────────────────────────────┐
│ CONSENTEMENT MINEUR                     │
├─────────────────────────────────────────┤
│                                         │
│ Vous êtes identifié comme mineur        │
│ (moins de 18 ans).                     │
│                                         │
│ Le consentement de vos parents ou       │
│ tuteurs légaux est requis.              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ CONSENTEMENT PARENTAL                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Nom du parent / tuteur :                 │
│ [_____________________________]           │
│                                         │
│ Email du parent / tuteur :               │
│ [_____________________________]           │
│                                         │
│ ☑ J'autorise mon enfant à utiliser     │
│   la mémoire personnalisée              │
│                                         │
│ ☑ J'ai lu et compris les informations  │
│                                         │
│ [Annuler]              [Confirmer]       │
└─────────────────────────────────────────┘
```

---

## 8. Consentement par Catégorie de Données

### 8.1 Granularité du Consentement

Le recruteur peut consentir par catégorie de données :

```typescript
interface GranularConsent {
  // Préférences explicites
  explicitPreferences: boolean;
  
  // Préférences implicites
  implicitPreferences: boolean;
  
  // Historique de décisions
  decisionHistory: boolean;
  
  // Contexte organisationnel
  organizationalContext: boolean;
  
  // Apprentissages accumulés
  accumulatedLearnings: boolean;
}
```

### 8.2 Interface de Consentement Granulaire

```
┌─────────────────────────────────────────┐
│ PRÉFÉRENCES DE CONSENTEMENT             │
├─────────────────────────────────────────┤
│                                         │
│ Choisissez les catégories de données    │
│ pour lesquelles vous consentez :        │
│                                         │
│ ☑ Préférences explicites               │
│   (secteurs, types de postes, critères) │
│   [En savoir plus]                      │
│                                         │
│ ☑ Préférences implicites               │
│   (apprises à partir de vos décisions)  │
│   [En savoir plus]                      │
│                                         │
│ ☑ Historique de décisions               │
│   (avec données candidats anonymisées)  │
│   [En savoir plus]                      │
│                                         │
│ ☑ Contexte organisationnel              │
│   (managers, équipes, organisation)    │
│   [En savoir plus]                      │
│                                         │
│ ☑ Apprentissages accumulés              │
│   (règles contextuelles, patterns)     │
│   [En savoir plus]                      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ IMPACT DES CHOIX                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
│ Si vous désactivez certaines catégories │
│ la personnalisation sera réduite.       │
│                                         │
│ [Tout accepter] [Tout refuser]           │
│                                         │
│ [Annuler]              [Confirmer]       │
└─────────────────────────────────────────┘
```

---

## 9. Révocation et Réactivation

### 9.1 Révocation

La révocation du consentement est possible à tout moment sans conséquence négative.

### 9.2 Réactivation

Le recruteur peut réactiver la mémoire à tout moment :

- Si les données ont été conservées : Réactivation immédiate
- Si les données ont été effacées : Nouveau consentement requis

### 9.3 Historique des Consentements

```typescript
interface ConsentHistory {
  id: string;
  recruiterId: string;
  
  events: ConsentEvent[];
}

interface ConsentEvent {
  eventType: 'given' | 'withdrawn' | 'modified' | 'reactivated';
  timestamp: Date;
  version: string;
  details: any;
}
```

---

## 10. Documentation et Preuve

### 10.1 Journalisation

Tous les événements de consentement sont journalisés :

```sql
CREATE TABLE consent_events (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  event_type VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  version VARCHAR(20) NOT NULL,
  details JSON,
  
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_consent_events_recruiter ON consent_events(recruiter_id);
CREATE INDEX idx_consent_events_type ON consent_events(event_type);
CREATE INDEX idx_consent_events_timestamp ON consent_events(timestamp);
```

### 10.2 Durée de Conservation

- **Consentements actifs** : Tant que le recruteur consent
- **Historique des consentements** : 5 ans
- **Preuves de consentement** : 5 ans

---

## 11. Communication et Information

### 11.1 Politique de Confidentialité

La politique de confidentialité inclut une section dédiée à la mémoire personnalisée :

- Description du traitement
- Données collectées
- Finalités
- Durée de conservation
- Droits du recruteur
- Contact DPO

### 11.2 Notifications

- **À l'activation** : Confirmation d'activation
- **À la modification** : Notification des changements
- **Au retrait** : Confirmation de retrait
- **Annuellement** : Rappel des droits

---

## 12. Conformité et Audit

### 12.1 Vérification de Conformité

```typescript
async function auditConsentCompliance(): Promise<ComplianceReport> {
  const recruiters = await getAllRecruitersWithMemory();
  
  const compliant: string[] = [];
  const nonCompliant: string[] = [];
  
  for (const recruiter of recruiters) {
    const consent = await getLatestConsent(recruiter.id);
    
    if (!consent || !consent.consent.explicit) {
      nonCompliant.push(recruiter.id);
    } else {
      compliant.push(recruiter.id);
    }
  }
  
  return {
    total: recruiters.length,
    compliant: compliant.length,
    nonCompliant: nonCompliant.length,
    nonCompliantList: nonCompliant
  };
}
```

### 12.2 Audit Périodique

Un audit de conformité est réalisé trimestriellement :

- **Vérification** du consentement explicite
- **Vérification** de l'information fournie
- **Vérification** de la durée de conservation
- **Vérification** du droit de retrait

---

## 13. Conclusion

Le protocole de consentement garantit :

- **Consentement explicite** et informé
- **Liberté** de choix (activation optionnelle)
- **Spécificité** du consentement (par catégorie)
- **Droit de retrait** à tout moment
- **Documentation** complète des consentements
- **Conformité RGPD** Article 7
