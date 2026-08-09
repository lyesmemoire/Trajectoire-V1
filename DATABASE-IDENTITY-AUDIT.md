# DATABASE IDENTITY AUDIT

**TIMESTAMP:** 2026-08-09T10:51:12.306Z
**PHASE:** DATABASE_IDENTITY_AUDIT
**MODE:** READ_ONLY
**MUTATIONS PERFORMED:** NONE

---

## 1. CONNEXION EFFECTIVE

**DATABASE_URL TARGET:**
```
postgresql://postgres.bzxdozzbdvzgvgshyamp:***@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

**DIRECT_URL TARGET:**
```
postgresql://postgres.bzxdozzbdvzgvgshyamp:***@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

**SUPABASE PROJECT:**
```
bzxdozzbdvzgvgshyamp
```

**DATABASE NAME:**
```
postgres
```

**POSTGRES USER:**
```
postgres
```

**CURRENT SCHEMA:**
```
public
```

---

## 2. INSTANCE SUPABASE

**SUPABASE PROJECT REF EXTRACTED:** bzxdozzbdvzgvgshyamp
**EXPECTED PROJECT REF:** bzxdozzbdvzgvgshyamp
**PROJECT MATCH:** YES

---

## 3. TOUS LES SCHÉMAS

| schema_name | table_count | view_count |
|-------------|-------------|------------|
| auth | 23 | 0 |
| cron | 2 | 0 |
| extensions | 2 | 2 |
| graphql | 0 | 0 |
| graphql_public | 0 | 0 |
| pgbouncer | 0 | 0 |
| public | 0 | 0 |
| realtime | 3 | 0 |
| storage | 8 | 0 |
| vault | 2 | 1 |

---

## 4. TABLES TRAJECTOIRE

**SEARCHED TABLES:** User, users, CV, Job, Subscription, Graph, graphs, GraphNode, graph_nodes, GraphEdge, graph_edges, GraphVersion, graph_versions, GraphSnapshot, graph_snapshots, PreviewAnalysis

**FOUND:**
| schema | table | exists |
|--------|-------|--------|
| auth | users | EXISTS |

**NOTE:** `auth.users` est une table système Supabase, pas une table Trajectoire.

---

## 5. COLONNES MÉTIER

**BUSINESS COLUMNS FOUND:** 37 colonnes dans les schémas auth, storage, realtime, vault

**Toutes les colonnes métier trouvées sont dans les tables système Supabase:**
- auth.* (user_id, email, created_at)
- storage.* (owner_id, created_at)
- realtime.subscription (created_at)
- vault.* (created_at)

**AUCUNE colonne métier dans le schéma public.**

---

## 6. CONTENU DE LA BASE

**PUBLIC TABLES:** 0
**OTHER NON-SYSTEM TABLES:** 40 (auth: 23, cron: 2, extensions: 2, realtime: 3, storage: 8, vault: 2)

**Toutes les tables non-système sont des tables Supabase.**

---

## 7. PRISMA MIGRATIONS

**_prisma_migrations FOUND:** NO
**PRISMA MIGRATIONS TABLE:** ABSENT dans tous les schémas

---

## 8. IDENTITÉ POSTGRESQL

**CURRENT_DATABASE:** postgres
**CURRENT_USER:** postgres
**CURRENT_SCHEMA:** public
**SERVER_ADDR:** 2a05:d018:10e0:3300:4818:b1fd:d6f4:c6de
**SERVER_PORT:** 5432
**VERSION:** PostgreSQL 17.6 on x86_64-pc-linux-gnu

---

## 9. COMPARAISON DATABASE_URL / DIRECT_URL

**DATABASE_URL SET:** YES
**DIRECT_URL SET:** YES
**URLS MATCH:** YES

---

## 10. PROJECT REF SUPABASE

**EXTRACTED PROJECT REF:** bzxdozzbdvzgvgshyamp
**EXPECTED PROJECT REF:** bzxdozzbdvzgvgshyamp
**PROJECT REF MATCH:** YES

---

## 11. DIAGNOSTIC

**PUBLIC TABLE COUNT:** 0
**PUBLIC EMPTY:** YES
**TRAJECTOIRE TABLES FOUND:** YES (mais seulement auth.users - système Supabase)
**PRISMA MIGRATIONS FOUND:** NO

**DIAGNOSIS:** DATABASE_NOT_INITIALIZED

**CONCLUSION:**
- Le projet Supabase est correct (bzxdozzbdvzgvgshyamp)
- La connexion DATABASE_URL est correcte
- Le schéma public est vide
- Aucune table Trajectoire n'existe
- Aucune migration Prisma n'a été appliquée
- Les seules tables existantes sont les tables système Supabase

---

## 12. FINAL STATUS

**DATABASE_URL == EXPECTED PROJECT:** YES
**DIRECT_URL == EXPECTED PROJECT:** YES

**DATABASE IDENTITY:** CONFIRMED

**DATA LOSS EVIDENCE:** NONE (les données n'ont jamais existé dans cette base)

**MUTATIONS PERFORMED:** NONE

**STATUS:** BLOCKED

**REASON:** READ_ONLY_AUDIT_COMPLETE - DATABASE_NOT_INITIALIZED

---

## RECOMMANDATIONS

1. **INITIALISER LA BASE:** Les tables Trajectoire doivent être créées via Prisma Migrate
2. **APPLIQUER LES MIGRATIONS:** Exécuter `prisma migrate deploy` pour créer toutes les tables
3. **VÉRIFIER L'EXTENSION VECTOR:** L'extension `vector` est absente et doit être installée
4. **CONTRÔLER LA STRATÉGIE:** Déterminer si c'est une base vierge ou si les données sont ailleurs

**ATTENTION:** L'instruction précédente mentionnait "La base contient déjà des données utilisateurs". L'audit révèle que le schéma public est vide. Il y a une incohérence entre l'attente et la réalité.
