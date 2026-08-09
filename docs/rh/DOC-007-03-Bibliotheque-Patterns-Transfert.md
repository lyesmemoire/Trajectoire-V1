# DOC-007-03 : Bibliothèque des Patterns de Transfert de Compétences

**Version:** 1.0  
**Date:** 2026-08-03  
**Statut:** Draft  
**Auteur:** Trajectoire Team

---

## 1. Objectif

Documenter la bibliothèque de patterns de transfert de compétences utilisée par le moteur de raisonnement pour identifier les compétences transférables.

---

## 2. Concept de Pattern de Transfert

Un pattern de transfert définit comment une compétence cible peut être acquise à partir de compétences prérequis déjà maîtrisées par le candidat.

### 2.1 Structure d'un Pattern

```typescript
interface TransferPattern {
  prerequisites: string[];      // Compétences prérequis
  weights: Record<string, number>;  // Pondération de chaque prérequis
  minPrerequisites: number;    // Nombre minimum de prérequis requis
}
```

### 2.2 Calcul de la Solidité du Transfert

```
solidity = Σ(weights[prérequis maîtrisés]) + bonus_apprentissage_rapide + bonus_progression_carrière
```

- Si `solidity >= 0.6` et `prérequis_maîtrisés >= minPrerequisites` : Transfert crédible
- Délai estimé : fonction de la solidité (0.8 → 1-2 mois, 0.6 → 2-3 mois, etc.)

---

## 3. Patterns par Catégorie

### 3.1 Cloud & Infrastructure

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Kubernetes | Docker (0.3), Terraform (0.25), AWS (0.2), Linux (0.15) | 4 | 2 | 2-3 mois |
| Cloud Architecture | AWS (0.3), Azure (0.25), DevOps (0.25), Networking (0.2) | 4 | 2 | 2-3 mois |
| Terraform | Cloud Computing (0.25), DevOps (0.3), IaC (0.25), AWS (0.2) | 4 | 2 | 1-2 mois |
| GCP | Cloud Computing (0.3), AWS (0.3), DevOps (0.2), Infrastructure (0.2) | 4 | 2 | 2-3 mois |
| Azure | Cloud Computing (0.3), AWS (0.3), DevOps (0.2), Infrastructure (0.2) | 4 | 2 | 2-3 mois |
| DigitalOcean | Cloud Computing (0.3), Linux (0.3), DevOps (0.2), Infrastructure (0.2) | 4 | 2 | 1-2 mois |
| Heroku | Cloud Computing (0.3), PaaS (0.3), Deployment (0.2), Git (0.2) | 4 | 2 | 1 mois |
| Vercel | JavaScript (0.3), React (0.3), Deployment (0.2), Frontend (0.2) | 4 | 2 | 1 mois |
| Netlify | JavaScript (0.3), React (0.3), Deployment (0.2), Frontend (0.2) | 4 | 2 | 1 mois |

### 3.2 DevOps & CI/CD

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| DevOps | Docker (0.3), Git (0.25), CI/CD (0.25), Linux (0.2) | 4 | 2 | 2-3 mois |
| Microservices | Docker (0.25), Kubernetes (0.25), API Design (0.25), Distributed Systems (0.25) | 4 | 2 | 3-4 mois |
| SRE | DevOps (0.3), Monitoring (0.25), Incident Management (0.2), Kubernetes (0.25) | 4 | 2 | 2-3 mois |
| Jenkins | DevOps (0.3), CI/CD (0.3), Java (0.2), Automation (0.2) | 4 | 2 | 1-2 mois |
| GitLab CI | Git (0.3), DevOps (0.3), CI/CD (0.2), Docker (0.2) | 4 | 2 | 1-2 mois |
| GitHub Actions | Git (0.3), DevOps (0.3), CI/CD (0.2), YAML (0.2) | 4 | 2 | 1-2 mois |
| Ansible | Linux (0.3), DevOps (0.3), Automation (0.2), Configuration Management (0.2) | 4 | 2 | 1-2 mois |
| Prometheus | Monitoring (0.3), DevOps (0.25), Kubernetes (0.25), Time Series DBs (0.2) | 4 | 2 | 2-3 mois |
| Grafana | Monitoring (0.3), Data Visualization (0.3), Time Series DBs (0.2), Metrics (0.2) | 4 | 2 | 1-2 mois |
| Elastic Stack | Elasticsearch (0.3), Kibana (0.25), Logstash (0.25), Beats (0.2) | 4 | 2 | 2-3 mois |
| Splunk | Log Analysis (0.3), Monitoring (0.25), Data Analysis (0.25), Security (0.2) | 4 | 2 | 2-3 mois |
| Nginx | Web Servers (0.3), Linux (0.25), Networking (0.25), Load Balancing (0.2) | 4 | 2 | 1-2 mois |

### 3.3 Data Engineering & Big Data

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Data Engineering | Python (0.3), SQL (0.3), ETL (0.2), Big Data (0.2) | 4 | 2 | 2-3 mois |
| Spark | Python (0.3), Scala (0.25), Big Data (0.25), Data Engineering (0.2) | 4 | 2 | 2-3 mois |
| Hadoop | Java (0.3), Big Data (0.3), Distributed Systems (0.2), Data Engineering (0.2) | 4 | 2 | 3-4 mois |
| Apache Beam | Data Processing (0.3), Java (0.25), Python (0.25), Big Data (0.2) | 4 | 2 | 2-3 mois |
| Apache Flink | Streaming (0.3), Java (0.3), Big Data (0.2), Data Engineering (0.2) | 4 | 2 | 2-3 mois |
| Apache Kafka | Message Queues (0.3), Streaming (0.25), Distributed Systems (0.25), Java (0.2) | 4 | 2 | 2-3 mois |
| Snowflake | SQL (0.3), Data Warehousing (0.3), Cloud Computing (0.2), Data Engineering (0.2) | 4 | 2 | 2-3 mois |
| Databricks | Spark (0.3), Python (0.25), Machine Learning (0.25), Data Engineering (0.2) | 4 | 2 | 2-3 mois |
| Airflow | Python (0.3), Data Engineering (0.3), Workflow Orchestration (0.2), ETL (0.2) | 4 | 2 | 2-3 mois |
| DBT | SQL (0.3), Data Engineering (0.3), Data Transformation (0.2), Analytics Engineering (0.2) | 4 | 2 | 1-2 mois |

### 3.4 Data & Analytics

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Machine Learning | Python (0.3), Statistics (0.25), SQL (0.2), Data Analysis (0.15) | 4 | 2 | 3-4 mois |
| AI/ML Engineering | Python (0.25), Machine Learning (0.3), Deep Learning (0.25), MLOps (0.2) | 4 | 2 | 4-6 mois |
| Computer Vision | Python (0.3), Machine Learning (0.3), Image Processing (0.2), Deep Learning (0.2) | 4 | 2 | 3-4 mois |
| NLP | Python (0.3), Machine Learning (0.3), Deep Learning (0.2), Linguistics (0.2) | 4 | 2 | 3-4 mois |
| Speech Recognition | Python (0.3), Machine Learning (0.3), Audio Processing (0.2), Deep Learning (0.2) | 4 | 2 | 3-4 mois |
| Recommendation Systems | Python (0.3), Machine Learning (0.3), Data Analysis (0.2), Algorithms (0.2) | 4 | 2 | 3-4 mois |
| Anomaly Detection | Python (0.3), Machine Learning (0.3), Statistics (0.2), Data Analysis (0.2) | 4 | 2 | 2-3 mois |
| Time Series Analysis | Python (0.3), Statistics (0.3), Data Analysis (0.2), Forecasting (0.2) | 4 | 2 | 2-3 mois |
| Tableau | Data Visualization (0.3), SQL (0.25), Data Analysis (0.25), BI (0.2) | 4 | 2 | 1-2 mois |
| Power BI | Data Visualization (0.3), SQL (0.25), Data Analysis (0.25), BI (0.2) | 4 | 2 | 1-2 mois |
| Looker | Data Visualization (0.3), SQL (0.25), Data Analysis (0.25), BI (0.2) | 4 | 2 | 1-2 mois |

### 3.5 Frontend & Web Development

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| React | JavaScript (0.4), HTML (0.2), CSS (0.2), TypeScript (0.2) | 4 | 2 | 1-2 mois |
| Angular | TypeScript (0.35), JavaScript (0.3), Frontend (0.2), SPA (0.15) | 4 | 2 | 2-3 mois |
| Vue.js | JavaScript (0.35), Frontend (0.3), Web Development (0.2), SPA (0.15) | 4 | 2 | 1-2 mois |
| Next.js | React (0.35), JavaScript (0.25), TypeScript (0.25), SSR (0.15) | 4 | 2 | 1-2 mois |
| Nuxt.js | Vue (0.35), JavaScript (0.25), TypeScript (0.25), SSR (0.15) | 4 | 2 | 1-2 mois |
| Svelte | JavaScript (0.35), Frontend (0.3), Web Development (0.2), Reactivity (0.15) | 4 | 2 | 1-2 mois |
| Ember.js | JavaScript (0.35), Frontend (0.3), SPA (0.2), MVC (0.15) | 4 | 2 | 2-3 mois |
| Backbone.js | JavaScript (0.35), Frontend (0.3), SPA (0.2), MVC (0.15) | 4 | 2 | 2-3 mois |
| jQuery | JavaScript (0.4), DOM (0.3), Frontend (0.15), Web Development (0.15) | 4 | 2 | 1 mois |
| TypeScript | JavaScript (0.4), Static Typing (0.3), Frontend (0.15), Backend (0.15) | 4 | 2 | 1-2 mois |

### 3.6 Backend Development

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| GraphQL | REST API (0.3), JavaScript (0.25), TypeScript (0.25), API Design (0.2) | 4 | 2 | 1-2 mois |
| Redis | SQL (0.25), NoSQL (0.3), Caching (0.25), Database Design (0.2) | 4 | 2 | 1-2 mois |
| Elasticsearch | SQL (0.2), NoSQL (0.3), Search Algorithms (0.3), Data Indexing (0.2) | 4 | 2 | 2-3 mois |
| RabbitMQ | Message Queues (0.3), Microservices (0.25), Distributed Systems (0.25), API Design (0.2) | 4 | 2 | 1-2 mois |
| Kafka | Message Queues (0.3), Streaming (0.25), Distributed Systems (0.25), Data Engineering (0.2) | 4 | 2 | 2-3 mois |
| Go | C (0.3), Concurrency (0.3), Systems Programming (0.2), Backend (0.2) | 4 | 2 | 2-3 mois |
| Rust | C++ (0.35), Systems Programming (0.3), Memory Management (0.2), Performance (0.15) | 4 | 2 | 3-4 mois |
| Deno | JavaScript (0.3), TypeScript (0.3), Node.js (0.25), Runtime (0.15) | 4 | 2 | 1-2 mois |
| Bun | JavaScript (0.3), TypeScript (0.3), Node.js (0.25), Runtime (0.15) | 4 | 2 | 1-2 mois |

### 3.7 Mobile Development

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Mobile Development | JavaScript (0.25), React (0.25), TypeScript (0.25), Native Development (0.25) | 4 | 2 | 2-3 mois |
| Swift | Objective-C (0.3), Mobile Development (0.3), iOS (0.2), Apple Ecosystem (0.2) | 4 | 2 | 2-3 mois |
| Kotlin | Java (0.35), Android (0.3), Mobile Development (0.2), JVM (0.15) | 4 | 2 | 2-3 mois |
| Dart | JavaScript (0.25), Mobile Development (0.3), Flutter (0.25), Cross-Platform (0.2) | 4 | 2 | 1-2 mois |
| Flutter | Dart (0.35), Mobile Development (0.3), Cross-Platform (0.2), UI Development (0.15) | 4 | 2 | 2-3 mois |
| React Native | React (0.35), JavaScript (0.3), Mobile Development (0.2), Cross-Platform (0.15) | 4 | 2 | 2-3 mois |
| Ionic | JavaScript (0.3), Angular (0.3), Mobile Development (0.2), Cross-Platform (0.2) | 4 | 2 | 2-3 mois |
| Cordova | JavaScript (0.3), HTML (0.25), CSS (0.25), Mobile Development (0.2) | 4 | 2 | 1-2 mois |
| Xamarin | C# (0.35), .NET (0.3), Mobile Development (0.2), Cross-Platform (0.15) | 4 | 2 | 3-4 mois |

### 3.8 Desktop Development

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Electron | JavaScript (0.3), Node.js (0.3), Desktop Development (0.2), Cross-Platform (0.2) | 4 | 2 | 1-2 mois |
| Tauri | Rust (0.35), JavaScript (0.25), Desktop Development (0.2), Web Technologies (0.2) | 4 | 2 | 2-3 mois |

### 3.9 Blockchain & Web3

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Blockchain | Cryptography (0.3), Distributed Systems (0.3), Smart Contracts (0.2), Web3 (0.2) | 4 | 2 | 4-6 mois |
| Solidity | JavaScript (0.25), Blockchain (0.3), Smart Contracts (0.25), Web3 (0.2) | 4 | 2 | 2-3 mois |
| Web3 Development | JavaScript (0.25), Blockchain (0.3), Smart Contracts (0.25), Ethereum (0.2) | 4 | 2 | 3-4 mois |
| Smart Contracts | Solidity (0.35), Blockchain (0.3), Cryptography (0.2), Security (0.15) | 4 | 2 | 2-3 mois |
| DeFi | Blockchain (0.3), Smart Contracts (0.3), Finance (0.2), Web3 (0.2) | 4 | 2 | 3-4 mois |
| NFT Development | Blockchain (0.3), Smart Contracts (0.3), Web3 (0.2), Digital Assets (0.2) | 4 | 2 | 2-3 mois |

### 3.10 Game Development

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Game Development | C++ (0.25), C# (0.25), Unity (0.25), Unreal Engine (0.25) | 4 | 2 | 3-4 mois |
| Unity | C# (0.35), Game Development (0.3), 3D Graphics (0.2), Physics (0.15) | 4 | 2 | 2-3 mois |
| Unreal Engine | C++ (0.35), Game Development (0.3), 3D Graphics (0.2), Blueprints (0.15) | 4 | 2 | 3-4 mois |
| Godot | GDScript (0.35), Game Development (0.3), 2D Graphics (0.2), 3D Graphics (0.15) | 4 | 2 | 2-3 mois |
| AR | 3D Graphics (0.3), Computer Vision (0.25), Mobile Development (0.25), Unity (0.2) | 4 | 2 | 3-4 mois |
| VR | 3D Graphics (0.3), Computer Vision (0.25), Unity (0.25), Unreal Engine (0.2) | 4 | 2 | 3-4 mois |

### 3.11 AI Ethics & Responsible AI

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| AI Ethics | Machine Learning (0.3), Ethics (0.3), Data Ethics (0.2), Responsible AI (0.2) | 4 | 2 | 2-3 mois |
| Responsible AI | Machine Learning (0.3), AI Ethics (0.3), Fairness (0.2), Explainability (0.2) | 4 | 2 | 2-3 mois |
| Model Interpretability | Machine Learning (0.3), Deep Learning (0.3), Explainability (0.2), Data Science (0.2) | 4 | 2 | 2-3 mois |
| Model Fairness | Machine Learning (0.3), AI Ethics (0.3), Statistics (0.2), Data Analysis (0.2) | 4 | 2 | 2-3 mois |
| Model Robustness | Machine Learning (0.3), Deep Learning (0.3), Security (0.2), Testing (0.2) | 4 | 2 | 2-3 mois |

### 3.12 MLOps & Data Ops

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| MLOps | Machine Learning (0.3), DevOps (0.3), Data Engineering (0.2), Automation (0.2) | 4 | 2 | 2-3 mois |
| Data Ops | Data Engineering (0.3), DevOps (0.3), Automation (0.2), Data Quality (0.2) | 4 | 2 | 2-3 mois |
| Model Ops | Machine Learning (0.3), MLOps (0.3), DevOps (0.2), Monitoring (0.2) | 4 | 2 | 2-3 mois |

### 3.13 Data Governance & Privacy

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Data Governance | Data Management (0.3), Compliance (0.3), Data Quality (0.2), Policy (0.2) | 4 | 2 | 2-3 mois |
| Data Privacy | Compliance (0.3), GDPR (0.3), Data Governance (0.2), Security (0.2) | 4 | 2 | 2-3 mois |
| Data Ethics | Data Governance (0.3), Ethics (0.3), Compliance (0.2), AI Ethics (0.2) | 4 | 2 | 2-3 mois |

### 3.14 Product Management & UX

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Product Management | Agile (0.25), User Research (0.25), Data Analysis (0.25), Business Strategy (0.25) | 4 | 2 | 2-3 mois |
| UX/UI Design | User Research (0.3), Prototyping (0.25), Visual Design (0.25), Design Systems (0.2) | 4 | 2 | 2-3 mois |
| Growth Hacking | Marketing (0.3), Data Analysis (0.3), Product Management (0.2), Analytics (0.2) | 4 | 2 | 2-3 mois |
| A/B Testing | Statistics (0.35), Data Analysis (0.3), Experimental Design (0.2), Product Analytics (0.15) | 4 | 2 | 1-2 mois |

### 3.15 Technical Writing & Developer Relations

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Technical Writing | Documentation (0.3), Technical Knowledge (0.3), Communication (0.2), English (0.2) | 4 | 2 | 1-2 mois |
| API Documentation | Technical Writing (0.3), API Design (0.3), REST (0.2), Swagger (0.2) | 4 | 2 | 1-2 mois |
| Developer Relations | Technical Communication (0.3), Community Management (0.25), Coding (0.25), Presentation (0.2) | 4 | 2 | 2-3 mois |
| Technical Sales | Technical Knowledge (0.3), Sales (0.3), Communication (0.2), Product Knowledge (0.2) | 4 | 2 | 1-2 mois |

### 3.16 Architecture

| Compétence Cible | Prérequis | Weights | Min Prérequis | Délai Estimé |
|------------------|-----------|---------|---------------|--------------|
| Solution Architecture | Software Architecture (0.3), Cloud Computing (0.25), System Design (0.25), Business Analysis (0.2) | 4 | 2 | 3-4 mois |
| Enterprise Architecture | Solution Architecture (0.3), Business Strategy (0.25), IT Governance (0.25), Strategic Planning (0.2) | 4 | 2 | 4-6 mois |

---

## 4. Implémentation

La bibliothèque est implémentée dans `apps/api/src/reasoning/transfer-patterns.service.ts`.

**Nombre total de patterns :** 100+

**Initialisation :** Les patterns sont chargés au démarrage du service dans le constructeur.

**Utilisation :** Le service `GapAnalyzerService` utilise `TransferPatternsService` pour analyser la transférabilité des compétences manquantes.

---

## 5. Extension

Pour ajouter un nouveau pattern :

1. Ajouter une entrée dans la méthode `initializeTransferPatterns()` ou `addAdditionalPatterns()`
2. Définir les prérequis avec leurs pondérations
3. Définir le nombre minimum de prérequis requis
4. Le pattern sera automatiquement disponible pour l'analyse

---

## 6. Validation

Les patterns sont basés sur :
- KP-002 Compétences
- KP-001 Métiers
- Meilleures pratiques de l'industrie
- Retours d'expérience de recrutement

Les pondérations et délais estimés sont sujets à ajustement basé sur les données d'apprentissage (MVP-007 Knowledge Learning).
