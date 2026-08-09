# DOC-M08-02 : Protocole de Consentement pour le Suivi

**Version:** 1.0  
**Date:** 2026-08-04  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de consentement pour le suivi des candidats refusés pour le MVP-META-08 Error Learning Engine. Ce document structure le processus de demande, d'enregistrement et de gestion du consentement.

---

## 2. Principe Fondateur

Le consentement du candidat est obligatoire pour tout suivi post-refus. Le consentement doit être explicite, informé, et révocable à tout moment. Les données collectées sont anonymisées et utilisées uniquement en interne.

---

## 3. Processus de Consentement

### 3.1 Étape 1 — Demande de Consentement

**Moment de la demande :**
- Lors de la notification de refus
- Dans les 24 heures suivant le refus

**Canal de communication :**
- Email personnalisé
- Message via la plateforme de recrutement

**Contenu de la demande :**

```markdown
Objet : Suivi de votre parcours professionnel

Bonjour [Prénom],

Nous vous remercions pour votre intérêt pour [Entreprise].

Dans le cadre de notre démarche d'amélioration continue,
nous souhaitons suivre l'évolution professionnelle
des candidats que nous n'avons pas pu recruter.

Ce suivi nous permet de :
- Améliorer notre processus de recrutement
- Identifier nos erreurs d'évaluation
- Mieux comprendre le marché du talent

Si vous acceptez, nous vous contacterons à 6 mois
puis à 12 mois pour quelques questions simples.

Vos données seront :
- Anonymisées
- Utilisées uniquement en interne
- Conservées pendant 24 mois maximum

Vous pouvez retirer votre consentement à tout moment
en répondant à cet email.

Acceptez-vous de participer à ce suivi ?
[Oui] / [Non]

Cordialement,
L'équipe recrutement
```

---

### 3.2 Étape 2 — Enregistrement du Consentement

**Réponse positive :**
- Enregistrer le consentement avec la date
- Ajouter le candidat à la liste de suivi
- Planifier le suivi à 6 mois

**Réponse négative :**
- Enregistrer le refus avec la date
- Ne pas inclure le candidat dans le suivi
- Supprimer les données personnelles après 30 jours

**Absence de réponse :**
- Rappeler après 7 jours
- Si toujours pas de réponse : considérer comme refus
- Supprimer les données personnelles après 30 jours

---

### 3.3 Étape 3 — Retrait du Consentement

**Processus de retrait :**
- Le candidat peut retirer son consentement à tout moment
- Par email ou via la plateforme
- Le retrait est immédiat

**Conséquences du retrait :**
- Arrêt immédiat du suivi
- Suppression des données collectées
- Anonymisation des données déjà utilisées

---

## 4. Gestion des Données

### 4.1 Collecte des Données

**Données collectées avec consentement :**
- Identifiant anonymisé du candidat
- Date de consentement
- Réponses aux questions de suivi
- Source d'information

**Données personnelles :**
- Nom et prénom (pour la communication uniquement)
- Email (pour la communication uniquement)
- LinkedIn (si fourni volontairement)

---

### 4.2 Anonymisation

**Processus d'anonymisation :**
- Remplacement du nom par un identifiant unique
- Suppression de l'email après le suivi
- Conservation de l'identifiant uniquement pour le suivi

**Délai d'anonymisation :**
- Immédiat pour les données non nécessaires
- 30 jours après le suivi complet pour les données restantes

---

### 4.3 Conservation des Données

**Durée de conservation :**
- 24 mois maximum
- Suppression automatique après 24 mois

**Base légale :**
- Consentement explicite du candidat
- Intérêt légitime de l'entreprise
- RGPD (si applicable)

---

## 5. Structure de Données (TypeScript)

```typescript
interface ConsentRecord {
  consentId: string;
  recruitmentId: string;
  candidateId: string;
  
  request: {
    sentAt: Date;
    channel: 'email' | 'platform';
    content: string;
  };
  
  response: {
    receivedAt?: Date;
    consent: boolean;
    channel?: 'email' | 'platform';
  };
  
  withdrawal: {
    withdrawnAt?: Date;
    channel?: 'email' | 'platform';
    reason?: string;
  };
  
  dataRetention: {
    anonymizedAt?: Date;
    deletedAt?: Date;
  };
  
  metadata: {
    version: string;
    createdAt: Date;
    lastUpdated: Date;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE consent_record (
  id VARCHAR(36) PRIMARY KEY,
  recruitment_id VARCHAR(36) NOT NULL,
  candidate_id VARCHAR(36) NOT NULL,
  
  request_sent_at TIMESTAMP NOT NULL,
  request_channel VARCHAR(20) NOT NULL,
  request_content TEXT NOT NULL,
  
  response_received_at TIMESTAMP NULL,
  response_consent BOOLEAN NULL,
  response_channel VARCHAR(20) NULL,
  
  withdrawal_withdrawn_at TIMESTAMP NULL,
  withdrawal_channel VARCHAR(20) NULL,
  withdrawal_reason TEXT NULL,
  
  data_retention_anonymized_at TIMESTAMP NULL,
  data_retention_deleted_at TIMESTAMP NULL,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_consent_record_recruitment ON consent_record(recruitment_id);
CREATE INDEX idx_consent_record_candidate ON consent_record(candidate_id);
CREATE INDEX idx_consent_record_consent ON consent_record(response_consent);
```

---

## 7. API Endpoints

```typescript
// POST /api/consent/request
async function requestConsent(recruitmentId: string): Promise<ConsentRecord> {
  return await requestConsent(recruitmentId);
}

// PUT /api/consent/:consentId/response
async function recordConsentResponse(consentId: string, consent: boolean, channel: string): Promise<ConsentRecord> {
  return await recordConsentResponse(consentId, consent, channel);
}

// PUT /api/consent/:consentId/withdraw
async function withdrawConsent(consentId: string, reason?: string): Promise<ConsentRecord> {
  return await withdrawConsent(consentId, reason);
}

// GET /api/consent/:consentId
async function getConsentRecord(consentId: string): Promise<ConsentRecord> {
  return await getConsentRecord(consentId);
}

// GET /api/consent/recruitment/:recruitmentId
async function getConsentByRecruitment(recruitmentId: string): Promise<ConsentRecord> {
  return await getConsentByRecruitment(recruitmentId);
}

// POST /api/consent/purge-expired
async function purgeExpiredConsents(): Promise<number> {
  return await purgeExpiredConsents();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Processus

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de consentement | Consentements positifs / demandes | ≥ 40% |
- Taux de réponse | Réponses / demandes | ≥ 60% |
- Taux de retrait | Retraits / consentements | ≤ 5% |

### 8.2 Métriques de Conformité

| Métrique | Description | Cible |
|----------|-------------|-------|
- Taux d'anonymisation | Données anonymisées / totales | 100% |
- Taux de suppression | Données supprimées après 24 mois | 100% |

---

## 9. Exemple Complet

```markdown
ENREGISTREMENT DE CONSENTEMENT

Recrutement : REC-2026-001
Candidat : [Anonymisé]

Demande de consentement :
→ Envoyée le : 2026-02-01
→ Canal : Email
→ Contenu : Template standard

Réponse :
→ Reçue le : 2026-02-02
→ Consentement : Oui
→ Canal : Email

Suivi :
→ Ajouté à la liste de suivi
→ Suivi à 6 mois planifié pour 2026-08-01
→ Suivi à 12 mois planifié pour 2027-02-01

Retrait :
→ Aucun retrait enregistré
```

---

## 10. Conclusion

Le protocole de consentement pour le suivi structure le processus de demande, d'enregistrement et de gestion du consentement. Processus en 3 étapes : Demande de consentement (lors du refus), Enregistrement du consentement (positif/négatif/absence), Retrait du consentement (à tout moment). Gestion des données avec anonymisation, conservation 24 mois maximum, suppression automatique. Structure de données TypeScript, stockage SQL, API endpoints pour la gestion.

**Points clés :**
- Consentement explicite obligatoire
- Demande lors du refus
- Retrait possible à tout moment
- Anonymisation des données
- Conservation 24 mois maximum
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de processus et de conformité
