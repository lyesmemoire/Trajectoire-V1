# DOC-012-02 : Protocole d'Acquisition Mensuelle

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole d'acquisition mensuelle pour l'enrichissement du Knowledge Pack RH (MVP-012). Ce protocole couvre la Semaine 1 du cycle mensuel : téléchargement des mises à jour des sources et identification des nouvelles entrées.

---

## 2. Principe Fondateur

Le Knowledge Pack doit être enrichi continuellement pour garantir une couverture maximale des termes et relations. L'acquisition mensuelle des données sources est la première étape du cycle d'enrichissement.

---

## 3. Calendrier Mensuel

### 3.1 Cycle Mensuel

| Semaine | Activité | Responsable |
|---------|----------|-------------|
| Semaine 1 | Acquisition | Équipe technique |
| Semaine 2 | Qualification | DRH référent + Équipe technique |
| Semaine 3 | Validation | DRH référent |
| Semaine 4 | Déploiement | Équipe technique |

### 3.2 Planning Mensuel

**Jour 1 (Lundi) :**
- Téléchargement des mises à jour ROME 4.0
- Téléchargement des mises à jour ESCO v1.1
- Téléchargement des mises à jour RNCP/RS

**Jour 2 (Mardi) :**
- Téléchargement des mises à jour OPCO (si applicable)
- Extraction des synonymes terrain (feedbacks beta)
- Compilation des nouvelles entrées

**Jour 3 (Mercredi) :**
- Identification des modifications
- Comparaison avec la version précédente
- Génération du rapport d'acquisition

**Jour 4 (Jeudi) :**
- Validation du rapport d'acquisition
- Transmission à l'équipe de qualification
- Documentation des changements

**Jour 5 (Vendredi) :**
- Revue de fin de semaine
- Planification de la semaine 2 (Qualification)

---

## 4. Processus d'Acquisition

### 4.1 Flux d'Acquisition

```
Source externe
    ↓
Téléchargement (API / Export)
    ↓
Extraction des données
    ↓
Identification des nouvelles entrées
    ↓
Identification des modifications
    ↓
Comparaison avec version précédente
    ↓
Génération du rapport d'acquisition
    ↓
Transmission à l'équipe de qualification
```

### 4.2 Algorithme d'Acquisition

```typescript
async function acquireSourceData(source: Source): Promise<AcquisitionResult> {
  // Étape 1 : Téléchargement
  const rawData = await downloadData(source);
  
  // Étape 2 : Extraction
  const extractedData = extractData(rawData, source.type);
  
  // Étape 3 : Identification des nouvelles entrées
  const newEntries = identifyNewEntries(extractedData, source.lastVersion);
  
  // Étape 4 : Identification des modifications
  const modifiedEntries = identifyModifications(extractedData, source.lastVersion);
  
  // Étape 5 : Comparaison avec version précédente
  const comparison = compareWithPreviousVersion(extractedData, source.lastVersion);
  
  // Étape 6 : Génération du rapport
  const report = generateAcquisitionReport({
    source,
    rawData,
    extractedData,
    newEntries,
    modifiedEntries,
    comparison
  });
  
  // Étape 7 : Transmission
  await transmitToQualificationTeam(report);
  
  // Étape 8 : Documentation
  await documentAcquisition(report);
  
  return {
    success: true,
    newEntriesCount: newEntries.length,
    modifiedEntriesCount: modifiedEntries.length,
    report
  };
}
```

---

## 5. Acquisition par Source

### 5.1 ROME 4.0 (France Travail)

**Méthode d'acquisition :** API publique

**Endpoint :**
- Base URL : https://api.francetravail.fr/romes
- Endpoint : /jobs
- Paramètres : ?format=json&version=latest

**Script d'acquisition :**

```typescript
async function acquireROMEData(): Promise<ROMEData> {
  const response = await fetch('https://api.francetravail.fr/romes/jobs?format=json&version=latest', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Trajectoire-MVP012/1.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`ROME API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    source: 'ROME_4.0',
    version: data.version,
    jobs: data.jobs,
    lastUpdated: new Date()
  };
}
```

**Fréquence :** Trimestrielle (Jour 1 du mois)

**Données acquises :**
- 531 fiches métier
- Compétences par métier
- Appellations et synonymes
- Relations entre métiers

---

### 5.2 ESCO v1.1 (Commission Européenne)

**Méthode d'acquisition :** API publique

**Endpoint :**
- Base URL : https://ec.europa.eu/esco/api
- Endpoint : /resource/skill
- Paramètres : ?language=fr&format=json

**Script d'acquisition :**

```typescript
async function acquireESCOData(): Promise<ESCOData> {
  const response = await fetch('https://ec.europa.eu/esco/api/resource/skill?language=fr&format=json', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Trajectoire-MVP012/1.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`ESCO API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    source: 'ESCO_v1.1',
    version: data.version,
    skills: data.skills,
    lastUpdated: new Date()
  };
}
```

**Fréquence :** Semestrielle (Jour 1 du mois concerné)

**Données acquises :**
- 13890 compétences
- Hiérarchie des compétences
- Synonymes multilingues
- Relations entre compétences

---

### 5.3 RNCP / RS (France Compétences)

**Méthode d'acquisition :** API publique

**Endpoint :**
- Base URL : https://api.francecompetences.fr
- Endpoint : /certifications
- Paramètres : ?format=json&version=latest

**Script d'acquisition :**

```typescript
async function acquireRNCPData(): Promise<RNCPData> {
  const response = await fetch('https://api.francecompetences.fr/certifications?format=json&version=latest', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Trajectoire-MVP012/1.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`RNCP API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    source: 'RNCP_RS',
    version: data.version,
    certifications: data.certifications,
    lastUpdated: new Date()
  };
}
```

**Fréquence :** Mensuelle (Jour 1 du mois)

**Données acquises :**
- Certifications professionnelles
- Niveaux de qualification
- Blocs de compétences
- Équivalences reconnues

---

### 5.4 Référentiels OPCO

**Méthode d'acquisition :** Export manuel / Semi-automatique

**Processus :**
1. Contact avec OPCO concerné
2. Demande d'export des données
3. Réception du fichier (CSV/Excel)
4. Conversion en JSON
5. Intégration dans le processus

**Script de conversion :**

```typescript
async function convertOPCOData(filePath: string): Promise<OPCOData> {
  const csvData = await readCSV(filePath);
  const jsonData = convertCSVToJSON(csvData);
  
  return {
    source: 'OPCO',
    sector: jsonData.sector,
    certifications: jsonData.certifications,
    diplomas: jsonData.diplomas,
    lastUpdated: new Date()
  };
}
```

**Fréquence :** Annuelle (Janvier)

**Données acquises :**
- Compétences sectorielles spécifiques
- Certifications sectorielles
- Diplômes professionnels
- Normes sectorielles

---

### 5.5 Synonymes Terrain

**Méthode d'acquisition :** Extraction manuelle

**Sources :**
- Feedbacks beta recruteurs (MVP-011)
- CV analysés pendant le beta
- Offres d'emploi analysées
- Entretiens avec recruteurs

**Processus d'extraction :**

```typescript
async function extractTerrainSynonyms(): Promise<TerrainSynonyms> {
  // Extraction des feedbacks beta
  const betaFeedbacks = await extractFromBetaFeedbacks();
  
  // Extraction des CV analysés
  const cvTerms = await extractFromAnalyzedCVs();
  
  // Extraction des offres analysées
  const offerTerms = await extractFromAnalyzedOffers();
  
  // Consolidation
  const allSynonyms = [
    ...betaFeedbacks,
    ...cvTerms,
    ...offerTerms
  ];
  
  // Déduplication
  const deduplicated = deduplicateSynonyms(allSynonyms);
  
  return {
    source: 'terrain',
    synonyms: deduplicated,
    lastUpdated: new Date()
  };
}
```

**Fréquence :** Mensuelle (Jour 2 du mois)

**Données acquises :**
- Termes réels utilisés dans les CV
- Termes réels utilisés dans les offres
- Formulations alternatives
- Jargon métier

---

## 6. Identification des Nouvelles Entrées

### 6.1 Algorithme d'Identification

```typescript
function identifyNewEntries(currentData: any[], lastVersion: any[]): any[] {
  const currentIds = new Set(currentData.map(d => d.id));
  const lastVersionIds = new Set(lastVersion.map(d => d.id));
  
  const newIds = [...currentIds].filter(id => !lastVersionIds.has(id));
  
  return currentData.filter(d => newIds.has(d.id));
}
```

### 6.2 Rapport de Nouvelles Entrées

```typescript
interface NewEntriesReport {
  source: string;
  newEntriesCount: number;
  newEntries: {
    id: string;
    type: string;
    description: string;
  }[];
}
```

---

## 7. Identification des Modifications

### 7.1 Algorithme d'Identification

```typescript
function identifyModifications(currentData: any[], lastVersion: any[]): any[] {
  const modifiedEntries = [];
  
  for (const current of currentData) {
    const last = lastVersion.find(d => d.id === current.id);
    
    if (!last) continue;
    
    if (!deepEqual(current, last)) {
      modifiedEntries.push({
        id: current.id,
        type: current.type,
        modifications: getModifications(current, last)
      });
    }
  }
  
  return modifiedEntries;
}

function getModifications(current: any, last: any): Modification[] {
  const modifications: Modification[] = [];
  
  for (const key of Object.keys(current)) {
    if (current[key] !== last[key]) {
      modifications.push({
        field: key,
        oldValue: last[key],
        newValue: current[key]
      });
    }
  }
  
  return modifications;
}
```

### 7.2 Rapport de Modifications

```typescript
interface ModificationsReport {
  source: string;
  modifiedEntriesCount: number;
  modifiedEntries: {
    id: string;
    type: string;
    modifications: Modification[];
  }[];
}
```

---

## 8. Comparaison avec Version Précédente

### 8.1 Algorithme de Comparaison

```typescript
function compareWithPreviousVersion(currentData: any[], lastVersion: any[]): ComparisonResult {
  const currentCount = currentData.length;
  const lastCount = lastVersion.length;
  
  const newEntries = identifyNewEntries(currentData, lastVersion);
  const modifiedEntries = identifyModifications(currentData, lastVersion);
  const deletedEntries = identifyDeletedEntries(currentData, lastVersion);
  
  return {
    source: currentData.source,
    currentCount,
    lastCount,
    newEntriesCount: newEntries.length,
    modifiedEntriesCount: modifiedEntries.length,
    deletedEntriesCount: deletedEntries.length,
    delta: currentCount - lastCount
  };
}
```

### 8.2 Rapport de Comparaison

```typescript
interface ComparisonResult {
  source: string;
  currentCount: number;
  lastCount: number;
  newEntriesCount: number;
  modifiedEntriesCount: number;
  deletedEntriesCount: number;
  delta: number;
}
```

---

## 9. Rapport d'Acquisition

### 9.1 Structure du Rapport

```typescript
interface AcquisitionReport {
  reportId: string;
  acquisitionDate: Date;
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  sources: {
    rome: ComparisonResult;
    esco: ComparisonResult;
    rncp: ComparisonResult;
    opco?: ComparisonResult;
    terrain: ComparisonResult;
  };
  
  summary: {
    totalNewEntries: number;
    totalModifiedEntries: number;
    totalDeletedEntries: number;
    totalDelta: number;
  };
  
  details: {
    newEntries: NewEntriesReport[];
    modifications: ModificationsReport[];
  };
  
  transmission: {
    transmittedTo: string[];
    transmissionDate: Date;
    acknowledgedBy: string[];
  };
}
```

### 9.2 Template de Rapport

```
┌─────────────────────────────────────────┐
│ RAPPORT D'ACQUISITION MENSUELLE        │
├─────────────────────────────────────────┤
│                                         │
| Rapport ID : [REPORT-ID]               │
| Date d'acquisition : [DD/MM/YYYY]       │
| Période : [DD/MM/YYYY - DD/MM/YYYY]     │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ RÉSUMÉ                                │
├─────────────────────────────────────────┤
│                                         │
| Nouvelles entrées : [XXX]               │
| Entrées modifiées : [XXX]               │
| Entrées supprimées : [XXX]              │
| Delta total : [+/- XXX]                 │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ PAR SOURCE                             │
├─────────────────────────────────────────┤
│                                         │
| ROME 4.0 :                             │
| • Entrées actuelles : [XXX]             │
| • Entrées précédentes : [XXX]           │
| • Nouvelles entrées : [XXX]             │
| • Entrées modifiées : [XXX]             │
| • Delta : [+/- XXX]                     │
│                                         │
| ESCO v1.1 :                            │
| • Entrées actuelles : [XXX]             │
| • Entrées précédentes : [XXX]           │
| • Nouvelles entrées : [XXX]             │
| • Entrées modifiées : [XXX]             │
| • Delta : [+/- XXX]                     │
│                                         │
| RNCP/RS :                              │
| • Entrées actuelles : [XXX]             │
| • Entrées précédentes : [XXX]           │
| • Nouvelles entrées : [XXX]             │
| • Entrées modifiées : [XXX]             │
| • Delta : [+/- XXX]                     │
│                                         │
| Synonymes terrain :                     │
| • Entrées actuelles : [XXX]             │
| • Entrées précédentes : [XXX]           │
| • Nouvelles entrées : [XXX]             │
| • Entrées modifiées : [XXX]             │
| • Delta : [+/- XXX]                     │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ TRANSMISSION                           │
├─────────────────────────────────────────┤
│                                         │
| Transmis à :                           │
| • Équipe de qualification               │
| • DRH référent                         │
|                                         │
| Date de transmission : [DD/MM/YYYY]    │
│                                         │
| Accusés de réception :                 │
| • [Nom] - [Date]                       │
│ • [Nom] - [Date]                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 10. Transmission à l'Équipe de Qualification

### 10.1 Processus de Transmission

**Étape 1 :** Génération du rapport d'acquisition  
**Étape 2 :** Validation du rapport  
**Étape 3 :** Transmission par email  
**Étape 4 :** Accusé de réception  
**Étape 5 :** Documentation

### 10.2 Email de Transmission

**Objet :** Rapport d'acquisition mensuelle - [Mois] [Année]

**Corps :**

```
Bonjour,

Le rapport d'acquisition mensuelle pour [Mois] [Année] est disponible.

Résumé :
- Nouvelles entrées : [XXX]
- Entrées modifiées : [XXX]
- Entrées supprimées : [XXX]
- Delta total : [+/- XXX]

Le rapport complet est disponible en pièce jointe.

Merci de confirmer réception.

Cordialement,
Équipe technique Trajectoire
```

---

## 11. Documentation des Changements

### 11.1 Journalisation

```sql
CREATE TABLE acquisition_log (
  id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36) UNIQUE NOT NULL,
  acquisition_date TIMESTAMP NOT NULL,
  
  source VARCHAR(50) NOT NULL,
  current_count INT NOT NULL,
  last_count INT NOT NULL,
  new_entries_count INT NOT NULL,
  modified_entries_count INT NOT NULL,
  deleted_entries_count INT NOT NULL,
  delta INT NOT NULL,
  
  report_path VARCHAR(255),
  
  transmitted_to VARCHAR(255),
  transmission_date TIMESTAMP,
  acknowledged_by VARCHAR(255),
  acknowledgment_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_acq_source ON acquisition_log(source);
CREATE INDEX idx_acq_date ON acquisition_log(acquisition_date);
```

### 11.2 Stockage des Données Acquises

Les données acquises sont stockées dans :

- **S3 Bucket** : Données brutes
- **Base de données** : Données structurées
- **Git** : Version control (format JSON)

### 11.3 Nom de Fichier

Format : `ACQUISITION-[SOURCE]-[YYYY-MM].json`

Exemple : `ACQUISITION-ROME-2026-10.json`

---

## 12. Gestion des Erreurs

### 12.1 Types d'Erreurs

| Type d'erreur | Description | Action |
|--------------|-------------|--------|
| API indisponible | L'API source ne répond pas | Réessayer après 1h, utiliser cache |
| Données invalides | Les données ne correspondent pas au format attendu | Contacter le support source |
| Erreur de parsing | Impossible de parser les données | Corriger le script de parsing |
| Erreur de réseau | Problème de connexion | Réessayer, vérifier la connexion |

### 12.2 Algorithme de Gestion des Erreurs

```typescript
async function handleAcquisitionError(error: Error, source: Source): Promise<void> {
  // Log de l'erreur
  await logError({
    source: source.id,
    error: error.message,
    timestamp: new Date()
  });
  
  // Notification à l'équipe technique
  await notifyTechnicalTeam({
    source: source.id,
    error: error.message,
    severity: 'high'
  });
  
  // Utilisation du cache si disponible
  if (source.cacheAvailable) {
    const cachedData = await getCachedData(source.id);
    if (cachedData) {
      await useCachedData(source.id, cachedData);
      return;
    }
  }
  
  // Fallback manuel
  await initiateManualAcquisition(source);
}
```

---

## 13. Indicateurs de Suivi

### 13.1 Métriques d'Acquisition

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de réussite d'acquisition | Acquisitions réussies / total | ≥ 95% |
| Temps moyen d'acquisition | Temps moyen d'acquisition par source | < 2 heures |
| Taux de nouvelles entrées | Nouvelles entrées / total | ≥ 5% |
| Taux de modifications | Modifications / total | ≤ 10% |

### 13.2 Métriques par Source

| Source | Nouvelles entrées (moyenne) | Modifications (moyenne) | Delta (moyenne) |
|--------|---------------------------|-------------------------|----------------|
| ROME 4.0 | ~5 | ~10 | +15 |
| ESCO v1.1 | ~50 | ~100 | +150 |
| RNCP/RS | ~10 | ~20 | +30 |
| Synonymes terrain | ~20 | ~5 | +25 |

---

## 14. Conclusion

Le protocole d'acquisition mensuelle définit le processus de téléchargement des mises à jour des sources et l'identification des nouvelles entrées. Ce protocole garantit que le Knowledge Pack est continuellement enrichi avec des données fraîches.

**Points clés :**
- Acquisition automatique via API pour ROME, ESCO, RNCP
- Acquisition semi-automatique pour OPCO
- Acquisition manuelle pour synonymes terrain
- Identification des nouvelles entrées et modifications
- Comparaison avec version précédente
- Rapport d'acquisition structuré
- Transmission à l'équipe de qualification
