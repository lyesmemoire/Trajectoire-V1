# RollbackManager Branch Analysis

**Composant:** rollback-manager  
**Fichier:** compiler/cvm/rollback-manager.ts  
**Date:** 2026-07-27T01:05:00Z

---

## Branches

Toutes les branches sont couvertes (100%). Il n'y a pas de branches non couvertes à analyser.

---

## Statements Non Couverts

### Ligne 88 - Call frame creation in restoreSnapshot

**Emplacement:** Méthode `restoreSnapshot()`  
**Description:** Création de call frames lors de la restauration  
**Hits:** 0

### Ligne 129 - Snapshot copy in getAllSnapshots

**Emplacement:** Méthode `getAllSnapshots()`  
**Description:** Copie des snapshots  
**Hits:** 0

### Ligne 164 - Snapshot deletion in evictIfNeeded

**Emplacement:** Méthode `evictIfNeeded()`  
**Description:** Suppression du snapshot le plus ancien  
**Hits:** 0

### Ligne 249 - Snapshot ID mismatch validation

**Emplacement:** Méthode `validate()`  
**Description:** Validation de l'incohérence d'ID de snapshot  
**Hits:** 0

---

## Fonctions Non Couvertes

### getAllSnapshots

**Statut:** Non couverte  
**Raison:** Non appelée dans les tests existants

### evictIfNeeded

**Statut:** Non couverte directement  
**Raison:** Appelée uniquement en interne (createSnapshot, setMaxSnapshots)

---

## Analyse

Les écarts de couverture sont dus à:
1. Manque de tests pour `getAllSnapshots()`
2. Manque de tests pour le chemin d'éviction de snapshots
3. Manque de tests pour la validation d'incohérences d'ID

Tous ces cas sont atteignables et nécessitent des tests supplémentaires.
