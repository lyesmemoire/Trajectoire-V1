# DOC-033-02 : Template de Contrat de Partage de Données

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir le template de contrat de partage de données pour MVP-033 Real Data Foundation. Ce contrat structure l'accord entre Trajectoire et les partenaires (cabinets de recrutement, entreprises beta) pour le partage de données anonymisées en échange de l'accès au moteur en beta.

---

## 2. Principe Fondateur

Le partage de données doit être encadré par un contrat clair qui protège les deux parties, garantit la conformité RGPD, et définit précisément les droits et obligations de chacun. Le contrat doit être équilibré et mutuellement bénéfique.

---

## 3. Structure du Contrat

### 3.1 En-tête du Contrat

```
CONTRAT DE PARTAGE DE DONNÉES

Entre :
Trajectoire SAS, [adresse], [SIRET], représentée par [nom], en qualité de [fonction]
(dénommée "Trajectoire")

Et :
[Nom du partenaire], [adresse], [SIRET], représentée par [nom], en qualité de [fonction]
(dénommée "Le Partenaire")

(dénommés ensemble "Les Parties")

OBJET DU CONTRAT :
Le présent contrat a pour objet de définir les conditions dans lesquelles
Le Partenaire partage des données anonymisées avec Trajectoire
en échange de l'accès au moteur cognitif RH en version beta.
```

---

### 3.2 Article 1 — Définitions

**1.1 Données Anonymisées**
Données personnelles qui ont été traitées de manière à empêcher l'identification de la personne concernée, conformément au RGPD.

**1.2 Données de Recrutement**
Données relatives aux processus de recrutement, incluant les CV, les fiches de poste, les entretiens, les décisions et les résultats observés.

**1.3 Moteur Cognitif RH**
Le système d'intelligence artificielle développé par Trajectoire pour assister les décisions de recrutement.

**1.4 Version Beta**
Version préliminaire du moteur cognitif RH mise à disposition des partenaires pour test et feedback.

**1.5 Résultats Observés**
Données relatives à la performance des recrutements à 6 et 12 mois (rétention, performance, satisfaction).

---

### 3.3 Article 2 — Objet du Partage de Données

**2.1 Données Partagées par Le Partenaire**
Le Partenaire s'engage à partager avec Trajectoire les données suivantes, anonymisées conformément à l'Article 4 :
- Données d'entretiens anonymisés (transcriptions, évaluations)
- Décisions de recrutement (accepté, refusé, en attente)
- Résultats observés à 6 et 12 mois (rétention, performance)
- Patterns sectoriels identifiés
- Métadonnées contextuelles (secteur, taille d'entreprise, type de poste)

**2.2 Volume Minimum**
Le Partenaire s'engage à partager un minimum de [X] entretiens anonymisés et [Y] paires CV/Poste sur la durée du contrat.

**2.3 Qualité des Données**
Le Partenaire garantit que les données partagées sont :
- Complètes et exactes
- Représentatives de ses processus de recrutement
- Mises à jour régulièrement
- Conformes aux réglementations applicables

---

### 3.4 Article 3 — Contreparties Fournies par Trajectoire

**3.1 Accès Beta au Moteur**
Trajectoire accorde au Partenaire un accès gratuit à la version beta du moteur cognitif RH pour la durée du contrat.

**3.2 Rapport Personnalisé**
Trajectoire fournit au Partenaire un rapport trimestriel personnalisé incluant :
- Analyse des patterns de recrutement du Partenaire
- Comparaison avec les benchmarks sectoriels
- Recommandations d'amélioration
- Évolution des métriques de performance

**3.3 Support Prioritaire**
Trajectoire accorde au Partenaire un support prioritaire (réponse sous 24h) pour toute question relative à l'utilisation du moteur.

**3.4 Accès aux Nouvelles Fonctionnalités**
Le Partenaire bénéficie d'un accès anticipé aux nouvelles fonctionnalités du moteur avant leur mise à disposition générale.

---

### 3.5 Article 4 — Anonymisation des Données

**4.1 Protocole d'Anonymisation**
Le Partenaire s'engage à anonymiser toutes les données partagées conformément au protocole défini dans DOC-033-03.

**4.2 Validation par le DPO**
L'anonymisation de chaque lot de données doit être validée par le DPO du Partenaire avant partage.

**4.3 Test de Ré-identification**
Trajectoire peut effectuer un test annuel de ré-identification pour vérifier l'efficacité de l'anonymisation.

**4.4 Impossibilité de Ré-identification**
Les Parties s'engagent à ne pas tenter de ré-identifier les personnes concernées par les données anonymisées.

---

### 3.6 Article 5 — Usage Autorisé des Données

**5.1 Usage par Trajectoire**
Trajectoire est autorisée à utiliser les données partagées exclusivement pour :
- Entraîner et améliorer le moteur cognitif RH
- Identifier et valider des patterns de recrutement
- Générer des benchmarks sectoriels
- Fournir des rapports personnalisés au Partenaire

**5.2 Interdictions**
Trajectoire s'engage à ne pas :
- Vendre ou monétiser les données partagées
- Partager les données avec des tiers sans accord explicite
- Utiliser les données à des fins autres que celles définies
- Tenter de ré-identifier les personnes concernées

**5.3 Agrégation**
Trajectoire peut agréger les données avec celles d'autres partenaires pour créer des benchmarks sectoriels, à condition que les agrégats ne permettent pas de ré-identification.

---

### 3.7 Article 6 — Durée de Conservation

**6.1 Durée de Conservation**
Les données partagées sont conservées par Trajectoire pour une durée maximale de [X] ans à compter de leur réception.

**6.2 Renouvellement**
À l'expiration de la durée de conservation, les données sont soit supprimées, soit anonymisées de manière irréversible.

**6.3 Conservation Sécurisée**
Les données sont conservées sur des serveurs sécurisés conformément aux meilleures pratiques de sécurité de l'information.

---

### 3.8 Article 7 — Droit de Retrait

**7.1 Droit de Retrait**
Le Partenaire peut demander le retrait de tout ou partie des données partagées à tout moment.

**7.2 Procédure de Retrait**
Le retrait est effectif dans un délai de [X] jours ouvrés suivant la réception de la demande écrite du Partenaire.

**7.3 Conséquences du Retrait**
En cas de retrait de données :
- Les données sont supprimées des systèmes de Trajectoire
- Les modèles entraînés avec ces données sont ré-entraînés sans ces données
- Le Partenaire conserve l'accès au moteur beta jusqu'à la fin du contrat

---

### 3.9 Article 9 — Confidentialité

**9.1 Obligation de Confidentialité**
Les Parties s'engagent à maintenir confidentielles toutes les informations partagées dans le cadre du présent contrat.

**9.2 Exceptions**
L'obligation de confidentialité ne s'applique pas aux informations :
- Publiquement disponibles
- Déjà connues des Parties avant le contrat
- Obligatoirement divulguées par la loi
- Divulguées avec l'accord de l'autre Partie

**9.3 Durée de la Confidentialité**
L'obligation de confidentialité subsiste pendant [X] ans après la fin du contrat.

---

### 3.10 Article 10 — Propriété Intellectuelle

**10.1 Propriété des Données**
Le Partenaire conserve la propriété de toutes les données partagées.

**10.2 Propriété du Moteur**
Trajectoire conserve la propriété du moteur cognitif RH et de tous les modèles entraînés.

**10.3 Droits d'Usage**
Le présent contrat confère au Partenaire un droit d'usage non exclusif, non transférable, du moteur beta pour la durée du contrat.

---

### 3.11 Article 11 — Responsabilité

**11.1 Limitation de Responsabilité**
La responsabilité de Trajectoire est limitée aux dommages directs prouvés résultant d'une faute lourde ou d'une intention dolosive.

**11.2 Exclusion de Dommages Indirects**
Trajectoire n'est pas responsable des dommages indirects, y compris mais sans s'y limiter, la perte de profit, la perte d'opportunité, ou les dommages réputationnels.

**11.3 Plafond de Responsabilité**
La responsabilité totale de Trajectoire ne peut excéder [X] fois le montant annuel de la contrepartie, le cas échéant.

---

### 3.12 Article 12 — RGPD et Conformité

**12.1 Conformité RGPD**
Les Parties s'engagent à se conformer au RGPD et à toutes les réglementations applicables en matière de protection des données personnelles.

**12.2 Désignation du DPO**
Chaque Partie désigne un DPO responsable de la conformité RGPD dans le cadre du présent contrat.

**12.3 Notification de Violation**
En cas de violation de données personnelles, les Parties s'engagent à se notifier mutuellement dans un délai de [X] heures.

---

### 3.13 Article 13 — Durée du Contrat

**13.1 Durée Initiale**
Le présent contrat est conclu pour une durée initiale de [X] ans à compter de sa signature.

**13.2 Renouvellement**
Le contrat est renouvelable par tacite reconduction pour des périodes successives de [X] ans, sauf notification de l'une des Parties [X] mois avant l'expiration.

**13.3 Résiliation Anticipée**
Chaque Partenaire peut résilier le contrat à tout moment moyennant un préavis de [X] mois.

---

### 3.14 Article 14 — Résiliation

**14.1 Cas de Résiliation**
Le contrat peut être résilié par l'une des Parties en cas de :
- Violation grave des obligations du contrat par l'autre Partenaire
- Non-conformité RGPD persistante
- Faillite ou liquidation de l'une des Parties
- Changement de contrôle de l'une des Parties

**14.2 Conséquences de la Résiliation**
En cas de résiliation :
- Les données partagées sont supprimées ou restituées au Partenaire
- L'accès au moteur beta est révoqué
- Les rapports personnalisés cessent
- Les obligations de confidentialité subsistent

---

### 3.15 Article 15 — Force Majeure

**15.1 Définition**
La force majeure s'entend de tout événement imprévisible, irrésistible et extérieur aux Parties qui empêche l'exécution du contrat.

**15.2 Suspension**
En cas de force majeure, l'exécution du contrat est suspendue pour la durée de l'événement.

**15.3 Résiliation**
Si la force majeure persiste plus de [X] jours, les Parties peuvent résilier le contrat sans indemnité.

---

### 3.16 Article 16 — Litiges

**16.1 Juridiction Compétente**
Tout litige relatif au présent contrat est soumis à la juridiction exclusive des tribunaux de [ville].

**16.2 Mode de Résolution**
Avant tout recours judiciaire, les Parties s'engagent à tenter de résoudre le litige par voie de médiation.

---

### 3.17 Article 17 — Divers

**17.1 Intégralité**
Le présent contrat constitue l'intégralité de l'accord entre les Parties et remplace toutes les discussions ou accords antérieurs.

**17.2 Modification**
Toute modification du contrat doit être faite par écrit et signée par les deux Parties.

**17.3 Nullité Partielle**
Si une disposition du contrat est jugée nulle ou inapplicable, les autres dispositions restent en vigueur.

**17.4 Non Waiver**
Le fait pour une Partie de ne pas invoquer une disposition du contrat ne constitue pas une renonciation à cette disposition.

---

### 3.18 Signatures

```
Fait à [ville], le [date]

POUR TRAJECTOIRE
Signature : ______________________
Nom : ______________________
Fonction : ______________________

POUR LE PARTENAIRE
Signature : ______________________
Nom : ______________________
Fonction : ______________________
```

---

## 4. Structure de Données (TypeScript)

```typescript
interface DataSharingContract {
  contractId: string;
  contractNumber: string;
  
  parties: {
    trajectoire: {
      name: string;
      address: string;
      siren: string;
      representative: {
        name: string;
        role: string;
      };
    };
    partner: {
      name: string;
      address: string;
      siren: string;
      representative: {
        name: string;
        role: string;
      };
    };
  };
  
  terms: {
    dataShared: {
      interviewData: number;
      cvPostePairs: number;
      resultsData: number;
      sectoralPatterns: boolean;
    };
    consideration: {
      betaAccess: boolean;
      personalizedReports: boolean;
      prioritySupport: boolean;
      earlyAccessFeatures: boolean;
    };
    retention: {
      duration: number; // en années
      renewal: boolean;
      withdrawalRight: boolean;
    };
    confidentiality: {
      duration: number; // en années
    };
    liability: {
      cap: number; // multiple de la contrepartie annuelle
    };
    duration: {
      initial: number; // en années
      renewal: number; // en années
      noticePeriod: number; // en mois
    };
  };
  
  status: 'draft' | 'signed' | 'active' | 'terminated';
  
  metadata: {
    createdAt: Date;
    signedAt?: Date;
    effectiveFrom?: Date;
    effectiveTo?: Date;
    version: string;
  };
}
```

---

## 5. Stockage et Gestion

### 5.1 Schéma SQL

```sql
CREATE TABLE data_sharing_contract (
  id VARCHAR(36) PRIMARY KEY,
  contract_number VARCHAR(50) NOT NULL UNIQUE,
  
  parties JSON NOT NULL,
  terms JSON NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'signed', 'active', 'terminated')),
  metadata JSON NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  signed_at TIMESTAMP,
  effective_from TIMESTAMP,
  effective_to TIMESTAMP
);

CREATE INDEX idx_data_sharing_contract_status ON data_sharing_contract(status);
CREATE INDEX idx_data_sharing_contract_partner ON data_sharing_contract((parties->>'$.partner.name'));
```

---

## 6. API Endpoints

```typescript
// POST /api/data/contracts
async function createContract(contract: DataSharingContract): Promise<DataSharingContract> {
  return await createContract(contract);
}

// GET /api/data/contracts/:contractId
async function getContract(contractId: string): Promise<DataSharingContract> {
  return await getContractById(contractId);
}

// PUT /api/data/contracts/:contractId/sign
async function signContract(contractId: string): Promise<DataSharingContract> {
  return await signContract(contractId);
}

// PUT /api/data/contracts/:contractId/terminate
async function terminateContract(contractId: string, reason: string): Promise<DataSharingContract> {
  return await terminateContract(contractId, reason);
}

// GET /api/data/contracts
async function getContracts(status?: string): Promise<DataSharingContract[]> {
  return await getContracts(status);
}
```

---

## 7. Indicateurs de Suivi

### 7.1 Métriques de Contrats

| Métrique | Description | Cible |
|----------|-------------|-------|
| Nombre de contrats actifs | Contrats en cours | ≥ 5 |
- Taux de signature | Contrats signés / proposés | ≥ 80% |
- Taux de renouvellement | Contrats renouvelés / éligibles | ≥ 70% |
- Taux de conformité RGPD | Contrats conformes / total | 100% |

### 7.2 Métriques de Données

| Métrique | Description | Cible |
|----------|-------------|-------|
- Volume de données partagées | Données partagées / contrat | ≥ 100 entretiens |
- Qualité des données | Données conformes / total | ≥ 90% |
- Taux de retrait | Retraits / contrats | ≤ 10% |

---

## 8. Conclusion

Le template de contrat de partage de données structure l'accord entre Trajectoire et les partenaires pour le partage de données anonymisées en échange de l'accès au moteur beta. Le contrat définit précisément les droits et obligations de chacune des parties, garantit la conformité RGPD, et inclut des clauses de confidentialité, de propriété intellectuelle, et de responsabilité.

**Points clés :**
- 17 articles structurés
- Définitions claires
- Droits et obligations équilibrés
- Conformité RGPD garantie
- Droit de retrait inclus
- Clause de confidentialité
- Limitation de responsabilité
- Procédure de résiliation
- Structure de données TypeScript
- Stockage et gestion SQL
- API endpoints pour la gestion
- Métriques de suivi
