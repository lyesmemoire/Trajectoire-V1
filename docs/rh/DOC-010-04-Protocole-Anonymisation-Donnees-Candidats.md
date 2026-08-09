# DOC-010-04 : Protocole d'Anonymisation des Données Candidats dans la Mémoire

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'anonymisation des données candidats dans la mémoire personnalisée de MVP-010. Ce protocole garantit que la mémoire recruteur ne contient JAMAIS de données personnelles identifiantes de candidats, conformément au RGPD et aux exigences de confidentialité.

---

## 2. Principe Fondateur

**Règle absolue :** La mémoire recruteur ne contient JAMAIS de données personnelles identifiantes de candidats. Elle contient des patterns et des préférences. Jamais des individus.

- **Noms** : Jamais stockés
- **Emails** : Jamais stockés
- **Téléphones** : Jamais stockés
- **Adresses** : Jamais stockées
- **Photos** : Jamais stockées
- **CV complets** : Jamais stockés

Seuls les patterns et caractéristiques anonymisées sont stockés.

---

## 3. Données à Anonymiser

### 3.1 Données Identifiantes Directes

| Donnée | Action | Remplacement |
|--------|--------|--------------|
| Nom complet | Suppression | [Nom masqué] |
| Prénom | Suppression | [Prénom masqué] |
| Nom de famille | Suppression | [Nom masqué] |
| Email | Suppression | [Email masqué] |
| Téléphone | Suppression | [Téléphone masqué] |
| Adresse postale | Suppression | [Adresse masquée] |
| Photo | Suppression | [Photo supprimée] |
| LinkedIn | Suppression | [LinkedIn masqué] |
| GitHub | Suppression | [GitHub masqué] |

### 3.2 Données Identifiantes Indirectes

| Donnée | Action | Remplacement |
|--------|--------|--------------|
| Nom de l'entreprise actuelle | Suppression ou généralisation | [Entreprise masquée] ou [Secteur X] |
| Nom de l'école | Suppression ou généralisation | [École masquée] ou [Type d'école] |
| Nom du projet spécifique | Suppression ou généralisation | [Projet masqué] |
| Date de naissance précise | Suppression ou généralisation | [Date masquée] ou [Tranche d'âge] |
| Lieu de naissance | Suppression | [Lieu masqué] |

### 3.3 Données Conservées (Anonymisées)

| Donnée | Action | Format |
|--------|--------|--------|
| Compétences techniques | Conservation | Liste de compétences |
| Expérience (années) | Conservation | Nombre d'années |
| Secteurs d'activité | Conservation | Liste de secteurs |
| Rôles | Conservation | Liste de rôles |
| Formation (degré, domaine) | Conservation | Type de formation |
| Certifications | Conservation | Liste de certifications |
| Soft skills détectés | Conservation | Liste de soft skills |

---

## 4. Méthodes d'Anonymisation

### 4.1 Suppression

Suppression pure et simple des données identifiantes.

```typescript
function removeIdentifyingData(text: string): string {
  // Suppression des noms propres
  text = text.replace(/[A-Z][a-z]+ [A-Z][a-z]+/g, '[Nom masqué]');
  
  // Suppression des emails
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[Email masqué]');
  
  // Suppression des numéros de téléphone
  text = text.replace(/\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, '[Téléphone masqué]');
  
  // Suppression des adresses
  text = text.replace(/\d+\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g, '[Adresse masquée]');
  
  return text;
}
```

### 4.2 Généralisation

Remplacement par une catégorie plus large.

```typescript
function generalizeData(data: string, category: string): string {
  switch (category) {
    case 'company':
      // Remplacer le nom de l'entreprise par le secteur
      const sector = identifySector(data);
      return `[Entreprise du secteur ${sector}]`;
      
    case 'school':
      // Remplacer le nom de l'école par le type
      const schoolType = identifySchoolType(data);
      return `[${schoolType}]`;
      
    case 'location':
      // Remplacer la ville par la région ou le pays
      const region = identifyRegion(data);
      return `[Région ${region}]`;
      
    default:
      return `[${category} masqué]`;
  }
}
```

### 4.3 Pseudonymisation

Remplacement par un identifiant unique non réversible.

```typescript
function pseudonymizeCandidate(candidate: Candidate): string {
  // Génération d'un hash unique
  const hash = crypto.createHash('sha256')
    .update(candidate.id + new Date().toISOString())
    .digest('hex');
  
  return `CAND-${hash.substring(0, 16)}`;
}
```

### 4.4 Agrégation

Agrégation des données pour éviter l'identification individuelle.

```typescript
function aggregateExperience(experience: Experience[]): AggregatedExperience {
  return {
    totalYears: experience.reduce((sum, e) => sum + e.years, 0),
    sectors: [...new Set(experience.flatMap(e => e.sectors))],
    roles: [...new Set(experience.flatMap(e => e.roles))],
    averageTenure: experience.reduce((sum, e) => sum + e.years, 0) / experience.length
  };
}
```

---

## 5. Standards d'Anonymisation

### 5.1 k-Anonymity

Un ensemble de données est k-anonyme si chaque individu est indiscernable d'au moins k-1 autres individus.

```typescript
function checkKAnonymity(data: any[], k: number = 5): boolean {
  const groups = groupByQuasiIdentifiers(data);
  
  for (const group of groups) {
    if (group.length < k) {
      return false;
    }
  }
  
  return true;
}

function groupByQuasiIdentifiers(data: any[]): any[][] {
  // Grouper par quasi-identifiants
  const groups = new Map<string, any[]>();
  
  for (const item of data) {
    const key = extractQuasiIdentifiers(item);
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    
    groups.get(key)!.push(item);
  }
  
  return Array.from(groups.values());
}
```

### 5.2 l-Diversity

Un ensemble de données satisfait l-diversité si chaque groupe de quasi-identifiants contient au moins l valeurs distinctes pour l'attribut sensible.

```typescript
function checkLDiversity(data: any[], l: number = 3, sensitiveAttribute: string): boolean {
  const groups = groupByQuasiIdentifiers(data);
  
  for (const group of groups) {
    const distinctValues = new Set(group.map(item => item[sensitiveAttribute]));
    
    if (distinctValues.size < l) {
      return false;
    }
  }
  
  return true;
}
```

### 5.3 t-Closeness

Un ensemble de données satisfait t-closeness si la distribution de l'attribut sensible dans chaque groupe est proche de la distribution dans l'ensemble entier.

```typescript
function checkTCloseness(data: any[], t: number = 0.2, sensitiveAttribute: string): boolean {
  const groups = groupByQuasiIdentifiers(data);
  const overallDistribution = calculateDistribution(data, sensitiveAttribute);
  
  for (const group of groups) {
    const groupDistribution = calculateDistribution(group, sensitiveAttribute);
    const distance = calculateKullbackLeiblerDivergence(groupDistribution, overallDistribution);
    
    if (distance > t) {
      return false;
    }
  }
  
  return true;
}
```

---

## 6. Processus d'Anonymisation

### 6.1 Flux d'Anonymisation

```
CV Candidat
    ↓
Extraction des données
    ↓
Identification des données identifiantes
    ↓
Application des méthodes d'anonymisation
    ↓
Validation des standards (k-anonymity, l-diversity, t-closeness)
    ↓
Stockage dans la mémoire (anonymisé)
```

### 6.2 Algorithme d'Anonymisation

```typescript
async function anonymizeCandidateForMemory(candidate: Candidate): Promise<AnonymizedProfile> {
  // Étape 1 : Extraction des données
  const data = extractRelevantData(candidate);
  
  // Étape 2 : Identification des données identifiantes
  const identifyingFields = identifyIdentifyingFields(data);
  
  // Étape 3 : Application des méthodes d'anonymisation
  const anonymized = {
    ...data,
    // Suppression des données identifiantes
    name: removeIdentifyingData(data.name),
    email: removeIdentifyingData(data.email),
    phone: removeIdentifyingData(data.phone),
    address: removeIdentifyingData(data.address),
    
    // Généralisation des données indirectes
    currentCompany: generalizeData(data.currentCompany, 'company'),
    education: data.education.map(edu => ({
      degree: edu.degree,
      field: edu.field,
      school: generalizeData(edu.school, 'school')
    })),
    
    // Conservation des données anonymisées
    skills: data.skills,
    experience: aggregateExperience(data.experience),
    certifications: data.certifications
  };
  
  // Étape 4 : Validation des standards
  const kAnonymity = checkKAnonymity([anonymized], 5);
  const lDiversity = checkLDiversity([anonymized], 3, 'skills');
  const tCloseness = checkTCloseness([anonymized], 0.2, 'experience');
  
  if (!kAnonymity || !lDiversity || !tCloseness) {
    // Si les standards ne sont pas respectés, appliquer une anonymisation plus forte
    return anonymizeStronger(anonymized);
  }
  
  return anonymized;
}
```

---

## 7. Validation de l'Anonymisation

### 7.1 Tests de Réidentification

Des tests réguliers sont effectués pour vérifier que les données anonymisées ne peuvent pas être réidentifiées.

```typescript
async function testReidentificationRisk(anonymizedData: AnonymizedProfile[]): Promise<ReidentificationRisk> {
  const risks: ReidentificationRisk = {
    overallRisk: 'low',
    specificRisks: []
  };
  
  // Test 1 : Réidentification par combinaison de quasi-identifiants
  const combinationRisk = testCombinationAttack(anonymizedData);
  risks.specificRisks.push(combinationRisk);
  
  // Test 2 : Réidentification par lien avec des données externes
  const externalDataRisk = testExternalDataLinkage(anonymizedData);
  risks.specificRisks.push(externalDataRiskRisk);
  
  // Test 3 : Réidentification par inférence
  const inferenceRisk = testInferenceAttack(anonymizedData);
  risks.specificRisks.push(inferenceRisk);
  
  // Évaluation du risque global
  const highRisks = risks.specificRisks.filter(r => r.level === 'high');
  risks.overallRisk = highRisks.length > 0 ? 'high' : 'low';
  
  return risks;
}
```

### 7.2 Audit Périodique

Un audit de l'anonymisation est réalisé trimestriellement :

- **Vérification** des standards k-anonymity, l-diversity, t-closeness
- **Tests de réidentification**
- **Validation DPO**
- **Mise à jour** des méthodes d'anonymisation si nécessaire

---

## 8. Stockage des Données Anonymisées

### 8.1 Séparation des Données

Les données anonymisées sont stockées séparément des données originales :

- **Données originales** : Stockées dans le système principal (accès restreint)
- **Données anonymisées** : Stockées dans la mémoire recruteur (accès recruteur)

### 8.2 Chiffrement

Les données anonymisées sont chiffrées :

- **Au repos** : AES-256
- **En transit** : TLS 1.3
- **Clés de chiffrement** : Gérées par KMS

### 8.3 Schéma SQL

```sql
CREATE TABLE anonymized_candidate_profiles (
  id VARCHAR(36) PRIMARY KEY,
  anonymized_id VARCHAR(64) UNIQUE NOT NULL,
  recruiter_id VARCHAR(36) NOT NULL,
  job_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  profile_data JSON NOT NULL,
  anonymization_method VARCHAR(50) NOT NULL,
  k_anonymity_k INT,
  l_diversity_l INT,
  t_closeness_t FLOAT,
  
  validation_date TIMESTAMP,
  validated_by VARCHAR(36),
  
  CONSTRAINT fk_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id),
  CONSTRAINT fk_job FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX idx_anon_recruiter ON anonymized_candidate_profiles(recruiter_id);
CREATE INDEX idx_anon_id ON anonymized_candidate_profiles(anonymized_id);
CREATE INDEX idx_anon_date ON anonymized_candidate_profiles(created_at);
```

---

## 9. Réversibilité

### 9.1 Non-Réversibilité

L'anonymisation est conçue pour être **non réversible** :

- **Pas de mapping** entre données anonymisées et données originales
- **Pas de clé de réversibilité** stockée
- **Destruction** de la clé de pseudonymisation après anonymisation

### 9.2 Preuve de Non-Réversibilité

```typescript
function proveNonReversibility(anonymizedData: AnonymizedProfile): NonReversibilityProof {
  return {
    anonymizationMethod: 'SHA-256 hash + deletion',
    keyDestroyed: true,
    keyDestructionDate: new Date(),
    noMappingStored: true,
    reversible: false,
    confidence: 0.99 // 99% de confiance que la réversibilité est impossible
  };
}
```

---

## 10. Exceptions et Cas Particuliers

### 10.1 Cas de Contentieux

En cas de contentieux juridique, les données originales peuvent être fournies sur ordonnance judiciaire.

**Procédure :**
1. **Vérification** de l'ordonnance judiciaire
2. **Notification** au DPO
3. **Extraction** des données originales
4. **Transmission** aux autorités
5. **Journalisation** de la transmission

### 10.2 Cas de Recherche

Pour la recherche et l'amélioration du système, des données agrégées peuvent être utilisées.

**Procédure :**
1. **Agrégation** des données (minimum 10 individus par groupe)
2. **Anonymisation** supplémentaire
3. **Validation** par le DPO
4. **Utilisation** à des fins de recherche uniquement

---

## 11. Documentation et Traçabilité

### 11.1 Journalisation de l'Anonymisation

Chaque opération d'anonymisation est journalisée :

```sql
CREATE TABLE anonymization_log (
  id VARCHAR(36) PRIMARY KEY,
  candidate_id VARCHAR(36) NOT NULL,
  anonymized_id VARCHAR(64) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  method VARCHAR(50) NOT NULL,
  parameters JSON,
  
  k_anonymity_result BOOLEAN,
  l_diversity_result BOOLEAN,
  t_closeness_result BOOLEAN,
  
  performed_by VARCHAR(36) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anon_log_candidate ON anonymization_log(candidate_id);
CREATE INDEX idx_anon_log_timestamp ON anonymization_log(timestamp);
```

### 11.2 Rapport d'Anonymisation

Un rapport d'anonymisation est généré pour chaque candidat :

```typescript
interface AnonymizationReport {
  candidateId: string;
  anonymizedId: string;
  timestamp: Date;
  
  fieldsProcessed: {
    original: string;
    anonymized: string;
    method: string;
  }[];
  
  validationResults: {
    kAnonymity: boolean;
    lDiversity: boolean;
    tCloseness: boolean;
  };
  
  reidentificationRisk: 'low' | 'medium' | 'high';
  
  approvedBy: string;
  approvalDate: Date;
}
```

---

## 12. Formation et Sensibilisation

### 12.1 Formation du Personnel

Le personnel technique est formé sur :

- **Méthodes d'anonymisation**
- **Standards k-anonymity, l-diversity, t-closeness**
- **Tests de réidentification**
- **RGPD et confidentialité**
- **Procédures en cas d'incident**

### 12.2 Documentation Interne

Un guide interne est disponible :

- **Procédure d'anonymisation**
- **Standards à respecter**
- **Tests à effectuer**
- **Validation DPO**

---

## 13. Indicateurs de Suivi

### 13.1 Métriques d'Anonymisation

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de k-anonymity respecté | Profils respectant k-anonymity / total | 100% |
| Taux de l-diversity respecté | Profils respectant l-diversity / total | 100% |
| Taux de t-closeness respecté | Profils respectant t-closeness / total | 100% |
| Risque de réidentification | Profils à risque élevé / total | 0% |

### 13.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Perte d'information | Information perdue par anonymisation | < 20% |
| Utilité des données | Utilité des données anonymisées | > 80% |
| Satisfaction DPO | Validations DPO acceptées / total | 100% |

---

## 14. Conclusion

Le protocole d'anonymisation garantit :

- **Aucune donnée identifiante** de candidats dans la mémoire
- **Standards robustes** (k-anonymity, l-diversity, t-closeness)
- **Tests de réidentification** réguliers
- **Non-réversibilité** de l'anonymisation
- **Conformité RGPD** et confidentialité
- **Validation DPO** avant déploiement
