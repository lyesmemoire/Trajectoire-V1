# DOC-007-04 : Grille de Criticité des Compétences par Famille de Métiers

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Définir la criticité des compétences par famille de métiers pour le moteur de raisonnement. Cette grille permet d'évaluer le niveau de criticité (bloquant / significatif / mineur) d'une compétence manquante en fonction du contexte du poste.

---

## 2. Niveaux de Criticité

### 2.1 Bloquant

La compétence est indispensable pour le poste. Son absence empêche le candidat d'opérer efficacement.

**Impact :** Élevé  
**Compensation :** Difficile, formation longue requise  
**Délai d'acquisition acceptable :** > 6 mois non acceptable

### 2.2 Significatif

La compétence est importante mais peut être compensée par d'autres facteurs (équipe, transfert, formation).

**Impact :** Modéré  
**Compensation :** Possible via formation ou support équipe  
**Délai d'acquisition acceptable :** 3-6 mois acceptable avec support

### 2.3 Mineur

La compétence est souhaitable mais non critique. Son absence n'impacte pas significativement l'opérationnel.

**Impact :** Faible  
**Compensation :** Formation courte ou auto-apprentissage  
**Délai d'acquisition acceptable :** 1-3 mois acceptable

---

## 3. Grille par Famille de Métiers

### 3.1 Cloud & DevOps

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **Kubernetes** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Si équipe a expert Kubernetes → Significatif |
| **Docker** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Si équipe a expert Docker → Significatif |
| **Terraform** | Senior: Bloquant, Lead: Significatif, Junior: Mineur | Si IaC géré par équipe → Mineur |
| **AWS/Azure/GCP** | Senior: Bloquant, Lead: Significatif, Junior: Significatif | Si multi-cloud non requis → Mineur |
| **CI/CD** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si pipeline existant → Mineur |
| **Monitoring** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si équipe dédiée monitoring → Mineur |
| **Linux** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Si environnement Windows pur → Non applicable |

### 3.2 Data Engineering

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **Python** | Senior: Bloquant, Lead: Bloquant, Junior: Bloquant | Jamais réductible |
| **SQL** | Senior: Bloquant, Lead: Bloquant, Junior: Bloquant | Jamais réductible |
| **Spark** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si batch processing non requis → Mineur |
| **Kafka** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si streaming non requis → Mineur |
| **Airflow** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si orchestration externe → Mineur |
| **DBT** | Senior: Mineur, Lead: Significatif, Junior: Mineur | Si transformation simple → Mineur |
| **Snowflake/Databricks** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si on-premise requis → Non applicable |

### 3.3 Data Science & ML

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **Machine Learning** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Si rôle analytics pur → Mineur |
| **Deep Learning** | Senior: Significatif, Lead: Significatif, Junior: Mineur | si ML classique suffisant → Mineur |
| **Statistics** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **MLOps** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si déploiement géré par équipe → Mineur |
| **Computer Vision** | Senior: Significatif, Lead: Mineur, Junior: Mineur | Si non requis → Non applicable |
| **NLP** | Senior: Significatif, Lead: Mineur, Junior: Mineur | Si non requis → Non applicable |

### 3.4 Backend Development

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **Java** | Senior: Significatif, Lead: Significatif, Junior: Significatif | Si stack différent → Non applicable |
| **Node.js** | Senior: Significatif, Lead: Significatif, Junior: Significatif | Si stack différent → Non applicable |
| **Go** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si performance non critique → Mineur |
| **Rust** | Senior: Mineur, Lead: Mineur, Junior: Mineur | Toujours mineur |
| **API Design** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **Microservices** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si monolithique → Non applicable |
| **GraphQL** | Senior: Mineur, Lead: Significatif, Junior: Mineur | Si REST suffisant → Mineur |

### 3.5 Frontend Development

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **JavaScript** | Senior: Bloquant, Lead: Bloquant, Junior: Bloquant | Jamais réductible |
| **TypeScript** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si projet simple → Mineur |
| **React** | Senior: Significatif, Lead: Significatif, Junior: Significatif | Si framework différent → Non applicable |
| **Angular** | Senior: Significatif, Lead: Significatif, Junior: Significatif | Si framework différent → Non applicable |
| **Vue.js** | Senior: Significatif, Lead: Significatif, Junior: Significatif | Si framework différent → Non applicable |
| **Next.js/Nuxt.js** | Senior: Mineur, Lead: Significatif, Junior: Mineur | Si SSR non requis → Mineur |
| **CSS/Tailwind** | Senior: Significatif, Lead: Mineur, Junior: Significatif | Si designer dédié → Mineur |

### 3.6 Mobile Development

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **Swift** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Si Android uniquement → Non applicable |
| **Kotlin** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Si iOS uniquement → Non applicable |
| **Flutter** | Senior: Significatif, Lead: Significatif, Junior: Significatif | Si natif requis → Non applicable |
| **React Native** | Senior: Significatif, Lead: Significatif, Junior: Significatif | Si natif requis → Non applicable |
| **iOS/Android** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si cross-platform → Mineur |

### 3.7 Cybersecurity

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **Network Security** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **Application Security** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **Cloud Security** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si on-premise → Non applicable |
| **Penetration Testing** | Senior: Mineur, Lead: Significatif, Junior: Mineur | Si équipe dédiée → Mineur |
| **Compliance (GDPR, SOC2)** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si non requis réglementairement → Mineur |

### 3.8 Product Management

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **Agile/Scrum** | Senior: Significatif, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **User Research** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si équipe UX dédiée → Mineur |
| **Data Analysis** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **Business Strategy** | Senior: Bloquant, Lead: Bloquant, Junior: Mineur | Si junior → Mineur |
| **Roadmapping** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si junior → Mineur |

### 3.9 Architecture

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **System Design** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **Software Architecture** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **Enterprise Architecture** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si non entreprise → Non applicable |
| **Solution Architecture** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si junior → Mineur |

### 3.10 DevOps & SRE

| Compétence | Criticité par Niveau | Contexte de Réduction |
|-----------|---------------------|----------------------|
| **Incident Management** | Senior: Bloquant, Lead: Bloquant, Junior: Significatif | Jamais réductible |
| **SLA/SLO Management** | Senior: Significatif, Lead: Bloquant, Junior: Mineur | Si junior → Mineur |
| **Capacity Planning** | Senior: Significatif, Lead: Significatif, Junior: Mineur | Si junior → Mineur |
| **Chaos Engineering** | Senior: Mineur, Lead: Significatif, Junior: Mineur | Si non requis → Non applicable |

---

## 4. Règles d'Application

### 4.1 Règle de Base

La criticité d'une compétence dépend de :
1. **La famille de métiers** du poste
2. **Le niveau de séniorité** requis
3. **Le contexte de l'équipe** (compétences couvertes)
4. **Les contraintes organisationnelles**

### 4.2 Réduction de Criticité

Une compétence peut voir sa criticité réduite si :
- L'équipe possède déjà cette compétence (expert disponible)
- La compétence peut être acquise rapidement (< 3 mois)
- Le candidat montre une capacité d'apprentissage rapide
- Le poste est junior avec plan de formation structuré

### 4.3 Augmentation de Criticité

Une compétence peut voir sa criticité augmentée si :
- L'équipe est petite et ne peut pas absorber le manque
- Le délai d'acquisition dépasse les contraintes opérationnelles
- La compétence est critique pour la sécurité ou la conformité
- Le poste est senior avec responsabilités d'architecture

---

## 5. Implémentation

La grille est implémentée dans `GapAnalyzerService` et `ContextAnalyzerService`.

**Logique :**

1. **Criticité initiale** : Déterminée par la grille selon famille de métiers et niveau
2. **Ajustement contexte équipe** : Si équipe a expert → réduction possible
3. **Ajustement transfert** : Si transfert crédible → réduction possible
4. **Ajustement délai** : Si délai > contraintes → augmentation possible

---

## 6. Exemples d'Application

### Exemple 1 : Kubernetes pour Senior DevOps

**Contexte :** Senior DevOps, équipe de 5 personnes, 2 experts Kubernetes

**Analyse :**
- Criticité initiale : Bloquant (selon grille)
- Ajustement équipe : Réduit à Significatif (experts disponibles)
- Ajustement transfert : Candidat a Docker + Terraform → Réduit à Mineur
- **Criticité finale : Mineur**

### Exemple 2 : Python pour Junior Data Scientist

**Contexte :** Junior Data Scientist, équipe de 3 personnes, aucun expert Python

**Analyse :**
- Criticité initiale : Bloquant (selon grille)
- Ajustement équipe : Pas de réduction (pas d'expert)
- Ajustement transfert : Pas applicable (Python est base)
- **Criticité finale : Bloquant**

### Exemple 3 : React pour Senior Frontend

**Contexte :** Senior Frontend, équipe de 4 personnes, stack Angular

**Analyse :**
- Criticité initiale : Significatif (selon grille)
- Ajustement équipe : Pas de réduction (stack différente)
- Ajustement transfert : Candidat a JavaScript → Réduit à Mineur
- **Criticité finale : Mineur**

---

## 7. Maintenance

La grille doit être révisée :
- Annuellement pour ajuster les criticités selon l'évolution du marché
- Lors de l'ajout de nouvelles familles de métiers
- Basé sur les retours d'expérience des recruteurs
- Basé sur les données d'apprentissage (MVP-007 Knowledge Learning)

---

## 8. Intégration avec KP-001 et KP-002

La grille est alignée avec :
- **KP-001 Métiers** : Définit les familles de métiers
- **KP-002 Compétences** : Définit les compétences par famille

La criticité est un attribut supplémentaire qui enrichit les KP existants pour le raisonnement contextuel.
