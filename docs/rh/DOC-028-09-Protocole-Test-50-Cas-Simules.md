# DOC-028-09 : Protocole de Test (50 Cas d'Exceptions Simulées)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le protocole de test pour MVP-028 Exception Intelligence Engine. Ce protocole valide le moteur avec 50 cas d'exceptions simulées couvrant les 8 dimensions de détection contextuelle, les 3 niveaux de classification, et les différents types de situations exceptionnelles.

---

## 2. Principe Fondateur

Le protocole de test valide le moteur en simulant 50 cas d'exceptions réalistes couvrant l'ensemble des dimensions et niveaux. Chaque cas est testé pour vérifier la détection contextuelle, la classification, la génération du dossier d'exception, et la qualité de la recommandation. Les résultats sont analysés pour valider le moteur et identifier les axes d'amélioration.

---

## 3. Structure des Cas de Test

### 3.1 Répartition des Cas

**Dimensions :**
- Dimension 1 (Profil atypique) : 15 cas
- Dimension 2 (Contexte organisationnel) : 10 cas
- Dimension 3 (Règle obsolète) : 5 cas
- Dimension 4 (Conflit de règles) : 5 cas
- Dimension 5 (Injustice détectable) : 5 cas
- Dimension 6 (Risque business) : 5 cas
- Dimension 7 (Consensus divergent) : 3 cas
- Dimension 8 (Signal candidat exceptionnel) : 2 cas

**Niveaux :**
- Niveau 1 (Mineure) : 20 cas
- Niveau 2 (Significative) : 25 cas
- Niveau 3 (Majeure) : 5 cas

---

## 4. Cas de Test — Dimension 1 (Profil Atypique)

### 4.1 Cas 1-5 : Parcours Entrepreneurial

**Cas 1 :**
- Règle : 5 ans d'expérience requis
- Candidat : 2 ans d'expérience + parcours entrepreneurial
- Attendu : Niveau 2, Exception significative

**Cas 2 :**
- Règle : Bac+5 requis
- Candidat : Sans diplôme + parcours entrepreneurial réussi
- Attendu : Niveau 2, Exception significative

**Cas 3 :**
- Règle : Expérience en grande entreprise requise
- Candidat : Expérience startup fondateur
- Attendu : Niveau 2, Exception significative

**Cas 4 :**
- Règle : 10 ans d'expérience requis
- Candidat : 4 ans d'expérience + 2 startups créées
- Attendu : Niveau 2, Exception significative

**Cas 5 :**
- Règle : Expérience internationale requise
- Candidat : Expérience entrepreneuriale locale
- Attendu : Niveau 1, Exception mineure

---

### 4.2 Cas 6-10 : Reconversion Réussie

**Cas 6 :**
- Règle : Expérience dans le secteur requise
- Candidat : Reconversion réussie avec performance élevée
- Attendu : Niveau 2, Exception significative

**Cas 7 :**
- Règle : Expérience dans le métier requise
- Candidat : Reconversion métier avec certifications
- Attendu : Niveau 1, Exception mineure

**Cas 8 :**
- Règle : 5 ans d'expérience dans le secteur requis
- Candidat : 2 ans d'expérience + reconversion réussie
- Attendu : Niveau 2, Exception significative

**Cas 9 :**
- Règle : Expérience technique requise
- Candidat : Reconversion technique avec projets majeurs
- Attendu : Niveau 2, Exception significative

**Cas 10 :**
- Règle : Expérience managériale requise
- Candidat : Reconversion managériale avec succès
- Attendu : Niveau 1, Exception mineure

---

### 4.3 Cas 11-13 : Parcours International

**Cas 11 :**
- Règle : Expérience locale requise
- Candidat : Parcours international complexe
- Attendu : Niveau 2, Exception significative

**Cas 12 :**
- Règle : Expérience dans le pays requis
- Candidat : Expérience multinationale
- Attendu : Niveau 1, Exception mineure

**Cas 13 :**
- Règle : Expérience culturelle spécifique requise
- Candidat : Expérience interculturelle diversifiée
- Attendu : Niveau 2, Exception significative

---

### 4.4 Cas 14-15 : Autodidacte et Expertise de Niche

**Cas 14 :**
- Règle : Diplôme requis
- Candidat : Autodidacte avec réalisations prouvées
- Attendu : Niveau 2, Exception significative

**Cas 15 :**
- Règle : Expérience standard requise
- Candidat : Expertise de niche rare
- Attendu : Niveau 2, Exception significative

---

## 5. Cas de Test — Dimension 2 (Contexte Organisationnel)

### 5.1 Cas 16-19 : Startup et Poste Nouvellement Créé

**Cas 16 :**
- Règle : Processus standard de recrutement
- Contexte : Startup en hypercroissance
- Attendu : Niveau 2, Exception significative

**Cas 17 :**
- Règle : Critères de grande entreprise
- Contexte : Startup en phase de croissance
- Attendu : Niveau 1, Exception mineure

**Cas 18 :**
- Règle : Référentiel historique requis
- Contexte : Poste nouvellement créé
- Attendu : Niveau 2, Exception significative

**Cas 19 :**
- Règle : Expérience similaire requise
- Contexte : Poste innovant sans précédent
- Attendu : Niveau 2, Exception significative

---

### 5.2 Cas 20-22 : Transformation et Urgence

**Cas 20 :**
- Règle : Critères standards
- Contexte : Transformation majeure en cours
- Attendu : Niveau 2, Exception significative

**Cas 21 :**
- Règle : Processus standard
- Contexte : Urgence opérationnelle critique
- Attendu : Niveau 2, Exception significative

**Cas 22 :**
- Règle : Délai standard de recrutement
- Contexte : Urgence opérationnelle
- Attendu : Niveau 1, Exception mineure

---

## 6. Cas de Test — Dimension 3 (Règle Obsolète)

### 6.1 Cas 23-25 : Règles Obsolètes

**Cas 23 :**
- Règle : Exiger un bureau physique
- Contexte : Télétravail généralisé
- Attendu : Niveau 3, Exception majeure

**Cas 24 :**
- Règle : Exiger un Bac+5 en informatique
- Contexte : Bootcamps et autoformation
- Attendu : Niveau 3, Exception majeure

**Cas 25 :**
- Règle : Exiger 10 ans d'expérience en IA
- Contexte : Domain n'a pas 10 ans
- Attendu : Niveau 3, Exception majeure

---

## 7. Cas de Test — Dimension 4 (Conflit de Règles)

### 7.1 Cas 26-28 : Conflits de Règles

**Cas 26 :**
- Règle A : Privilégier la mobilité interne
- Règle B : Exiger 5 ans d'expérience minimum
- Candidat : Interne avec 3 ans d'expérience
- Attendu : Niveau 2, Exception significative

**Cas 27 :**
- Règle A : Priorité à la diversité
- Règle B : Exiger une expérience spécifique
- Candidat : Profil diversifié sans expérience spécifique
- Attendu : Niveau 2, Exception significative

**Cas 28 :**
- Règle A : Exiger une certification
- Règle B : Exiger une expérience équivalente
- Candidat : Expérience mais pas de certification
- Attendu : Niveau 1, Exception mineure

---

## 8. Cas de Test — Dimension 5 (Injustice Détectable)

### 8.1 Cas 29-31 : Injustices Détectables

**Cas 29 :**
- Règle : Exiger une université spécifique
- Candidat : Candidat le plus qualifié mais université différente
- Attendu : Niveau 2, Exception significative

**Cas 30 :**
- Règle : Exiger un âge maximum
- Candidat : Candidat qualifié mais âge dépassé
- Attendu : Niveau 3, Exception majeure

**Cas 31 :**
- Règle : Exiger une nationalité
- Candidat : Candidat qualifié mais nationalité différente
- Attendu : Niveau 3, Exception majeure

---

## 9. Cas de Test — Dimension 6 (Risque Business)

### 9.1 Cas 32-34 : Risques Business

**Cas 32 :**
- Règle : Processus standard
- Candidat : Seul expert disponible sur le marché
- Attendu : Niveau 2, Exception significative

**Cas 33 :**
- Règle : Critères standards
- Candidat : Candidat exceptionnel au profit d'un concurrent
- Attendu : Niveau 2, Exception significative

**Cas 34 :**
- Règle : Processus standard
- Candidat : Recrutement critique bloqué
- Attendu : Niveau 2, Exception significative

---

## 10. Cas de Test — Dimension 7 (Consensus Divergent)

### 10.1 Cas 35-37 : Consensus Divergent

**Cas 35 :**
- Règle : Règle ambiguë
- Candidat : Cas ambigu
- Attendu : Niveau 1, Exception mineure

**Cas 36 :**
- Règle : Précédents contradictoires
- Candidat : Cas avec précédents contradictoires
- Attendu : Niveau 2, Exception significative

**Cas 37 :**
- Règle : Pratiques sectorielles différentes
- Candidat : Candidat avec pratiques sectorielles différentes
- Attendu : Niveau 1, Exception mineure

---

## 11. Cas de Test — Dimension 8 (Signal Candidat Exceptionnel)

### 11.1 Cas 38-39 : Signal Candidat Exceptionnel

**Cas 38 :**
- Règle : Critères standards
- Candidat : Réalisations très supérieures au niveau requis
- Attendu : Niveau 2, Exception significative

**Cas 39 :**
- Règle : Critères standards
- Candidat : Combinaison unique de compétences rare
- Attendu : Niveau 2, Exception significative

---

## 12. Cas de Test — Cas Mixtes

### 12.1 Cas 40-50 : Cas Mixtes

**Cas 40 :**
- Règle : 5 ans d'expérience requis
- Candidat : 3 ans + parcours entrepreneurial + signal exceptionnel
- Attendu : Niveau 2, Exception significative

**Cas 41 :**
- Règle : Diplôme requis
- Candidat : Autodidacte + réalisations prouvées + risque business
- Attendu : Niveau 2, Exception significative

**Cas 42 :**
- Règle : Processus standard
- Contexte : Startup + urgence opérationnelle
- Attendu : Niveau 2, Exception significative

**Cas 43 :**
- Règle : Expérience requise
- Candidat : Reconversion réussie + injustice détectable
- Attendu : Niveau 2, Exception significative

**Cas 44 :**
- Règle : Critères standards
- Candidat : Profil atypique + consensus divergent
- Attendu : Niveau 1, Exception mineure

**Cas 45 :**
- Règle : Règle obsolète + conflit de règles
- Candidat : Candidat qualifié
- Attendu : Niveau 3, Exception majeure

**Cas 46 :**
- Règle : Processus standard
- Contexte : Transformation + risque business
- Attendu : Niveau 2, Exception significative

**Cas 47 :**
- Règle : Expérience requise
- Candidat : Parcours international + signal exceptionnel
- Attendu : Niveau 2, Exception significative

**Cas 48 :**
- Règle : Diplôme requis
- Candidat : Autodidacte + injustice détectable
- Attendu : Niveau 3, Exception majeure

**Cas 49 :**
- Règle : Critères standards
- Candidat : Expertise de niche + risque business
- Attendu : Niveau 2, Exception significative

**Cas 50 :**
- Règle : Processus standard
- Contexte : Poste nouvellement créé + urgence opérationnelle
- Attendu : Niveau 2, Exception significative

---

## 13. Protocole de Test

### 13.1 Processus de Test

**Étape 1 : Préparation**
- Configuration du moteur
- Préparation des 50 cas de test
- Définition des résultats attendus

**Étape 2 : Exécution**
- Pour chaque cas de test :
  - Soumission du cas au moteur
  - Récupération du contexte exceptionnel
  - Récupération de la classification
  - Récupération du dossier d'exception
  - Récupération de la recommandation

**Étape 3 : Validation**
- Comparaison avec les résultats attendus
- Évaluation de la qualité de la détection
- Évaluation de la qualité de la classification
- Évaluation de la qualité du dossier d'exception
- Évaluation de la qualité de la recommandation

**Étape 4 : Analyse**
- Calcul des métriques de performance
- Identification des axes d'amélioration
- Génération du rapport de test

---

## 14. Métriques de Test

### 14.1 Métriques de Performance

| Métrique | Description | Cible |
|----------|-------------|-------|
| Taux de détection correcte | Détections correctes / total | ≥ 90% |
| Taux de classification correcte | Classifications correctes / total | ≥ 85% |
- Qualité du dossier d'exception | Dossiers complets / total | ≥ 90% |
- Alignement recommandation | Recommandations alignées / total | ≥ 80% |

### 14.2 Métriques par Dimension

| Dimension | Taux de Détection | Taux de Classification |
|-----------|-------------------|----------------------|
| Dimension 1 | ≥ 90% | ≥ 85% |
| Dimension 2 | ≥ 90% | ≥ 85% |
| Dimension 3 | ≥ 95% | ≥ 90% |
| Dimension 4 | ≥ 85% | ≥ 80% |
| Dimension 5 | ≥ 90% | ≥ 85% |
| Dimension 6 | ≥ 85% | ≥ 80% |
| Dimension 7 | ≥ 80% | ≥ 75% |
| Dimension 8 | ≥ 85% | ≥ 80% |

### 14.3 Métriques par Niveau

| Niveau | Taux de Classification | Qualité du Dossier |
|--------|----------------------|-------------------|
| Niveau 1 | ≥ 90% | ≥ 95% |
| Niveau 2 | ≥ 85% | ≥ 90% |
| Niveau 3 | ≥ 80% | ≥ 85% |

---

## 15. Rapport de Test

### 15.1 Structure du Rapport

**Contenu :**
- Résumé exécutif
- Métriques de performance globales
- Métriques par dimension
- Métriques par niveau
- Analyse des cas échoués
- Recommandations d'amélioration

---

## 16. Conclusion

Le protocole de test valide le moteur avec 50 cas d'exceptions simulées couvrant les 8 dimensions de détection contextuelle, les 3 niveaux de classification, et les différents types de situations exceptionnelles. Le protocole permet de valider le moteur et d'identifier les axes d'amélioration avant la mise en production.

**Points clés :**
- 50 cas de test réalistes
- Couverture des 8 dimensions
- Couverture des 3 niveaux
- Processus de test structuré
- Métriques de performance
- Rapport de test complet
- Axes d'amélioration identifiés
