# DOC-033-03 : Protocole d'Anonymisation des Données (RGPD)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'anonymisation des données pour MVP-033 Real Data Foundation. Ce protocole garantit la conformité RGPD en définissant les processus d'anonymisation, les contrôles de qualité, et les tests de ré-identification pour s'assurer que les données partagées ne permettent pas l'identification des personnes concernées.

---

## 2. Principe Fondateur

L'anonymisation doit être irréversible et garantir qu'il est impossible de ré-identifier les personnes concernées, même en croisant les données avec d'autres sources. Le protocole suit les recommandations de la CNIL et du RGPD pour garantir une anonymisation de haute qualité.

---

## 3. Processus d'Anonymisation

### 3.1 Étape 1 — Identification des Données Personnelles

**Données directes à supprimer :**
- Nom complet
- Prénom
- Adresse email
- Numéro de téléphone
- Adresse postale
- Numéro de sécurité sociale
- Numéro de passeport
- Permis de conduire
- IBAN / informations bancaires

**Données indirectes à anonymiser :**
- Date de naissance (remplacée par tranche d'âge)
- Code postal (remplacé par région)
- Nom de l'entreprise (remplacé par secteur et taille)
- Titre du poste (remplacé par catégorie de poste)
- Université / École (remplacée par type d'institution)
- Localisation géographique précise (remplacée par région)

---

### 3.2 Étape 2 — Suppression des Données Directes

**Processus :**
```typescript
async function removeDirectIdentifiers(data: PersonalData): Promise<AnonymizedData> {
  const anonymized: AnonymizedData = {
    ...data,
    fullName: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    address: null,
    socialSecurityNumber: null,
    passportNumber: null,
    driversLicense: null,
    iban: null,
    bankAccount: null
  };
  
  return anonymized;
}
```

**Validation :**
- Vérification que tous les champs d'identifiants directs sont null
- Vérification qu'aucun identifiant direct ne subsiste dans les champs libres (text analysis)
- Validation par le DPO

---

### 3.3 Étape 3 — Anonymisation des Données Indirectes

**Date de naissance → Tranche d'âge :**
```
Date exacte : 15/03/1985
Tranche d'âge : 30-35 ans
```

**Code postal → Région :**
```
Code postal : 75015
Région : Île-de-France
```

**Nom de l'entreprise → Secteur + Taille :**
```
Nom : TechCorp SAS
Secteur : Technologie
Taille : 50-250 employés
```

**Titre du poste → Catégorie :**
```
Titre : Senior Software Engineer
Catégorie : Ingénierie - Senior
```

**Université → Type d'institution :**
```
Nom : École Polytechnique
Type : Grande école d'ingénieur
```

**Processus :**
```typescript
async function anonymizeIndirectIdentifiers(data: PersonalData): Promise<AnonymizedData> {
  const anonymized: AnonymizedData = {
    ...data,
    dateOfBirth: calculateAgeGroup(data.dateOfBirth),
    postalCode: mapToRegion(data.postalCode),
    companyName: mapToSectorAndSize(data.companyName),
    jobTitle: mapToJobCategory(data.jobTitle),
    university: mapToInstitutionType(data.university),
    location: mapToRegion(data.location)
  };
  
  return anonymized;
}
```

---

### 3.4 Étape 4 — Génération d'Identifiant Anonyme

**Processus :**
```typescript
async function generateAnonymousId(originalId: string): Promise<string> {
  // Utiliser un hash cryptographique irréversible
  const hash = crypto.createHash('sha256').update(originalId).digest('hex');
  
  // Prendre les 16 premiers caractères
  const anonymousId = hash.substring(0, 16);
  
  return anonymousId;
}
```

**Propriétés :**
- Irréversible (impossible de retrouver l'ID original)
- Unique (collision improbable)
- Consistant (même ID original → même ID anonyme)

---

### 3.5 Étape 5 — Nettoyage des Champs Libres

**Processus :**
```typescript
async function cleanFreeTextFields(data: PersonalData): Promise<AnonymizedData> {
  const anonymized: AnonymizedData = {
    ...data,
    // Nettoyer les champs de texte libre
    interviewTranscript: removePersonalReferences(data.interviewTranscript),
    coverLetter: removePersonalReferences(data.coverLetter),
    notes: removePersonalReferences(data.notes)
  };
  
  return anonymized;
}

async function removePersonalReferences(text: string): Promise<string> {
  // Supprimer les noms propres
  let cleaned = text.replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[NOM]');
  
  // Supprimer les emails
  cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  
  // Supprimer les numéros de téléphone
  cleaned = cleaned.replace(/\d{2}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}/g, '[TÉLÉPHONE]');
  
  // Supprimer les adresses
  cleaned = cleaned.replace(/\d+ [A-Z][a-z]+ [A-Z][a-z]+/g, '[ADRESSE]');
  
  return cleaned;
}
```

---

### 3.6 Étape 6 — Validation par le DPO

**Checklist de validation :**
- [ ] Tous les identifiants directs sont supprimés
- [ ] Les données indirectes sont anonymisées
- [ ] Les champs libres sont nettoyés
- [ ] L'identifiant anonyme est généré
- [ ] Aucune donnée personnelle ne subsiste
- [ ] Le risque de ré-identification est faible
- [ ] Le document de traçabilité est complété

**Validation :**
```typescript
async function validateAnonymization(data: AnonymizedData): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    issues: [],
    validatedBy: 'DPO',
    validatedAt: new Date()
  };
  
  // Vérification des identifiants directs
  if (data.fullName !== null) {
    result.isValid = false;
    result.issues.push('Nom complet non supprimé');
  }
  
  // Vérification des données indirectes
  if (data.dateOfBirth && !isValidAgeGroup(data.dateOfBirth)) {
    result.isValid = false;
    result.issues.push('Date de naissance non anonymisée correctement');
  }
  
  // Vérification des champs libres
  if (containsPersonalReferences(data.interviewTranscript)) {
    result.isValid = false;
    result.issues.push('Références personnelles détectées dans la transcription');
  }
  
  return result;
}
```

---

## 4. Test de Ré-identification

### 4.1 Test Annuel

**Objectif :**
Vérifier qu'il est impossible de ré-identifier les personnes concernées, même en croisant les données avec d'autres sources.

**Processus :**
1. Sélectionner un échantillon de 100 enregistrements anonymisés
2. Tenter de ré-identifier en utilisant :
   - Les données publiques disponibles
   - Les données de réseaux sociaux
   - Les bases de données commerciales
3. Documenter les tentatives et les résultats

**Critère de succès :**
- Taux de ré-identification < 1%
- Aucune ré-identification réussie avec un haut degré de confiance

---

### 4.2 Métrique de k-Anonymat

**Définition :**
Un ensemble de données est k-anonyme si chaque enregistrement est indiscernable d'au moins k-1 autres enregistrements.

**Calcul :**
```typescript
async function calculateKAnonymity(data: AnonymizedData[]): Promise<number> {
  // Regrouper par combinaison de quasi-identifiants
  const groups = groupByQuasiIdentifiers(data);
  
  // Calculer k comme la taille du plus petit groupe
  const k = Math.min(...groups.map(g => g.length));
  
  return k;
}
```

**Cible :**
k ≥ 5 (chaque enregistrement indiscernable d'au moins 4 autres)

---

### 4.3 Métrique de l-Diversité

**Définition :**
Un ensemble de données satisfait la l-diversité si pour chaque groupe de quasi-identifiants, il y a au moins l valeurs distinctes de l'attribut sensible.

**Calcul :**
```typescript
async function calculateLDiversity(data: AnonymizedData[], sensitiveAttribute: string): Promise<number> {
  const groups = groupByQuasiIdentifiers(data);
  
  const l = Math.min(...groups.map(g => {
    const distinctValues = new Set(g.map(d => d[sensitiveAttribute]));
    return distinctValues.size;
  }));
  
  return l;
}
```

**Cible :**
l ≥ 3 (au moins 3 valeurs distinctes par groupe)

---

## 5. Structure de Données (TypeScript)

```typescript
interface PersonalData {
  id: string;
  
  // Identifiants directs
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  socialSecurityNumber: string;
  passportNumber: string;
  driversLicense: string;
  iban: string;
  bankAccount: string;
  
  // Identifiants indirects
  dateOfBirth: Date;
  postalCode: string;
  companyName: string;
  jobTitle: string;
  university: string;
  location: string;
  
  // Champs libres
  interviewTranscript: string;
  coverLetter: string;
  notes: string;
  
  metadata: {
    source: string;
    collectedAt: Date;
  };
}

interface AnonymizedData {
  anonymousId: string;
  
  // Identifiants directs (null)
  fullName: null;
  firstName: null;
  lastName: null;
  email: null;
  phone: null;
  address: null;
  socialSecurityNumber: null;
  passportNumber: null;
  driversLicense: null;
  iban: null;
  bankAccount: null;
  
  // Identifiants indirects (anonymisés)
  dateOfBirth: string; // tranche d'âge
  postalCode: string; // région
  companyName: string; // secteur + taille
  jobTitle: string; // catégorie
  university: string; // type d'institution
  location: string; // région
  
  // Champs libres (nettoyés)
  interviewTranscript: string;
  coverLetter: string;
  notes: string;
  
  metadata: {
    originalId: string;
    anonymizedAt: Date;
    anonymizedBy: string;
    validatedBy: string;
    validatedAt: Date;
  };
}

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  validatedBy: string;
  validatedAt: Date;
}

interface ReidentificationTest {
  testId: string;
  testDate: Date;
  
  sampleSize: number;
  attempts: number;
  successfulReidentifications: number;
  
  kAnonymity: number;
  lDiversity: number;
  
  conclusion: string;
  recommendations: string[];
  
  metadata: {
    testedBy: string;
    version: string;
  };
}
```

---

## 6. Stockage et Gestion

### 6.1 Schéma SQL

```sql
CREATE TABLE personal_data (
  id VARCHAR(36) PRIMARY KEY,
  
  -- Identifiants directs (chiffrés)
  full_name_encrypted TEXT,
  first_name_encrypted TEXT,
  last_name_encrypted TEXT,
  email_encrypted TEXT,
  phone_encrypted TEXT,
  address_encrypted TEXT,
  social_security_number_encrypted TEXT,
  passport_number_encrypted TEXT,
  drivers_license_encrypted TEXT,
  iban_encrypted TEXT,
  bank_account_encrypted TEXT,
  
  -- Identifiants indirects
  date_of_birth DATE,
  postal_code VARCHAR(10),
  company_name VARCHAR(255),
  job_title VARCHAR(255),
  university VARCHAR(255),
  location VARCHAR(255),
  
  -- Champs libres
  interview_transcript TEXT,
  cover_letter TEXT,
  notes TEXT,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE anonymized_data (
  id VARCHAR(36) PRIMARY KEY,
  anonymous_id VARCHAR(16) NOT NULL UNIQUE,
  
  -- Identifiants directs (null)
  full_name NULL,
  first_name NULL,
  last_name NULL,
  email NULL,
  phone NULL,
  address NULL,
  social_security_number NULL,
  passport_number NULL,
  drivers_license NULL,
  iban NULL,
  bank_account NULL,
  
  -- Identifiants indirects (anonymisés)
  date_of_birth VARCHAR(20),
  postal_code VARCHAR(50),
  company_name VARCHAR(100),
  job_title VARCHAR(100),
  university VARCHAR(100),
  location VARCHAR(50),
  
  -- Champs libres (nettoyés)
  interview_transcript TEXT,
  cover_letter TEXT,
  notes TEXT,
  
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anonymized_data_anonymous_id ON anonymized_data(anonymous_id);

CREATE TABLE reidentification_test (
  id VARCHAR(36) PRIMARY KEY,
  test_date TIMESTAMP NOT NULL,
  
  sample_size INT NOT NULL,
  attempts INT NOT NULL,
  successful_reidentifications INT NOT NULL,
  
  k_anonymity INT NOT NULL,
  l_diversity INT NOT NULL,
  
  conclusion TEXT NOT NULL,
  recommendations JSON NOT NULL,
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. API Endpoints

```typescript
// POST /api/data/anonymize
async function anonymizeData(data: PersonalData): Promise<AnonymizedData> {
  return await anonymizeData(data);
}

// POST /api/data/anonymize/batch
async function anonymizeDataBatch(data: PersonalData[]): Promise<AnonymizedData[]> {
  return await anonymizeDataBatch(data);
}

// POST /api/data/anonymize/validate
async function validateAnonymization(data: AnonymizedData): Promise<ValidationResult> {
  return await validateAnonymization(data);
}

// POST /api/data/anonymize/reidentification-test
async function performReidentificationTest(sampleSize: number): Promise<ReidentificationTest> {
  return await performReidentificationTest(sampleSize);
}

// GET /api/data/anonymize/metrics
async function getAnonymizationMetrics(): Promise<any> {
  return await getAnonymizationMetrics();
}
```

---

## 8. Indicateurs de Suivi

### 8.1 Métriques de Qualité de l'Anonymisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de validation | Données validées / total | 100% |
- k-Anonymat | Taille du plus petit groupe | ≥ 5 |
- l-Diversité | Valeurs distinctes par groupe | ≥ 3 |
- Taux de ré-identification | Ré-identifications / tentatives | < 1% |

### 8.2 Métriques de Processus

| Métrique | Description | Cible |
|----------|-------------|-------|
- Temps d'anonymisation | Temps moyen par enregistrement | ≤ 1 seconde |
- Taux d'erreur | Erreurs / total | < 0.1% |
- Taux de révision | Révisions manuelles / total | < 5% |

---

## 9. Conclusion

Le protocole d'anonymisation des données garantit la conformité RGPD en définissant les processus d'anonymisation (suppression des identifiants directs, anonymisation des identifiants indirects, nettoyage des champs libres), les contrôles de qualité (validation par le DPO), et les tests de ré-identification (test annuel, k-anonymat, l-diversité). Le protocole assure que les données partagées ne permettent pas l'identification des personnes concernées.

**Points clés :**
- 6 étapes d'anonymisation structurées
- Suppression des identifiants directs
- Anonymisation des identifiants indirects
- Génération d'identifiant anonyme
- Nettoyage des champs libres
- Validation par le DPO
- Test annuel de ré-identification
- Métriques k-anonymat et l-diversité
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de qualité et de processus
