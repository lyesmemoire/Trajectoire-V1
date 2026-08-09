# DOC-010-01 : PIA (Privacy Impact Assessment)

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team  
**Validé par DPO :** En attente

---

## 1. Références

- **Projet :** MVP-010 Memory Layer
- **Responsable du traitement :** Trajectoire SAS
- **DPO :** dpo@trajectoire.com
- **Date de réalisation :** 03/08/2026
- **Méthodologie :** Guide CNIL PIA

---

## 2. Description du Traitement

### 2.1 Contexte

MVP-010 Memory Layer est une fonctionnalité qui permet au moteur de raisonnement de mémoriser le contexte et les préférences du recruteur pour personnaliser les recommandations. Le moteur passe de l'intelligence générique à l'intelligence contextuelle et personnalisée.

### 2.2 Description Fonctionnelle

Le traitement consiste à :

1. **Collecter** les décisions du recruteur (acceptation/refus de candidats)
2. **Apprendre** les préférences implicites du recruteur à partir de ses décisions
3. **Mémoriser** l'historique des décisions anonymisées
4. **Adapter** les recommandations futures en fonction du contexte mémorisé
5. **Permettre** au recruteur de consulter, corriger et effacer sa mémoire

### 2.3 Données Traitées

| Type de données | Catégorie | Source | Stockage |
|----------------|-----------|--------|----------|
| Identifiant recruteur | Données personnelles | Système d'authentification | Base de données chiffrée |
| Préférences explicites | Données personnelles | Déclaration du recruteur | Base de données chiffrée |
| Préférences implicites | Données personnelles (inférées) | Analyse des décisions | Base de données chiffrée |
| Historique de décisions | Données personnelles | Décisions du recruteur | Base de données chiffrée |
| Profils candidats anonymisés | Données pseudonymisées | CV et décisions | Base de données chiffrée |
| Contexte organisationnel | Données personnelles | Déclaration du recruteur | Base de données chiffrée |
| Apprentissages accumulés | Données personnelles (inférées) | Analyse des décisions | Base de données chiffrée |

### 2.4 Données Personnelles Identifiantes de Candidats

**Règle absolue :** La mémoire recruteur ne contient JAMAIS de données personnelles identifiantes de candidats.

- **Noms** : Jamais stockés
- **Emails** : Jamais stockés
- **Téléphones** : Jamais stockés
- **Adresses** : Jamais stockées
- **Photos** : Jamais stockées
- **CV complets** : Jamais stockés (seuls les patterns anonymisés)

Seuls les patterns et caractéristiques anonymisées sont stockés :
- Type de profil (ex: "DevOps senior 5 ans d'expérience")
- Compétences techniques (ex: "Python, Docker, Kubernetes")
- Signaux prédicteurs (ex: "Certifications cloud validées")

---

## 3. Base Légale

### 3.1 Base Légale Principale

**Article 6(1)(a) RGPD : Consentement**

Le traitement est basé sur le consentement explicite et informé du recruteur.

**Justification :**
- La mémoire est une fonctionnalité optionnelle
- Le recruteur peut utiliser le système sans activer la mémoire
- Le recruteur peut désactiver la mémoire à tout moment
- Le recruteur peut effacer sa mémoire à tout moment

### 3.2 Bases Légales Secondaires

**Article 6(1)(f) RGPD : Intérêt légitime**

Pour certains aspects du traitement (détection de biais, conformité légale), l'intérêt légitime de l'entreprise s'applique.

**Justification :**
- Détection de biais discriminatoires (obligation légale)
- Conformité RGPD (obligation légale)
- Amélioration du service (intérêt légitime)

### 3.3 Obligations Légales

- **RGPD Article 22 :** Droit à l'explication des décisions automatisées
- **Loi Informatique & Libertés :** Droit à l'explication des algorithmes
- **Code du travail :** Obligation de non-discrimination
- **CNIL :** PIA obligatoire pour traitements à risque

---

## 4. Finalités du Traitement

### 4.1 Finalités Principales

1. **Personnalisation des recommandations** : Adapter les recommandations au contexte du recruteur
2. **Amélioration de la pertinence** : Augmenter la qualité des recommandations par apprentissage
3. **Gain de temps** : Réduire le temps de traitement des candidatures

### 4.2 Finalités Secondaires

1. **Détection de biais** : Identifier et prévenir les biais discriminatoires
2. **Amélioration du service** : Optimiser le moteur à partir des retours
3. **Conformité légale** : Garantir la conformité RGPD et anti-discrimination

### 4.3 Finalités Exclues

- **Profiling à des fins de surveillance** : Interdit
- **Profiling à des fins de marketing** : Interdit
- **Partage des données avec des tiers** : Interdit (sauf obligation légale)
- **Utilisation des données à des fins non déclarées** : Interdit

---

## 5. Destinataires des Données

### 5.1 Destinataires Internes

| Destinataire | Type d'accès | Justification |
|--------------|--------------|---------------|
| DPO | Lecture complète | Conformité RGPD |
| Service juridique | Lecture limitée | Défense juridique |
| Équipe technique | Lecture/écriture limitée | Maintenance |
| Recruteur concerné | Lecture/écriture complète | Exercice de ses droits |

### 5.2 Destinataires Externes

**Aucun destinataire externe par défaut.**

En cas d'obligation légale (contentieux, contrôle CNIL) :
- **Magistrat** : Sur ordonnance judiciaire
- **CNIL** : Sur contrôle
- **Autorités compétentes** : Sur demande légitime

### 5.3 Sous-traitants

| Sous-traitant | Type de traitement | Pays | Garanties |
|---------------|-------------------|-------|-----------|
| [Cloud Provider] | Hébergement | UE | Standard contractuels, SCC si nécessaire |
| [Backup Provider] | Sauvegarde | UE | Standard contractuels, SCC si nécessaire |

---

## 6. Durée de Conservation

### 6.1 Durées de Conservation par Type de Données

| Type de données | Durée de conservation | Justification |
|-----------------|----------------------|---------------|
| Préférences explicites | Tant que le recruteur consent | Consentement |
| Préférences implicites | 2 ans après dernière activité | Pertinence |
| Historique de décisions | 3 ans | Code du travail |
| Profils candidats anonymisés | 3 ans | Code du travail |
| Contexte organisationnel | Tant que le recruteur consent | Consentement |
| Apprentissages accumulés | 2 ans après dernière validation | Pertinence |
| Logs d'accès | 1 an | Sécurité |
| Logs de consentement | 5 ans | Preuve légale |

### 6.2 Procédure de Destruction

À l'expiration de la durée de conservation :

1. **Notification automatique** au DPO
2. **Anonymisation** des données (si réutilisation possible)
3. **Destruction sécurisée** des données non anonymisables
4. **Journalisation** de la destruction
5. **Confirmation** au DPO

### 6.3 Droit à l'Effacement Anticipé

Le recruteur peut demander l'effacement anticipé de tout ou partie de sa mémoire :

- **Effacement total** : Toutes les données personnelles
- **Effacement partiel** : Uniquement certaines catégories de données
- **Réinitialisation** : Remise à zéro des apprentissages implicites

Délai de réponse : 30 jours maximum (cible : 5 jours ouvrés)

---

## 7. Mesures de Sécurité

### 7.1 Mesures Organisationnelles

- **Politique de sécurité** : Documentée et diffusée
- **Formation du personnel** : RGPD, sécurité, confidentialité
- **Procédures d'accès** : Authentification forte, autorisations basées sur les rôles
- **Contrôle d'accès** : Journalisation, revue périodique
- **Gestion des incidents** : Procédure documentée, notification CNIL si requis

### 7.2 Mesures Techniques

- **Chiffrement** : AES-256 pour les données au repos, TLS 1.3 pour les données en transit
- **Authentification** : Multi-factor (MFA) obligatoire
- **Contrôle d'accès** : RBAC (Role-Based Access Control)
- **Journalisation** : Logs complets, conservation 1 an
- **Sauvegarde** : Quotidienne, chiffrée, redondance géographique
- **Audit** : Audit trimestriel de sécurité
- **Tests de pénétration** : Annuel

### 7.3 Mesures Spécifiques à la Mémoire

- **Séparation des données** : Mémoire isolée des autres données
- **Anonymisation automatique** : Des données candidats
- **Détection de biais** : Algorithme de détection automatique
- **Alerte automatique** : En cas de pattern discriminatoire détecté
- **Validation DPO** : Avant déploiement

---

## 8. Risques pour les Droits et Libertés

### 8.1 Identification des Risques

| Risque | Probabilité | Gravité | Niveau de risque |
|--------|-------------|---------|------------------|
| Discrimination indirecte par apprentissage de biais | Moyenne | Élevée | Élevé |
| Violation de la vie privée du recruteur | Faible | Moyenne | Moyen |
| Réidentification de candidats à partir de patterns | Faible | Élevée | Moyen |
| Utilisation non autorisée des données | Faible | Élevée | Moyen |
| Perte de données | Faible | Moyenne | Moyen |
| Non-respect du droit à l'effacement | Faible | Élevée | Moyen |

### 8.2 Analyse Détaillée des Risques

#### Risque 1 : Discrimination Indirecte par Apprentissage de Biais

**Description :** Le moteur pourrait apprendre des préférences discriminatoires à partir des décisions du recruteur.

**Probabilité :** Moyenne (les biais humains sont courants)

**Gravité :** Élevée (conséquences juridiques et réputationnelles)

**Mesures d'atténuation :**
- Algorithme de détection automatique de biais
- Alertes automatiques au recruteur et DPO
- Blocage des apprentissages discriminatoires
- Révision périodique des apprentissages
- Validation DPO avant déploiement

#### Risque 2 : Violation de la Vie Privée du Recruteur

**Description :** La mémoire pourrait révéler des informations sensibles sur le recruteur.

**Probabilité :** Faible (mesures de sécurité en place)

**Gravité :** Moyenne (impact sur la confiance)

**Mesures d'atténuation :**
- Consentement explicite et informé
- Droit à l'effacement garanti
- Droit d'accès garanti
- Portabilité garantie
- Chiffrement des données
- Contrôle d'accès strict

#### Risque 3 : Réidentification de Candidats

**Description :** Les patterns anonymisés pourraient permettre de réidentifier des candidats.

**Probabilité :** Faible (anonymisation robuste)

**Gravité :** Élevée (conséquences juridiques)

**Mesures d'atténuation :**
- Anonymisation robuste (k-anonymity, l-diversity)
- Suppression de toutes les données identifiantes
- Agrégation des données
- Tests de réidentification
- Validation DPO

#### Risque 4 : Utilisation Non Autorisée des Données

**Description :** Les données pourraient être utilisées à des fins non déclarées.

**Probabilité :** Faible (contrôles en place)

**Gravité :** Élevée (conséquences juridiques)

**Mesures d'atténuation :**
- Finalités déclarées et limitées
- Contrôle d'accès strict
- Journalisation des accès
- Audit périodique
- Formation du personnel

#### Risque 5 : Perte de Données

**Description :** Perte accidentelle des données de la mémoire.

**Probabilité :** Faible (sauvegardes en place)

**Gravité :** Moyenne (impact sur le service)

**Mesures d'atténuation :**
- Sauvegardes quotidiennes
- Redondance géographique
- Tests de restauration
- Plan de reprise d'activité

#### Risque 6 : Non-respect du Droit à l'Effacement

**Description :** Le droit à l'effacement ne pourrait pas être exercé correctement.

**Probabilité :** Faible (procédure en place)

**Gravité :** Élevée (conséquences juridiques)

**Mesures d'atténuation :**
- Procédure documentée
- Automatisation de l'effacement
- Journalisation de l'effacement
- Confirmation au recruteur
- Audit périodique

---

## 9. Mesures d'Atténuation

### 9.1 Mesures Déjà en Place

| Mesure | Statut | Efficacité |
|--------|--------|------------|
| Chiffrement des données | ✅ En place | Élevée |
| Authentification MFA | ✅ En place | Élevée |
| Contrôle d'accès RBAC | ✅ En place | Élevée |
| Journalisation des accès | ✅ En place | Élevée |
| Sauvegardes quotidiennes | ✅ En place | Élevée |
| Consentement explicite | ⏳ À implémenter | Élevée |
| Algorithme de détection de biais | ⏳ À implémenter | Élevée |
| Anonymisation robuste | ⏳ À implémenter | Élevée |
| Procédure d'effacement | ⏳ À implémenter | Élevée |

### 9.2 Mesures à Implémenter

#### Mesure 1 : Consentement Explicite et Informé

**Description :** Interface de consentement claire et détaillée.

**Implémentation :**
- Écran de consentement lors de l'activation
- Explication détaillée des données traitées
- Explication des finalités
- Explication des droits du recruteur
- Possibilité de refuser sans pénalité
- Possibilité de retirer le consentement à tout moment

**Délai :** Avant déploiement

#### Mesure 2 : Algorithme de Détection de Biais

**Description :** Algorithme automatique de détection de patterns discriminatoires.

**Implémentation :**
- Détection de corrélation avec critères prohibés
- Détection de distribution déséquilibrée
- Détection de pattern discriminatoire
- Alertes automatiques au recruteur et DPO
- Blocage des apprentissages discriminatoires

**Délai :** Avant déploiement

#### Mesure 3 : Anonymisation Robuste

**Description :** Anonymisation des données candidats selon les standards k-anonymity et l-diversity.

**Implémentation :**
- Suppression de toutes les données identifiantes
- Agrégation des données
- Tests de réidentification
- Validation DPO

**Délai :** Avant déploiement

#### Mesure 4 : Procédure d'Effacement

**Description :** Procédure automatisée d'effacement de la mémoire.

**Implémentation :**
- Interface d'effacement total
- Interface d'effacement partiel
- Interface de réinitialisation
- Automatisation de l'effacement
- Journalisation de l'effacement
- Confirmation au recruteur

**Délai :** Avant déploiement

#### Mesure 5 : Interface de Gestion de la Mémoire

**Description :** Interface permettant au recruteur de consulter, corriger et effacer sa mémoire.

**Implémentation :**
- Consultation de la mémoire
- Correction des apprentissages erronés
- Effacement total ou partiel
- Export de la mémoire (portabilité)

**Délai :** Avant déploiement

---

## 10. Conformité RGPD

### 10.1 Principes RGPD

| Principe | Conformité | Mesures |
|----------|-------------|---------|
| Licéité, loyauté, transparence | ✅ Conforme | Consentement explicite, information claire |
| Limitation de la finalité | ✅ Conforme | Finalités déclarées et limitées |
| Minimisation des données | ✅ Conforme | Seules les données nécessaires |
| Exactitude | ✅ Conforme | Droit de correction |
| Limitation de la conservation | ✅ Conforme | Durées de conservation définies |
| Intégrité et confidentialité | ✅ Conforme | Mesures de sécurité |
| Responsabilité | ✅ Conforme | Documentation, PIA |

### 10.2 Droits des Personnes Concernées

| Droit | Conformité | Implémentation |
|-------|-------------|----------------|
| Droit d'information | ✅ Conforme | Politique de confidentialité |
| Droit d'accès | ✅ Conforme | Interface d'accès |
| Droit de rectification | ✅ Conforme | Interface de correction |
| Droit à l'effacement | ✅ Conforme | Interface d'effacement |
| Droit à la limitation | ✅ Conforme | Interface de limitation |
| Droit à la portabilité | ✅ Conforme | Interface d'export |
| Droit d'opposition | ✅ Conforme | Possibilité de désactiver |
| Droit de ne pas faire l'objet d'une décision automatisée | ✅ Conforme | Intervention humaine possible |

---

## 11. Validation et Approbation

### 11.1 Validation DPO

**Statut :** En attente

**Critères de validation :**
- ✅ Description complète du traitement
- ✅ Base légale identifiée
- ✅ Finalités déclarées et limitées
- ✅ Destinataires identifiés
- ✅ Durées de conservation définies
- ✅ Mesures de sécurité documentées
- ✅ Risques identifiés et évalués
- ✅ Mesures d'atténuation définies
- ✅ Conformité RGPD vérifiée
- ✅ Droits des personnes concernés garantis

### 11.2 Approbation Direction

**Statut :** En attente

**Critères d'approbation :**
- ✅ Risques acceptables
- ✅ Mesures d'atténuation suffisantes
- ✅ Rentabilité du projet
- ✅ Alignement stratégique

### 11.3 Plan d'Action

| Action | Responsable | Délai | Statut |
|--------|-------------|-------|--------|
| Implémenter le consentement explicite | Équipe technique | Avant déploiement | ⏳ À faire |
| Implémenter l'algorithme de détection de biais | Équipe technique | Avant déploiement | ⏳ À faire |
| Implémenter l'anonymisation robuste | Équipe technique | Avant déploiement | ⏳ À faire |
| Implémenter la procédure d'effacement | Équipe technique | Avant déploiement | ⏳ À faire |
| Implémenter l'interface de gestion | Équipe technique | Avant déploiement | ⏳ À faire |
| Validation DPO | DPO | Avant déploiement | ⏳ À faire |
| Approbation direction | Direction | Avant déploiement | ⏳ À faire |

---

## 12. Conclusion

Le PIA de MVP-010 Memory Layer identifie les risques pour les droits et libertés des personnes concernées et définit des mesures d'atténuation appropriées.

**Résultat :** Le traitement est conforme au RGPD sous réserve de l'implémentation des mesures d'atténuation définies.

**Recommandation :** Procéder au développement après validation du PIA par le DPO et approbation par la direction.

**Suivi :** Le PIA sera révisé annuellement ou en cas de modification significative du traitement.
