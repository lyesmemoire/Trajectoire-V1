# DOC-008-07 : Protocole de Rollback (Garde-Fou 4)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de rollback pour le moteur d'apprentissage. Toute version du moteur est archivée. Tout déploiement peut être annulé et la version précédente restaurée en moins de 4 heures.

---

## 2. Principe Fondateur

Toute version du moteur est archivée. Tout déploiement peut être annulé et la version précédente restaurée en moins de 4 heures. Ce garde-fou garantit la capacité de revenir rapidement en cas de problème post-déploiement.

---

## 3. Architecture de Versioning

### 3.1 Structure de Version

```typescript
interface EngineVersion {
  id: string;
  version: string; // Format : v1.0.0, v1.0.1, v1.1.0, v2.0.0
  timestamp: Date;
  
  // Modifications incluses
  modifications: LearningModification[];
  
  // Métriques avant déploiement
  preDeploymentMetrics: {
    agreementRate: number;
    goldenDatasetScore: number;
    performance: number;
  };
  
  // Métriques après déploiement
  postDeploymentMetrics?: {
    agreementRate: number;
    goldenDatasetScore: number;
    performance: number;
  };
  
  // Statut
  status: 'archived' | 'active' | 'rolled_back';
  
  // Métadonnées
  metadata: {
    deployedBy: string;
    deploymentDate: Date;
    rollbackDate?: Date;
    rollbackReason?: string;
  };
}
```

### 3.2 Système de Versioning Sémantique

Le versioning suit le format sémantique (SemVer) :

- **MAJOR (vX.0.0)** : Modifications majeures (règles, ontologie)
- **MINOR (vX.Y.0)** : Nouvelles fonctionnalités (patterns)
- **PATCH (vX.Y.Z)** : Corrections de bugs, ajustements mineurs

**Exemples :**
- v1.0.0 → v1.0.1 : Ajustement mineur de pondération
- v1.0.1 → v1.1.0 : Ajout de nouveau pattern de transfert
- v1.1.0 → v2.0.0 : Modification de règle fondamentale

---

## 4. Processus d'Archivage

### 4.1 Archivage Préalable

Avant tout déploiement, la version actuelle est archivée :

```typescript
async function archiveCurrentVersion(): Promise<EngineVersion> {
  const currentVersion = getCurrentVersion();
  
  const archivedVersion: EngineVersion = {
    id: generateUUID(),
    version: currentVersion.version,
    timestamp: new Date(),
    modifications: currentVersion.modifications,
    preDeploymentMetrics: getCurrentMetrics(),
    status: 'archived',
    metadata: {
      deployedBy: currentVersion.metadata.deployedBy,
      deploymentDate: currentVersion.metadata.deploymentDate
    }
  };
  
  await VersionRepository.save(archivedVersion);
  
  return archivedVersion;
}
```

### 4.2 Stockage des Versions

Les versions sont stockées dans un système de versioning :

```sql
CREATE TABLE engine_versions (
  id VARCHAR(36) PRIMARY KEY,
  version VARCHAR(20) NOT NULL UNIQUE,
  timestamp TIMESTAMP NOT NULL,
  
  modifications JSON NOT NULL,
  pre_deployment_metrics JSON NOT NULL,
  post_deployment_metrics JSON,
  
  status VARCHAR(20) NOT NULL,
  
  deployed_by VARCHAR(36),
  deployment_date TIMESTAMP,
  rollback_date TIMESTAMP,
  rollback_reason TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_versions_version ON engine_versions(version);
CREATE INDEX idx_versions_status ON engine_versions(status);
CREATE INDEX idx_versions_timestamp ON engine_versions(timestamp);
```

### 4.3 Stockage des Artefacts

Les artefacts complets de chaque version sont stockés :

- Configuration complète (pondérations, règles, patterns, ontologie)
- Modèles d'apprentissage (si applicable)
- Scripts de migration
- Documentation de la version

---

## 5. Processus de Rollback

### 5.1 Déclenchement du Rollback

Le rollback peut être déclenché par :

1. **Automatique** : Tests de validation échoués post-déploiement
2. **Manuel** : Décision humaine suite à monitoring
3. **D'urgence** : Incident critique détecté

### 5.2 Critères de Rollback Automatique

Le rollback automatique est déclenché si :

- Tests de validation échoués
- Accord moteur/humain baisse de > 5%
- Performance du système baisse de > 10%
- Erreurs du système augmentent de > 20%
- Alertes critiques détectées

### 5.3 Processus de Rollback

```typescript
async function rollbackToVersion(targetVersionId: string, reason: string): RollbackResult {
  // 1. Vérifier que la version cible existe
  const targetVersion = await VersionRepository.findById(targetVersionId);
  if (!targetVersion) {
    throw new Error('Version cible introuvable');
  }
  
  // 2. Arrêter le système (graceful shutdown)
  await gracefulShutdown();
  
  // 3. Restaurer la configuration
  await restoreConfiguration(targetVersion);
  
  // 4. Restaurer les modèles (si applicable)
  await restoreModels(targetVersion);
  
  // 5. Exécuter les scripts de migration inverses
  await executeReverseMigrationScripts(targetVersion);
  
  // 6. Redémarrer le système
  await restartSystem();
  
  // 7. Valider le rollback
  const validationResult = await validateRollback(targetVersion);
  if (!validationResult.success) {
    // Rollback échoué - alerte critique
    await alertCriticalRollbackFailure();
    throw new Error('Rollback échoué');
  }
  
  // 8. Mettre à jour les statuts de version
  await updateVersionStatuses(targetVersionId, reason);
  
  // 9. Notification
  await notifyRollback(targetVersion, reason);
  
  return {
    success: true,
    targetVersion: targetVersion.version,
    timestamp: new Date(),
    duration: validationResult.duration
  };
}
```

### 5.4 Objectif de Temps

**Cible :** Rollback complet en moins de 4 heures

**Décomposition :**
- Arrêt du système : 15 minutes
- Restauration configuration : 30 minutes
- Restauration modèles : 60 minutes
- Migration inverses : 60 minutes
- Redémarrage : 15 minutes
- Validation : 30 minutes
- **Total :** 210 minutes (3.5 heures)

---

## 6. Types de Rollback

### 6.1 Rollback Complet

Restauration complète de la version précédente :

- Configuration complète
- Modèles d'apprentissage
- Scripts de migration inverses
- Documentation

**Utilisation :** Problèmes majeurs post-déploiement

### 6.2 Rollback Partiel

Restauration sélective de certains composants :

- Configuration uniquement (pondérations)
- Patterns uniquement
- Ontologie uniquement

**Utilisation :** Problèmes localisés à un composant

### 6.3 Rollback d'Urgence

Rollback accéléré en cas d'incident critique :

- Arrêt immédiat du système
- Restauration rapide de la configuration
- Redémarrage sans validation complète
- Validation post-redémarrage

**Utilisation :** Incident critique nécessitant une action immédiate

---

## 7. Validation du Rollback

### 7.1 Tests de Validation

Après rollback, les tests suivants sont exécutés :

```typescript
interface RollbackValidation {
  success: boolean;
  duration: number; // en minutes
  
  tests: {
    configuration: boolean;
    models: boolean;
    migration: boolean;
    integration: boolean;
    performance: boolean;
  };
  
  metrics: {
    agreementRate: number;
    goldenDatasetScore: number;
    systemPerformance: number;
  };
  
  issues: string[];
}
```

### 7.2 Critères de Succès

Le rollback est considéré réussi si :

- Tous les tests passent
- Accord moteur/humain ≥ niveau avant rollback
- Performance du système ≥ niveau avant rollback
- Aucune erreur critique

### 7.3 Échec du Rollback

Si le rollback échoue :

1. **Alerte critique** : Notification immédiate à l'équipe technique
2. **Investigation** : Analyse de la cause de l'échec
3. **Plan B** : Restauration manuelle ou rollback à une version plus ancienne
4. **Documentation** : Enregistrement complet de l'incident

---

## 8. Monitoring Post-Déploiement

### 8.1 Période de Monitoring

**Durée :** 30 jours après déploiement

### 8.2 Métriques Surveillées

| Métrique | Fréquence | Seuil d'Alerte | Action |
|----------|-----------|-----------------|--------|
| Accord moteur/humain | Quotidien | Baisse > 5% | Alerte + Investigation |
| Taux de feedback positif | Hebdomadaire | Baisse > 10% | Alerte + Investigation |
| Performance du système | Quotidien | Baisse > 10% | Alerte + Investigation |
| Erreurs du système | Quotidien | Augmentation > 20% | Alerte + Investigation |
| Latence des requêtes | Quotidien | Augmentation > 50% | Alerte + Investigation |

### 8.3 Dashboard de Monitoring

```
┌─────────────────────────────────────────┐
│ MONITORING POST-DÉPLOIEMENT           │
├─────────────────────────────────────────┤
│                                         │
│ Version actuelle : v1.1.0               │
│ Déployée le : 2026-08-01                │
│ Jours depuis déploiement : 3           │
│                                         │
│ Métriques clés :                        │
│ Accord moteur/humain : 87% (↑ 2%)      │
│ Taux feedback positif : 92% (→)         │
│ Performance système : 98% (→)           │
│ Erreurs système : 0.1% (↓)             │
│                                         │
│ Tendance :                              │
│ ▲ Amélioration légère                  │
│                                         │
│ Alertes :                               │
│ Aucune alerte active                   │
│                                         │
│ [Voir détails]  [Rollback]              │
└─────────────────────────────────────────┘
```

---

## 9. Interface de Rollback

### 9.1 Interface de Rollback Manuel

```
┌─────────────────────────────────────────┐
│ ROLLBACK DU MOTEUR D'APPRENTISSAGE      │
├─────────────────────────────────────────┤
│                                         │
│ Version actuelle : v1.1.0                │
│ Déployée le : 2026-08-01                │
│                                         │
│ Sélectionner la version cible :         │
│ ○ v1.0.1 (2026-07-15)                  │
│ ○ v1.0.0 (2026-06-01)                  │
│ ○ v0.9.0 (2026-05-01)                  │
│                                         │
│ Type de rollback :                       │
│ ○ Complet                                │
│ ○ Partiel                               │
│ ○ Urgence                               │
│                                         │
│ Raison du rollback :                     │
│ [_____________________________]           │
│ [_____________________________]           │
│                                         │
| Impact estimé :                        │
│ - Arrêt du système : 15 minutes         │
│ - Indisponibilité : 3.5 heures         │
│ - Perte de données : Aucune             │
│                                         │
│ [Annuler]              [Exécuter]       │
└─────────────────────────────────────────┘
```

### 9.2 Historique des Rollbacks

```
┌─────────────────────────────────────────┐
│ HISTORIQUE DES ROLLBACKS                │
├─────────────────────────────────────────┤
│                                         │
│ 2026-07-20 - Rollback v1.1.0 → v1.0.1  │
│ Raison : Performance système -15%        │
│ Type : Complet                           │
│ Durée : 3h 15min                        │
│ Succès : ✓                              │
│                                         │
│ 2026-05-10 - Rollback v1.0.0 → v0.9.0  │
│ Raison : Accord moteur/humain -8%       │
│ Type : Partiel (configuration)           │
│ Durée : 1h 45min                        │
│ Succès : ✓                              │
│                                         │
│ [Voir détails]                          │
└─────────────────────────────────────────┘
```

---

## 10. Procédure d'Urgence

### 10.1 Déclenchement d'Urgence

Le rollback d'urgence est déclenché en cas d'incident critique :

- Incident de sécurité
- Corruption de données
- Défaillance majeure du système
- Impact significatif sur les opérations

### 10.2 Processus d'Urgence

```typescript
async function emergencyRollback(reason: string): EmergencyRollbackResult {
  const startTime = Date.now();
  
  // 1. Arrêt immédiat du système
  await immediateShutdown();
  
  // 2. Restauration rapide de la configuration
  await quickRestoreConfiguration();
  
  // 3. Redémarrage
  await quickRestart();
  
  // 4. Validation minimale
  const quickValidation = await quickValidate();
  
  const duration = (Date.now() - startTime) / 1000 / 60; // en minutes
  
  if (quickValidation.success) {
    await notifyEmergencyRollbackSuccess(reason, duration);
    return {
      success: true,
      duration,
      reason
    };
  } else {
    await alertEmergencyRollbackFailure();
    return {
      success: false,
      duration,
      reason,
      error: quickValidation.error
    };
  }
}
```

### 10.3 Objectif de Temps d'Urgence

**Cible :** Rollback d'urgence en moins de 1 heure

---

## 11. Communication

### 11.1 Notification de Rollback

Les notifications sont envoyées aux parties prenantes :

**Destinataires :**
- Lead Technique MVP-008
- DRH Référent
- Comité de Gouvernance
- Équipe support

**Canal :** Email + SMS + Pager (critique)

**Contenu :**
```
ROLLBACK DU MOTEUR D'APPRENTISSAGE

Version actuelle : v1.1.0
Version cible : v1.0.1
Raison : [raison]
Type : [type]
Heure de début : [timestamp]
Heure de fin : [timestamp]
Durée : [durée]

Statut : [succès / échec]

Si échec : Intervention humaine requise immédiatement.
```

### 11.2 Communication aux Utilisateurs

Si le rollback impacte les utilisateurs :

**Message :**
```
Maintenance en cours

Le système de raisonnement est actuellement en maintenance
pour restaurer une version précédente.

Indisponibilité estimée : 3.5 heures
Nous vous remercions de votre patience.
```

---

## 12. Documentation du Rollback

### 12.1 Rapport de Rollback

Chaque rollback est documenté :

```typescript
interface RollbackReport {
  id: string;
  timestamp: Date;
  
  fromVersion: string;
  toVersion: string;
  
  type: 'complete' | 'partial' | 'emergency';
  reason: string;
  
  duration: number; // en minutes
  
  success: boolean;
  
  validation: RollbackValidation;
  
  issues: string[];
  
  actions: string[];
  
  postRollbackMetrics?: {
    agreementRate: number;
    goldenDatasetScore: number;
    systemPerformance: number;
  };
  
  metadata: {
    initiatedBy: string;
    approvedBy: string;
    reviewedBy: string[];
  };
}
```

### 12.2 Analyse Post-Mortem

Pour chaque rollback, une analyse post-mortem est réalisée :

- Cause racine du problème
- Leçons apprises
- Actions préventives
- Mises à jour des processus

---

## 13. Métriques de Rollback

### 13.1 Métriques de Suivi

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de rollback | Rollbacks / déploiements | ≤ 5% |
| Taux de succès de rollback | Rollbacks réussis / total rollbacks | ≥ 95% |
| Temps moyen de rollback | Durée moyenne des rollbacks | < 3.5 heures |
| Temps moyen de rollback d'urgence | Durée moyenne des rollbacks d'urgence | < 1 heure |

### 13.2 Métriques de Qualité

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de rollback automatique | Rollbacks automatiques / total rollbacks | ≥ 80% |
| Taux de rollback manuel | Rollbacks manuels / total rollbacks | ≤ 20% |
| Taux de rollback d'urgence | Rollbacks d'urgence / total rollbacks | ≤ 5% |

---

## 14. Intégration avec les Autres Garde-Fous

### 14.1 Intégration avec Garde-Fou 2 (Validation Humaine)

Le rollback est disponible si une modification validée pose problème :

- Validation humaine approuve la modification
- Déploiement effectué
- Monitoring détecte des problèmes
- Rollback exécuté

### 14.2 Intégration avec Garde-Fou 3 (Seuils)

Le rollback est indépendant des seuils de déclenchement :

- Les seuils contrôlent le déclenchement des modifications
- Le rollback contrôle le retour en arrière après déploiement

### 14.3 Intégration avec Garde-Fou 5 (Audit Trimestriel)

Les rollbacks sont audités trimestriellement :

- Analyse des causes des rollbacks
- Identification des patterns
- Recommandations d'amélioration

---

## 15. Maintenance

### 15.1 Maintenance du Système de Versioning

Le système de versioning doit être maintenu :

- **Nettoyage** : Suppression des versions anciennes (> 2 ans)
- **Optimisation** : Optimisation du stockage
- **Sauvegarde** : Sauvegarde régulière des artefacts

### 15.2 Maintenance des Scripts de Rollback

Les scripts de rollback doivent être maintenus :

- **Tests réguliers** : Tests mensuels des scripts de rollback
- **Mise à jour** : Mise à jour lors de l'évolution du système
- **Documentation** : Documentation à jour des procédures

---

## 16. Conclusion

Le protocole de rollback garantit :

- **Archivage systématique** de chaque version
- **Rollback rapide** en cas de problème (< 4 heures)
- **Rollback d'urgence** en cas d'incident critique (< 1 heure)
- **Validation** post-rollback
- **Traçabilité** complète de tous les rollbacks
- **Communication** claire aux parties prenantes
- **Analyse post-mortem** pour l'amélioration continue
