# 💸 FINOPS & COST OPTIMIZATION BLUEPRINT

Ce document formalise la stratégie de rationalisation des coûts et d'optimisation de l'infrastructure pour assurer la rentabilité et la scalabilité de la plateforme.

---

## 1. LLM COST OPTIMIZATION (LEVIER #1)

### 1.1 Model Routing (Tiering)
- **Small/Cheap Model** (Classification, Intent detection).
- **Medium Model** (ATS scoring).
- **Large/Expensive Model** (CV Rewrite final, Deep behavioral analysis).

### 1.2 Response Caching (Semantic Cache)
- Règle stricte : `if same CV + same job + same prompt → reuse result`.
- Cache Key : `hash(cv_text + job_desc + prompt_version)`.

### 1.3 Progressive AI
- Générer un "Quick Score" avec un modèle cheap en front.
- N'enrichir le profil et faire la "Full analysis" que si l'utilisateur engage avec le produit.

### 1.4 Token Guard
- Limites strictes : `max_tokens_per_user_per_day` et `max_tokens_per_session` pour prévenir les abus silencieux (DDoS AI).

---

## 2. EVENT SYSTEM & POSTGRES (LEVIER #2)

### 2.1 Batching Intelligent
- Éviter le 1 event = 1 write.
- Bufferiser les events en mémoire (SIL Ingestor) et effectuer un `batch insert` de 50 à 200 events. Réduit la charge I/O de -50%.

### 2.2 Event Compression & Filtering
- Ne stocker que les changements d'état (`state changes`) et les événements métiers (`business events`).
- Exclure rigoureusement les UI noise (mouse events, partial keystrokes).

### 2.3 Partitioning & Indexing
- Partitionnement des tables lourdes : `events_tenant_id` et `ledger_batches_date`.
- Limiter les index strictement à : `sessionId`, `tenantId`, `timestamp`.

### 2.4 Replay Snapshotting
- Ne pas rejouer 10 000 events pour reconstruire l'état d'un Replay.
- Modèle : `Replay = Snapshot + Delta Events` (division par 10 du coût CPU).

---

## 3. KAFKA OPTIMIZATION

- **Right-sizing Partitions** : Règle cible `Partitions = 2 à 3 × Nombre_de_consumers`.
- **Retention Policy** : Hot data (24-72h sur Kafka), Cold data (archivé sur Postgres ou S3 uniquement). Permet -40% de coût de stockage.

---

## 4. OBSERVABILITY & LOGS (LEVIER #3)

- **Log Sampling** : Les logs coûtent cher. Règle : `100% Errors | 10% Success | 1% Debug`.
- **Trace Sampling** : Ne conserver les traces OpenTelemetry que sur les requêtes lentes ou en erreur.

---

### 💰 IMPACT GLOBAL ATTENDU
- **-50% sur les coûts d'IA.**
- **-60% sur les coûts de Logging.**
- **-50% d'I/O DB (grâce au batching et snapshots).**
- Augmentation de 2 à 3x du throughput maximal sans ajouter de serveurs physiques.
