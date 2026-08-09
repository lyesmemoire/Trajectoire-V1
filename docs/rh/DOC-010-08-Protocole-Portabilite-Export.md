# DOC-010-08 : Protocole de Portabilité et Export

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de portabilité et d'export de la mémoire personnalisée de MVP-010. Ce protocole garantit que le recruteur peut exporter ses données de mémoire et les transférer vers un autre système, conformément au RGPD Article 20 (droit à la portabilité).

---

## 2. Principe Fondateur

Transparence totale pour le recruteur :
- Il peut exporter sa mémoire (portabilité)
- Il peut transférer sa mémoire vers un autre système
- Il peut choisir le format d'export
- Il peut choisir les données à exporter

---

## 3. Base Légale

### 3.1 RGPD Article 20 — Droit à la Portabilité

**Texte officiel :**
> "La personne concernée a le droit de recevoir les données à caractère personnel la concernant qu'elle a fournies à un responsable du traitement, dans un format structuré, couramment utilisé et lisible par machine, et a le droit de transmettre ces données à un autre responsable du traitement sans que le responsable du traitement auquel les données à caractère personnel ont été fournies y fasse obstacle."

**Exigences :**
- **Format structuré** : JSON, CSV, XML
- **Lisible par machine** : Format standard
- **Transmission** : Possibilité de transférer à un autre responsable

### 3.2 Droit à la Portabilité

Le recruteur a le droit de :
- **Recevoir** ses données dans un format structuré
- **Transférer** ses données à un autre système
- **Demander** la transmission directe entre systèmes

---

## 4. Formats d'Export

### 4.1 Formats Disponibles

| Format | Description | Avantages | Inconvénients |
|--------|-------------|-----------|---------------|
| JSON | Structuré, lisible par machine | Standard web, hiérarchique | Moins lisible par humain |
| CSV | Tabulaire, lisible par machine | Compatible Excel, simple | Pas de hiérarchie |
| PDF | Lisible par humain | Facile à lire, partageable | Pas structuré pour machine |
| XML | Structuré, lisible par machine | Standard, extensible | Verbeux |

### 4.2 Format Recommandé

**JSON** est le format recommandé pour la portabilité car :
- Structuré et hiérarchique
- Lisible par machine
- Standard web
- Compatible avec la plupart des systèmes

---

## 5. Structure de l'Export

### 5.1 Structure de Données

```typescript
interface MemoryExport {
  exportId: string;
  recruiterId: string;
  exportDate: Date;
  version: string;
  format: 'json' | 'csv' | 'pdf' | 'xml';
  
  metadata: {
    totalSize: number;
    recordCount: number;
    layersIncluded: string[];
    checksum: string;
    encryption: boolean;
  };
  
  layers: {
    layer1?: RecruiterPreferenceProfile;
    layer2?: DecisionHistory[];
    layer3?: OrganizationalContext;
    layer4?: AccumulatedLearnings;
  };
  
  compliance: {
    gdprCompliant: boolean;
    anonymizationApplied: boolean;
    noPersonalData: boolean;
  };
}
```

### 5.2 Exemple d'Export JSON

```json
{
  "exportId": "EXP-20260803-001",
  "recruiterId": "REC-12345",
  "exportDate": "2026-08-03T14:30:45.123Z",
  "version": "1.0",
  "format": "json",
  
  "metadata": {
    "totalSize": 524288,
    "recordCount": 47,
    "layersIncluded": ["layer1", "layer2", "layer3", "layer4"],
    "checksum": "sha256:abc123...",
    "encryption": false
  },
  
  "layers": {
    "layer1": {
      "explicitPreferences": {
        "preferredSectors": ["Tech", "FinTech"],
        "preferredJobTypes": ["Développeur", "DevOps"],
        "eliminationCriteria": [...]
      },
      "implicitPreferences": {
        "decisionPatterns": [...],
        "overWeightedCriteria": [...]
      }
    },
    "layer2": [...],
    "layer3": [...],
    "layer4": [...]
  },
  
  "compliance": {
    "gdprCompliant": true,
    "anonymizationApplied": true,
    "noPersonalData": true
  }
}
```

---

## 6. Processus d'Export

### 6.1 Flux d'Export

```
Demande d'export
    ↓
Authentification (MFA)
    ↓
Sélection des données à exporter
    ↓
Sélection du format
    ↓
Validation des droits
    ↓
Anonymisation des données
    ↓
Génération du fichier
    ↓
Calcul du checksum
    ↓
Chiffrement (optionnel)
    ↓
Transmission au recruteur
    ↓
Journalisation
```

### 6.2 Algorithme d'Export

```typescript
async function exportMemory(
 recruiterId: string,
 options: ExportOptions
): Promise<ExportResult> {
  // Étape 1 : Authentification
  await authenticateWithMFA(recruiterId);
  
  // Étape 2 : Validation des droits
  await validateExportRights(recruiterId);
  
  // Étape 3 : Récupération des données
  const data = await collectMemoryData(recruiterId, options.layers);
  
  // Étape 4 : Anonymisation
  const anonymizedData = await anonymizeForExport(data);
  
  // Étape 5 : Génération du fichier
  const file = await generateExportFile(anonymizedData, options.format);
  
  // Étape 6 : Calcul du checksum
  const checksum = calculateChecksum(file);
  
  // Étape 7 : Chiffrement (optionnel)
  if (options.encrypt) {
    const encryptedFile = await encryptFile(file);
    file = encryptedFile;
  }
  
  // Étape 8 : Transmission
  await transmitFile(recruiterId, file);
  
  // Étape 9 : Journalisation
  await logExport({
    recruiterId,
    exportId: generateUUID(),
    options,
    checksum,
    timestamp: new Date()
  });
  
  return {
    exportId: generateUUID(),
    success: true,
    file,
    checksum
  };
}
```

### 6.3 Options d'Export

```typescript
interface ExportOptions {
  layers: ('layer1' | 'layer2' | 'layer3' | 'layer4')[];
  format: 'json' | 'csv' | 'pdf' | 'xml';
  encrypt: boolean;
  includeMetadata: boolean;
  includeComplianceInfo: boolean;
}
```

---

## 7. Interface d'Export

### 7.1 Sélection des Données

```
┌─────────────────────────────────────────┐
│ EXPORTER MA MÉMOIRE                    │
├─────────────────────────────────────────┤
│                                         │
│ Sélectionnez les données à exporter :   │
│                                         │
│ [✓] COUCHE 1 — Profil de préférence     │
│   [✓] Préférences explicites            │
│   [✓] Préférences implicites            │
│   [✓] Alertes de biais                 │
│                                         │
│ [✓] COUCHE 2 — Historique de décisions  │
│   [✓] Recrutements réussis              │
│   [✓] Recrutements ratés                │
│   [✓] Décisions regrettées             │
│                                         │
│ [✓] COUCHE 3 — Contexte organisationnel│
│   [✓] Managers                          │
│   [✓] Équipes cibles                    │
│   [✓] Organisation                     │
│                                         │
│ [✓] COUCHE 4 — Apprentissages accumulés │
│   [✓] Règles contextuelles              │
│   [✓] Patterns prédicteurs             │
│   [✓] Anti-patterns                     │
│                                         │
│ [Tout sélectionner] [Tout désélectionner]│
│                                         │
│ [Suivant]                               │
└─────────────────────────────────────────┘
```

### 7.2 Sélection du Format

```
┌─────────────────────────────────────────┐
│ EXPORTER MA MÉMOIRE                    │
├─────────────────────────────────────────┤
│                                         │
│ Choisissez le format d'export :         │
│                                         │
│ ○ JSON (Recommandé)                   │
│   Structuré, lisible par machine,       │
│   compatible avec la plupart des        │
│   systèmes                              │
│                                         │
│ ○ CSV                                  │
│   Tabulaire, compatible Excel, simple   │
│                                         │
│ ○ PDF                                  │
│   Lisible par humain, facile à partager│
│                                         │
│ ○ XML                                  │
│   Structuré, extensible, standard      │
│                                         │
│ [Précédent]              [Suivant]       │
└─────────────────────────────────────────┘
```

### 7.3 Options Avancées

```
┌─────────────────────────────────────────┐
│ EXPORTER MA MÉMOIRE                    │
├─────────────────────────────────────────┤
│                                         │
│ Options avancées :                      │
│                                         │
| [✓] Chiffrer le fichier                │
│   (protège le fichier avec un mot de   │
│    passe)                               │
│                                         │
| [✓] Inclure les métadonnées            │
│   (informations sur l'export)            │
│                                         │
│ [✓] Inclure les informations de        │
│   conformité                           │
│                                         │
│ [✓] Générer un rapport de conformité   │
│                                         │
│ [Précédent]              [Exporter]     │
└─────────────────────────────────────────┘
```

### 7.4 Confirmation et Téléchargement

```
┌─────────────────────────────────────────┐
│ EXPORT EN COURS                        │
├─────────────────────────────────────────┤
│                                         │
│ Préparation de l'export...              │
│ ████████████████████░░░░░ 70%          │
│                                         │
| • Récupération des données ✅            │
│ • Anonymisation ✅                      │
│ • Génération du fichier ⏳               │
│ • Calcul du checksum ⏳                  │
│                                         │
│ Ne fermez pas cette fenêtre...          │
└─────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────┐
│ EXPORT TERMINÉ                          │
├─────────────────────────────────────────┤
│                                         │
│ ✅ Export réussi                        │
│                                         │
| Fichier : memory_export_20260803.json  │
│ Taille : 512 KB                         │
│ Checksum : sha256:abc123...             │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ ACTIONS                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| [Télécharger le fichier]                │
│ [Envoyer par email]                     │
| [Transférer à un autre système]         │
│ [Voir le rapport de conformité]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Transmission Directe

### 8.1 Processus de Transmission Directe

Le recruteur peut demander une transmission directe de ses données à un autre responsable du traitement.

```typescript
interface DirectTransferRequest {
  recruiterId: string;
  targetSystem: string;
  targetEndpoint: string;
  authentication: {
    type: 'api_key' | 'oauth' | 'basic_auth';
    credentials: string;
  };
  
  dataSelection: ExportOptions;
}
```

### 8.2 Algorithme de Transmission Directe

```typescript
async function directTransfer(request: DirectTransferRequest): Promise<TransferResult> {
  // Étape 1 : Validation de la demande
  await validateTransferRequest(request);
  
  // Étape 2 : Récupération des données
  const data = await collectMemoryData(request.recruiterId, request.dataSelection.layers);
  
  // Étape 3 : Anonymisation
  const anonymizedData = await anonymizeForExport(data);
  
  // Étape 4 : Conversion au format cible
  const convertedData = await convertToTargetFormat(anonymizedData, request.targetSystem);
  
  // Étape 5 : Transmission
  const result = await transmitToTarget(request.targetEndpoint, convertedData, request.authentication);
  
  // Étape 6 : Confirmation
  await confirmTransfer(request.recruiterId, result);
  
  // Étape 7 : Journalisation
  await logTransfer({
    recruiterId: request.recruiterId,
    targetSystem: request.targetSystem,
    timestamp: new Date(),
    success: result.success
  });
  
  return result;
}
```

### 8.3 Interface de Transmission Directe

```
┌─────────────────────────────────────────┐
│ TRANSMISSION DIRECTE                   │
├─────────────────────────────────────────┤
│                                         │
│ Système cible :                        │
│ [_____________________________]           │
│                                         │
│ Endpoint :                             │
│ [https://api.target-system.com/import]  │
│                                         │
│ Méthode d'authentification :           │
│ ○ API Key                              │
│ ○ OAuth 2.0                            │
│ ○ Basic Auth                           │
│                                         │
│ Clé / Token :                          │
│ [_____________________________]           │
│                                         │
| Données à transférer :                 │
│ [Sélectionner les données]               │
│                                         │
│ [Annuler]              [Transférer]     │
└─────────────────────────────────────────┘
```

---

## 9. Séparation des Contextes

### 9.1 Changement d'Entreprise

Si le recruteur change d'entreprise, il peut choisir de :

- **Réinitialiser partiellement** : Conserver les préférences de compétences, effacer le contexte organisationnel
- **Réinitialiser totalement** : Effacer toutes les données
- **Conserver tout** : Transférer toutes les données (si pertinent)

### 9.2 Interface de Séparation

```
┌─────────────────────────────────────────┐
│ CHANGEMENT D'ENTREPRISE                │
├─────────────────────────────────────────┤
│                                         │
│ Vous avez changé d'entreprise. Que     │
│ souhaitez-vous faire de votre mémoire ? │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ OPTIONS                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| ○ Réinitialiser partiellement           │
│   Conserver :                            │
│   • Préférences de compétences          │
│   • Préférences de types de postes       │
│                                         │
|   Effacer :                              │
│   • Contexte organisationnel           │
│   • Managers spécifiques                │
│   • Équipes spécifiques                 │
│                                         │
| ○ Réinitialiser totalement             │
│   Effacer toutes les données et         │
│   recommencer à zéro                    │
│                                         │
| ○ Conserver tout                       │
|   Transférer toutes les données         │
│   (si pertinent pour le nouveau poste)   │
│                                         │
│ [Annuler]              [Confirmer]       │
└─────────────────────────────────────────┘
```

---

## 10. Import de Données

### 10.1 Processus d'Import

Le recruteur peut importer des données depuis un fichier d'export précédent.

```typescript
async function importMemory(
 recruiterId: string,
 file: File,
 options: ImportOptions
): Promise<ImportResult> {
  // Étape 1 : Validation du fichier
  const validation = await validateImportFile(file);
  if (!validation.valid) {
    throw new Error('Fichier invalide');
  }
  
  // Étape 2 : Lecture du fichier
  const data = await readImportFile(file);
  
  // Étape 3 : Vérification du checksum
  const checksumValid = await verifyChecksum(data);
  if (!checksumValid) {
    throw new Error('Checksum invalide');
  }
  
  // Étape 4 : Déchiffrement (si nécessaire)
  let decryptedData = data;
  if (data.encrypted) {
    decryptedData = await decryptData(data);
  }
  
  // Étape 5 : Validation de la structure
  const structureValid = await validateStructure(decryptedData);
  if (!structureValid) {
    throw new Error('Structure invalide');
  }
  
  // Étape 6 : Fusion avec les données existantes
  const mergedData = await mergeWithExisting(recruiterId, decryptedData, options);
  
  // Étape 7 : Validation de la conformité
  const complianceValid = await validateCompliance(mergedData);
  if (!complianceValid) {
    throw new Error('Données non conformes');
  }
  
  // Étape 8 : Import
  await importData(recruiterId, mergedData);
  
  // Étape 9 : Journalisation
  await logImport({
    recruiterId,
    importId: generateUUID(),
    options,
    timestamp: new Date()
  });
  
  return {
    importId: generateUUID(),
    success: true,
    recordsImported: mergedData.length
  };
}
```

### 10.2 Options d'Import

```typescript
interface ImportOptions {
  mergeStrategy: 'replace' | 'merge' | 'skip_conflicts';
  validateCompliance: boolean;
  backupExisting: boolean;
}
```

### 10.3 Interface d'Import

```
┌─────────────────────────────────────────┐
│ IMPORTER DES DONNÉES                   │
├─────────────────────────────────────────┤
│                                         │
│ Sélectionnez le fichier à importer :    │
│                                         │
│ [Choisir un fichier]                    │
│ memory_export_20260115.json             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ OPTIONS D'IMPORT                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Stratégie de fusion :                   │
│ ○ Remplacer (écraser les données         │
|   existantes)                           │
│ ○ Fusionner (combiner les données)       │
│ ○ Ignorer les conflits                  │
│                                         │
| [✓] Valider la conformité RGPD         │
│ [✓] Sauvegarder les données existantes   │
│                                         │
│ [Annuler]              [Importer]       │
└─────────────────────────────────────────┘
```

---

## 11. Sécurité de l'Export

### 11.1 Chiffrement

L'export peut être chiffré pour protéger les données :

```typescript
interface EncryptionOptions {
  algorithm: 'AES-256' | 'RSA-2048';
  password?: string;
  publicKey?: string;
}
```

### 11.2 Checksum

Un checksum est calculé pour garantir l'intégrité du fichier :

```typescript
function calculateChecksum(file: Buffer): string {
  const hash = crypto.createHash('sha256').update(file).digest('hex');
  return `sha256:${hash}`;
}
```

### 11.3 Signature Numérique

Une signature numérique peut être ajoutée pour garantir l'authenticité :

```typescript
interface DigitalSignature {
  algorithm: 'RSA-2048' | 'ECDSA-P256';
  signature: string;
  certificate: string;
  timestamp: Date;
}
```

---

## 12. Documentation et Traçabilité

### 12.1 Journalisation des Exports

```sql
CREATE TABLE memory_export_log (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  export_id VARCHAR(36) UNIQUE NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  options JSON NOT NULL,
  file_checksum VARCHAR(64),
  file_size BIGINT,
  
  transmission_method VARCHAR(50),
  target_system VARCHAR(100),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_export_recruiter ON memory_export_log(recruiter_id);
CREATE INDEX idx_export_timestamp ON memory_export_log(timestamp);
CREATE INDEX idx_export_id ON memory_export_log(export_id);
```

### 12.2 Journalisation des Imports

```sql
CREATE TABLE memory_import_log (
  id VARCHAR(36) PRIMARY KEY,
  recruiter_id VARCHAR(36) NOT NULL,
  import_id VARCHAR(36) UNIQUE NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  options JSON NOT NULL,
  file_checksum VARCHAR(64),
  records_imported INT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_import_recruiter ON memory_import_log(recruiter_id);
CREATE INDEX idx_import_timestamp ON memory_import_log(timestamp);
CREATE INDEX idx_import_id ON memory_import_log(import_id);
```

---

## 13. Rapport de Conformité

### 13.1 Structure du Rapport

```typescript
interface ComplianceReport {
  reportId: string;
  exportId: string;
  timestamp: Date;
  
  compliance: {
    gdprArticle20: boolean;
    anonymizationApplied: boolean;
    noPersonalData: boolean;
    dataIntegrity: boolean;
  };
  
  details: {
    layersExported: string[];
    recordCount: number;
    anonymizationMethods: string[];
    checksumVerified: boolean;
  };
  
  recommendations: string[];
}
```

### 13.2 Exemple de Rapport

```
┌─────────────────────────────────────────┐
│ RAPPORT DE CONFORMITÉ                 │
├─────────────────────────────────────────┤
│                                         │
| Export ID : EXP-20260803-001          │
| Date : 03/08/2026                       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
| CONFORMITÉ RGPD                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| ✅ Article 20 (Droit à la portabilité)  │
| ✅ Anonymisation appliquée              │
| ✅ Aucune donnée personnelle            │
| ✅ Intégrité des données vérifiée       │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ DÉTAILS                               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| Couches exportées :                    │
| • COUCHE 1 — Profil de préférence       │
| • COUCHE 2 — Historique de décisions    │
| • COUCHE 3 — Contexte organisationnel  │
| • COUCHE 4 — Apprentissages accumulés │
│                                         │
| Nombre d'enregistrements : 47           │
| Méthodes d'anonymisation :              │
| • Suppression des données identifiantes │
| • Généralisation                       │
| • Pseudonymisation                      │
|                                         │
| Checksum vérifié : ✅                   │
│                                         │
| ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ RECOMMANDATIONS                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                         │
| 1. Conserver ce fichier dans un endroit │
│    sécurisé                              │
│ 2. Ne partagez pas ce fichier sans      │
│    anonymisation supplémentaire          │
│ 3. Vérifiez le checksum avant import   │
│                                         │
│ [Télécharger le rapport]                 │
└─────────────────────────────────────────┘
```

---

## 14. API de Portabilité

### 14.1 Endpoints

```typescript
// Export
GET /api/memory/export
POST /api/memory/export

// Import
POST /api/memory/import

// Transmission directe
POST /api/memory/transfer

// Vérification
POST /api/memory/verify-checksum
```

### 14.2 Exemple d'API

```typescript
// Export
async function exportMemoryAPI(options: ExportOptions): Promise<Blob> {
  const response = await fetch('/api/memory/export', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'X-MFA-Token': getMFAToken()
    },
    body: JSON.stringify(options)
  });
  
  return response.blob();
}

// Import
async function importMemoryAPI(file: File, options: ImportOptions): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('options', JSON.stringify(options));
  
  const response = await fetch('/api/memory/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'X-MFA-Token': getMFAToken()
    },
    body: formData
  });
  
  return response.json();
}
```

---

## 15. Indicateurs de Suivi

### 15.1 Métriques d'Export

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de réussite d'export | Exports réussis / total | ≥ 99% |
| Temps moyen d'export | Temps moyen de génération | < 30 secondes |
| Taux de conformité | Exports conformes / total | 100% |
| Taux de transmission directe | Transmissions réussies / total | ≥ 95% |

### 15.2 Métriques d'Import

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de réussite d'import | Imports réussis / total | ≥ 99% |
| Temps moyen d'import | Temps moyen d'import | < 30 secondes |
| Taux de validation | Imports validés / total | 100% |

---

## 16. Conclusion

Le protocole de portabilité et export garantit :

- **Droit à la portabilité** RGPD Article 20
- **Format structuré** et lisible par machine
- **Transmission directe** possible vers d'autres systèmes
- **Séparation des contextes** en cas de changement d'entreprise
- **Sécurité** avec chiffrement et checksum
- **Conformité RGPD** vérifiée
- **Traçabilité** complète des exports et imports
